<template>
  <div>
    헤더
    <p>홍길동 접속중..</p>
    <a @click="fn_kakaoLogout"><p>로그아웃</p></a>
    <button @click="openChatModal">실시간 채팅 상담(챗 모달 팝업)</button>
    <ChatModal
      v-model:modelValue="isModalVisible"
      :userId="userId"
      :nick="nick"
      :role="role"
      :chatroomId="chatroomId"
    >
      <template #default>
        <h2>대화</h2>
        <p>질문이 있으신가요? 지금 문의하세요!</p>
        <p>온라인 문의가 가능한 상태입니다.</p>
        <div>
          <div v-for="(value, index) in activeAdmin" :key="index">
            {{ value }}
          </div>
        </div>
        <!-- 말풍선 -->
        <p>안녕하세요! 어떻게 도와드릴까요?</p>
      </template>
    </ChatModal>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import ChatModal from "../modules/components/chat/ChatModal.vue";
import axios from "axios";

export default {
  components: { ChatModal },
  setup() {
    const router = useRouter();

    const userId = ref(localStorage.getItem("id"));
    const nick = ref(localStorage.getItem("nick"));
    const role = ref("USR");
    const isModalVisible = ref(false);
    const chatroomId = ref("");
    let activeAdminChkSocket = null;
    let activeAdmin = ref([]);

    const fn_kakaoLogout = () => {
      window.Kakao.Auth.logout((res) => {
        if (res) {
          localStorage.setItem("isAuthenticated", false);
          localStorage.setItem("id", "");
          localStorage.setItem("nick", "");
        }
        router.go("/");
      });
    };

    const openChatModal = () => {
      console.log("fnc openModal");
      // 채팅방 아이디
      axios
        .post(`/api/chat/create`, {
          id: userId.value,
          nick: nick.value,
        })
        .then((res) => {
          console.log(res.data.chatroomId);
          chatroomId.value = res.data.chatroomId;
          isModalVisible.value = true;
        });
    };

    // 소켓 오픈
    const openActiveAdminChkSocket = () => {
      activeAdminChkSocket = new WebSocket(
        "ws://localhost:9090/ws/adminOnList"
      );

      activeAdminChkSocket.onopen = () => {
        console.log("activeAdminChkSocket connection opened");
      };

      activeAdminChkSocket.onmessage = (event) => {
        let admStr = event.data;
        let admArr = admStr.split(",");
        console.log(admArr);
        activeAdmin.value = admArr;
        console.log(activeAdmin);
      };

      activeAdminChkSocket.onclose = () => {
        console.log("activeAdminChkSocket connection closed");
      };

      activeAdminChkSocket.onerror = (error) => {
        console.error("activeAdminChkSocket error: ", error);
      };
    };
    onMounted(() => {
      // 웹소켓 연결
      openActiveAdminChkSocket();
    });

    // 다른 페이지로 이동시 웹소켓 close
    onUnmounted(() => {
      if (activeAdminChkSocket) {
        activeAdminChkSocket.close();
      }
    });

    return {
      userId,
      nick,
      role,
      isModalVisible,
      chatroomId,
      activeAdmin,
      fn_kakaoLogout,
      openChatModal,
      openActiveAdminChkSocket,
    };
  },
};
</script>
