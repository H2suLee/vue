<template>
  <div>
    관리자 헤더
    <p>관리자 접속중..</p>
    <a @click="handleLogout">로그아웃</a>
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
