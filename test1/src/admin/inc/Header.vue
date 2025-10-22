<template>
  <div class="header">
    <h1>
      <img src="../../assets/images/logomini.svg" alt="TOYCHATLOGO" /> 관리자
    </h1>
    <ul class="dpf">
      <li>
        <button @click="openMyPushModal">
          알림 <span v-if="unreadCounts > 0"> {{ unreadCounts }}</span>
        </button>
      </li>
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
    <MyPushModal v-model:modelValue="isPushModalVisible" />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "@/axios.js";
import { initWebsocket } from "@/common/websocketManager.js";
import { usePushStore } from "@/stores/pushStore";
import { setLocalTime } from "@/assets/js/common.js";
import { requestFCMPermission } from "@/common/firebaseNotificationManager.js";
import MyPushModal from "@/common/MyPushModal.vue";
import { useAuthStore } from "@/stores/authStore.js";

export default {
  components: { MyPushModal },
  setup() {
    const nick = ref(localStorage.getItem("adminNick"));
    const userId = ref(localStorage.getItem("adminId"));
    const pushStore = usePushStore();
    const unreadCounts = computed(() => pushStore.unreadCounts);
    const isPushModalVisible = ref(false);
    const auth = useAuthStore();

    // 로그아웃
    const handleLogout = async () => {
      auth.logout();
    };

    const { sessionTime } = setLocalTime(handleLogout);
    const openMyPushModal = () => {
      isPushModalVisible.value = true;
    };
    // 푸쉬알림 불러오기
    const getMyPush = async () => {
      try {
        const response = await axios.post("/api/fcm/listFcmPush", {
          target: userId.value,
        });
        pushStore.setPushList(response.data);
      } catch (error) {
        console.error("Error fetching modal history list:", error);
      }
    };

    onMounted(() => {
      console.log("관리자 헤더 마운트");
      initWebsocket();
      requestFCMPermission(userId.value);
      //getMyPush();
    });

    return {
      nick,
      handleLogout,
      sessionTime,
      unreadCounts,
      openMyPushModal,
      isPushModalVisible,
    };
  },
};
</script>
