<template>
  <div v-show="visible" class="modal-overlay" @click.self="minimize">
    <div
      class="modal-content"
      ref="modalContent"
      @mousedown="startDrag"
      @mouseup="stopDrag"
      @mousemove="drag"
    >
      <button @click="minimize" style="padding: 1.6rem">최소화</button>
      <button class="modal-close" @click="close"></button>
      <slot></slot>
      <div class="userChatBox">
        <!-- 메시지 -->
        <div v-for="(msg, index) in messages" :key="index">
          <div :class="msg.id === userId ? 'message me' : 'message other'">
            <p>{{ msg.nick }} : {{ msg.content }}</p>
          </div>
        </div>
        <!-- /메시지 -->
      </div>
      <!-- 작성중입니다 -->
      <div v-if="typingUsers.length > 0">
        <p>
          <span v-for="(nick, index) in typingUsers" :key="index">
            {{ index > 0 ? "," : "" }} {{ nick }}
          </span>
          님이 작성중입니다...
        </p>
      </div>

      <!-- 입력 -->
      <div class="inputMsg">
        <input
          v-model="message"
          @keydown="keyupAction"
          placeholder="메시지 작성.."
        />
        <button @click="sendMessage" class="sendBtn">
          <img
            src="../../../../assets/images/send.svg"
            alt="전송 버튼 아이콘"
          />
        </button>
        <!--<button @click="close">종료</button>-->
      </div>
      <!-- /입력 -->
      <!-- 모달 안의 내용을 삽입할 자리 -->
    </div>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";
import emitter from "@/eventBus";
import { getCurrentDateTime } from "@/assets/js/common.js";
import {
  sendWebSocket,
  subscribeToMessages,
  unsubscribeFromMessages,
} from "@/common/WebsocketManager";

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      default: "",
    },
    nick: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "",
    },
    chatroomId: {
      type: String,
      default: "",
    },
  },
  methods: {
    // 헤더에서 로그아웃할떄.. setup에 정의된건 부모창에서 인식못함
    closeChatroom() {
      closeProcess();
    },
  },
  setup(props, { emit }) {
    const userId = computed(() => props.userId);
    const nick = computed(() => props.nick);
    const role = computed(() => props.role);
    const chatroomId = computed(() => props.chatroomId);
    const visible = ref(props.modelValue);
    const modalContent = ref(null);
    const isDragging = ref(false);
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    const message = ref("");
    const messages = ref([]);
    let typingTimeout = null;
    const typingUsers = ref([]);
    const excludedKeys = [
      "Shift",
      "Control",
      "Alt",
      "CapsLock",
      "Escape",
      "PageUp",
      "PageDown",
      "End",
      "Home",
      "ArrowLeft",
      "ArrowUp",
      "ArrowRight",
      "ArrowDown",
      "Insert",
      "Delete",
      "Meta",
      "Tab",
    ];
    function handleIncomingMessage(data) {
      const type = data.type;
      if (type == "TYPING") {
        if (!typingUsers.value.includes(data.nick) && data.nick != nick.value) {
          typingUsers.value.push(data.nick);
        }
      } else if (type == "STOP") {
        typingUsers.value = typingUsers.value.filter(
          (user) => user !== data.nick
        );
      } else {
        const pushMsg = {
          id: data.id,
          nick: data.nick,
          content: data.content,
        };
        messages.value.push(pushMsg);
      }
    }
    // 채팅 바디 생성
    const makeSendBody = (type) => {
      let content =
        type === "ENTER"
          ? `${nick.value}님이 입장하였습니다.`
          : type === "END"
          ? "대화가 종료되었습니다."
          : message.value;
      const sendBody = {
        chatroomId: chatroomId.value,
        id: userId.value,
        nick: nick.value,
        content: content,
        type: type,
        role: role.value,
      };
      return sendBody;
    };
    // 채팅 전송
    const sendMessage = () => {
      sendWebSocket(makeSendBody("TALK"));
      // 메시지 전송 후 입력란 비우기
      message.value = "";
    };

    // 채팅방 입장
    const enterChatroom = () => {
      sendWebSocket(makeSendBody("ENTER"));
    };

    const isNew = () => {
      // enter 해야되는 지 검사
      axios
        .post(`/api/chat/isNew`, {
          id: userId.value,
          chatroomId: chatroomId.value,
        })
        .then((res) => {
          var isNew = res.data;
          if (isNew) {
            if (role.value == "USR") {
              showWelcomeMsg();
            }
            enterChatroom("ENTER");
          }
        });
    };

    const showWelcomeMsg = () => {
      let pushMsg = {
        nick: "TOYCHAT",
        content: `안녕하세요! 어떻게 도와드릴까요? ${String.fromCodePoint(
          0x1f60a
        )}`,
      };
      messages.value.push(pushMsg);
    };

    const getLiveChat = () => {
      // 이전 챗 불러오기
      axios
        .post(`/api/chat/liveChatList`, {
          chatroomId: chatroomId.value,
        })
        .then((list) => {
          messages.value = list.data;
        });
    };

    //엔터로 전송
    const keyupAction = () => {
      var keyCode = window.event.keyCode;
      if (excludedKeys.includes(keyCode)) return;

      if (keyCode == 13) {
        sendMessage();
        sendWebSocket(makeSendBody("STOP"));
      } else {
        sendWebSocket(makeSendBody("TYPING"));
      }

      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        sendWebSocket(makeSendBody("STOP"));
      }, 3000);
    };

    // 채팅창 닫기
    const close = () => {
      if (confirm("종료하시겠습니까?")) {
        closeProcess();
      }
    };

    const closeProcess = () => {
      sendWebSocket(makeSendBody("END"));
      chatroomId.value = "";
      messages.value = [];
      emit("update:modelValue", false);
      emitter.emit("reset-chatroom-id");
      //websocket.close(); //*주석
    };

    // 최소화
    const minimize = () => {
      emit("update:modelValue", false);
    };

    //드래그 제어
    const startDrag = (event) => {
      isDragging.value = true;
      startX = event.clientX;
      startY = event.clientY;
      const rect = modalContent.value.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
    };
    const stopDrag = () => {
      isDragging.value = false;
    };
    const drag = (event) => {
      if (!isDragging.value) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      modalContent.value.style.left = `${initialLeft + dx}px`;
      modalContent.value.style.top = `${initialTop + dy}px`;
    };

    watch(
      () => props.modelValue,
      (newValue) => {
        visible.value = newValue;
        if (newValue) {
          getLiveChat();
          isNew();
        }
      }
    );

    onMounted(() => {
      subscribeToMessages(handleIncomingMessage);
    });

    onUnmounted(() => {
      unsubscribeFromMessages(handleIncomingMessage);
    });

    return {
      userId,
      nick,
      role,
      chatroomId,
      visible,
      keyupAction,
      close,
      modalContent,
      startDrag,
      stopDrag,
      drag,
      message,
      messages,
      makeSendBody,
      sendMessage,
      minimize,
      closeProcess,
      typingUsers,
    };
  },
};
</script>
<style scoped>
.message {
  max-width: 60%;
  padding: 10px;
  margin: 5px;
  border-radius: 8px;
}

.me {
  align-self: flex-end;
  background-color: #dcf8c6;
}

.other {
  align-self: flex-start;
  background-color: #fff;
}
</style>
