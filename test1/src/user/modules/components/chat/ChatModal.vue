<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div
      class="modal-content"
      ref="modalContent"
      @mousedown="startDrag"
      @mouseup="stopDrag"
      @mousemove="drag"
    >
      <button class="modal-close" @click="close">×</button>
      <slot></slot>
      <!-- 사용자한테만 보이는 안내창 -->
      <div v-show="role == 'USR'"></div>
      <!-- /사용자한테만 보이는 안내창 -->

      <!-- 메시지 -->
      <div v-for="(msg, index) in messages" :key="index">
        <p>{{ msg.nick }} : {{ msg.content }}</p>
      </div>
      <!-- /메시지 -->
      <div>
        <input v-model="message" placeholder="메시지 작성.." />
        <button @click="sendMessage">전송</button>
        <button @click="close">종료</button>
      </div>
      <!-- 모달 안의 내용을 삽입할 자리 -->
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from "vue";
import axios from "axios";
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
  setup(props, { emit }) {
    const userId = computed(() => props.userId);
    const nick = computed(() => props.nick);
    const role = computed(() => props.role);
    let chatroomId = computed(() => props.chatroomId);
    const visible = ref(props.modelValue);
    const modalContent = ref(null);
    let isDragging = ref(false);
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    const message = ref("");
    let messages = ref([]);
    let websocket = null;

    // 채팅 바디 생성
    const makeSendBody = (type) => {
      let content =
        type === "ENTER" ? `${nick.value}님이 입장하였습니다.` : message.value;
      console.log(chatroomId.value + " in the modal");
      const sendBody = {
        chatroomId: chatroomId.value,
        id: userId.value,
        nick: nick.value,
        content: content,
        type: type,
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
      console.log("enter");
      sendWebSocket(makeSendBody("ENTER"));
    };

    // 소켓 센드
    const sendWebSocket = (body) => {
      if (websocket.readyState === WebSocket.OPEN) {
        // 웹소켓이 연결된 상태라면 메시지 전송
        websocket.send(JSON.stringify(body));
      } else {
        console.error("WebSocket is not open");
      }
    };

    // 소켓 오픈
    const openWebSocket = () => {
      websocket = new WebSocket("ws://localhost:9090/ws/chat");

      websocket.onopen = () => {
        console.log("WebSocket connection opened");
        enterChatroom("ENTER");
      };

      websocket.onmessage = (event) => {
        let jsondata = JSON.parse(event.data);
        let pushMsg = { nick: jsondata.nick, content: jsondata.content };
        messages.value.push(pushMsg);
      };

      websocket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error: ", error);
      };
    };

    // 닫기
    const close = () => {
      chatroomId.value = "";
      messages.value = [];
      websocket.close();
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
          if (websocket === null || websocket.readyState === WebSocket.CLOSED) {
            openWebSocket();
          }
        }
      }
    );
    onMounted(() => {});

    return {
      userId,
      nick,
      role,
      chatroomId,
      visible,
      close,
      modalContent,
      startDrag,
      stopDrag,
      drag,
      websocket,
      message,
      messages,
      sendWebSocket,
      sendMessage,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  position: absolute; /* 변경: absolute로 설정하여 드래그 시 이동 가능 */
  cursor: move; /* 드래그 가능한 모양으로 변경 */
  max-width: 500px;
  width: 100%;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
