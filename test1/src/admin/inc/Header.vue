<template>
  <div class="header">
    <h1>
      <img src="../../assets/images/logomini.svg" alt="TOYCHATLOGO" /> 관리자
    </h1>
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
        <a @click="handleLogout"
          ><img
            src="../../assets/images/userlogout.svg"
            alt="로그아웃 아이콘"
          />로그아웃</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/axios.js";
import { SESSION_TIMEOUT } from "@/constant/constants.js";
import { initWebsocket } from "@/common/websocketManager.js";
import { useChatStore } from "@/stores/chatStore";
import { setLocalTime } from "@/assets/js/common.js";
import {
  requestFCMPermission,
  deleteFCMToken,
} from "@/common/firebaseNotificationManager.js";
export default {
  setup() {
    const router = useRouter();
    const nick = ref(localStorage.getItem("adminNick"));
    const userId = ref(localStorage.getItem("adminId"));
    const chatStore = useChatStore();

    // 로그아웃
    const handleLogout = async () => {
      // fcmkey 토큰 삭제
      await deleteFCMToken(userId.value);
      //router.push("/admin") 이게안됨;
      window.location.href = axios.defaults.baseURL + "/admin";
      localStorage.clear();
      chatStore.resetStore();
    };

    const { sessionTime } = setLocalTime(handleLogout);

    onMounted(() => {
      initWebsocket();
      requestFCMPermission(userId.value);
    });

    return {
      nick,
      handleLogout,
      sessionTime,
    };
  },
};
</script>
