<template>
  <div>
    <a @click="handleLogout">로그아웃</a>
    <router-link to="/admin/chat/serviceList" class="btn"
      >실시간 채팅 지원(채팅 지원 페이지)</router-link
    >
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const handleLogout = () => {
      localStorage.removeItem("jwt");
      localStorage.removeItem("adminId");
      localStorage.removeItem("adminNick");
      router.go("/admin");
    };

    return {
      handleLogout,
    };
  },
};
</script>
