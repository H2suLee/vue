<template>
  <div>
    헤더
    <p>홍길동 접속중..</p>
    <a @click="fn_kakaoLogout"><p>로그아웃</p></a>
    <button @click="openChatModal">Open Modal</button>
    <ChatModal v-model:modelValue="isModalVisible">
      <template #default>
        <h2>대화</h2>
        <p>질문이 있으신가요? 지금 문의하세요!</p>
      </template>
    </ChatModal>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ChatModal from "../modules/components/chat/ChatModal.vue";

export default {
  components: { ChatModal },
  setup() {
    const router = useRouter();

    const fn_kakaoLogout = () => {
      window.Kakao.Auth.logout((res) => {
        if (res) {
          localStorage.setItem("isAuthenticated", false);
          localStorage.setItem("id", "");
          localStorage.setItem("nickname", "");
        }
        router.go("/");
      });
    };

    // modal
    const isModalVisible = ref(false);

    const openChatModal = () => {
      console.log("fnc openModal");
      isModalVisible.value = true;
    };
    return {
      fn_kakaoLogout,
      isModalVisible,
      openChatModal,
    };
  },
};
</script>
