<template>
  <div class="header">
    <h1><img src="../../assets/images/logomini.svg" alt="TOYCHATLOGO" /></h1>
    <ul class="dpf">
      <li>
        <img src="../../assets/images/userlogin.svg" alt="사람 모양의 아이콘" />
        <span class="em">{{ nick }}</span
        >&nbsp;&nbsp;님&nbsp;&nbsp;&nbsp;접속중
      </li>
      <li>
        {{ sessionTime }}
      </li>
      <li>
        <a @click="fn_kakaoLogout"
          ><img
            src="../../assets/images/userlogout.svg"
            alt="로그아웃 아이콘"
          />로그아웃</a
        >
      </li>
      <li>
        <button @click="openChatModal">
          <!--         <img
            src="/src/assets/images/chat.svg"
            alt="실시간 채팅 상담(챗 모달 팝업)"
          />-->
          <div class="roadBox" title="채팅을 시작하려면 클릭해주세요!">
            <span class="circle circle1"></span>
            <span class="circle circle2"></span>
            <span class="circle circle3"></span>
          </div>
        </button>
      </li>
    </ul>
    <ChatModal
      ref="chatModal"
      v-model:modelValue="isModalVisible"
      :userId="userId"
      :nick="nick"
      :role="role"
      :chatroomId="chatroomId"
      @reset-chatroom-id="resetChatroomId"
    >
      <template #default class="chatBox">
        <h2 class="dpn">대화</h2>
        <div class="chatW">
          <ul class="chatHd">
            <li>질문이 있으신가요? 지금 문의하세요!</li>
            <li>
              <div v-if="!isActivAdmin" class="impsbChat">
                <p class="timeAlert">
                  오전 10시부터 오후 6시까지<span class="dpn"
                    >가능한 상담원이 없습니다.</span
                  >
                </p>
              </div>
              <div v-else class="psbChat">
                <p>온라인 문의가 가능한 상태입니다.</p>
                <div v-for="(value, index) in activeAdmin" :key="index">
                  {{ value }}
                </div>
                <!-- 말풍선 -->
                <p class="agentChat">안녕하세요! 어떻게 도와드릴까요?</p>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </ChatModal>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import ChatModal from "../modules/components/chat/ChatModal.vue";
import axios from "@/axios";
import emitter from "@/eventBus";
import { SESSION_TIMEOUT } from "@/constant/constants.js";
import { initWebsocket } from "@/common/websocketManager.js";
import { useChatStore } from "@/stores/chatStore";

export default {
  components: { ChatModal },
  setup() {
    const router = useRouter();
    const userId = ref(localStorage.getItem("id"));
    const nick = ref(localStorage.getItem("nick"));
    const role = ref("USR");
    const isModalVisible = ref(false);
    const chatroomId = ref(localStorage.getItem("chatroomId"));
    let activeAdminChkSocket = null;
    const activeAdmin = ref([]);
    const isActivAdmin = ref(false);
    const sessionTime = ref("");
    let sessionTimeWorker = null;
    const chatStore = useChatStore();

    // 로그아웃
    const fn_kakaoLogout = () => {
      window.Kakao.Auth.logout((res) => {
        if (res) {
          localStorage.clear();
          chatStore.resetStore();
          window.location.reload(); // 소켓종료
        }
      });
    };

    const resetChatroomId = () => {
      chatroomId.value = "";
      console.log("header에서 emit 받음");
    };
    const openChatModal = () => {
      // 채팅방 아이디
      if (chatroomId.value == "") {
        axios
          .post(`/api/chat/create`, {
            id: userId.value,
            nick: nick.value,
          })
          .then((res) => {
            chatroomId.value = res.data.chatroomId;
            isModalVisible.value = true;
          });
      } else {
        isModalVisible.value = true;
      }
    };

    // 소켓 오픈
    const openActiveAdminChkSocket = () => {
      activeAdminChkSocket = new WebSocket(
        "ws://localhost:9090/ws/adminOnList?role=usr"
      );

      activeAdminChkSocket.onopen = () => {
        console.log("activeAdminChkSocket connection opened");
      };

      activeAdminChkSocket.onmessage = (event) => {
        console.log("activeAdminChkSocket got message");
        let admStr = event.data;
        let admArr = admStr.split(",");
        activeAdmin.value = admArr;
        isActivAdmin.value = activeAdmin.value[0].length > 0;
      };

      activeAdminChkSocket.onclose = () => {
        console.log("activeAdminChkSocket connection closed");
      };

      activeAdminChkSocket.onerror = (error) => {
        console.error("activeAdminChkSocket error: ", error);
      };
    };

    const setLocalTime = () => {
      if (typeof Worker != "undefined") {
        if (!sessionTimeWorker) {
          // sessionTimeWorker를 public 바로 밑에 두고 /sessionTimeWorker.js 로 호출하면 아래와 같이 굳이 URL 안 써도 됨
          sessionTimeWorker = new Worker(
            new URL("@/worker/sessionTimeWorker.js", import.meta.url),
            { type: "module" }
          );
          sessionTimeWorker.addEventListener("message", function (e) {
            var data = e.data;

            if (data.type == "tick") {
              var minutes = Math.floor(data.remainingTime / 60);
              var seconds = data.remainingTime % 60;
              // 시간 값을 포맷팅하여 화면의 컨트롤에 표시
              var formattedValue =
                fillZero(2, minutes.toString()) +
                " : " +
                fillZero(2, seconds.toString());
              sessionTime.value = formattedValue;
            } else if (data.type == "timeout") {
              console.log("세션타임아웃");
              fn_kakaoLogout();
            }
          });
        }

        sessionTimeWorker.postMessage({
          command: "reset",
          timeoutSeconds: SESSION_TIMEOUT,
        });

        console.log("끝");
      } else {
        console.log("Your browser doesn't support web workers.");
      }
    };

    const fillZero = (width, str) => {
      return str.length >= width
        ? str
        : new Array(width - str.length + 1).join("0") + str;
    };

    onMounted(() => {
      // 웹소켓 연결
      initWebsocket();
      openActiveAdminChkSocket();
      emitter.on("reset-chatroom-id", resetChatroomId);
      setLocalTime();
    });

    // 다른 페이지로 이동시 웹소켓 close
    onUnmounted(() => {
      if (activeAdminChkSocket) {
        activeAdminChkSocket.close();
      }

      if (sessionTimeWorker) {
        sessionTimeWorker.terminate();
        sessionTimeWorker = null;
      }
    });

    onBeforeUnmount(() => {
      emitter.off("reset-chatroom-id", resetChatroomId);
    });

    watch(chatroomId, (newValue) => {
      localStorage.setItem("chatroomId", newValue);
    });
    return {
      router,
      userId,
      nick,
      role,
      isModalVisible,
      chatroomId,
      activeAdmin,
      isActivAdmin,
      openChatModal,
      openActiveAdminChkSocket,
      resetChatroomId,
      sessionTime,
      fn_kakaoLogout,
    };
  },
};
</script>
