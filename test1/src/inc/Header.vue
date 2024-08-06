<template>
  <div><a @click="fn_kakaoLogout">로그아웃</a></div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const fn_kakaoLogout = () => {
      window.Kakao.Auth.logout((res) => {
        if (res) {
          localStorage.setItem("isAuthenticated", "false");
          localStorage.setItem("id", "");
          localStorage.setItem("nickname", "");
        }
        router.go({ path: "/" });
      });
    };

    return {
      fn_kakaoLogout,
    };
  },
};
</script>
