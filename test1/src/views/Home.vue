<template>
  <div>
    <div>HOME</div>
    <div>
      <LoginPage v-show="!isLogin" />
      <IncHeader v-show="isLogin" />
      <IncLeftMenu v-show="isLogin" />
      <IncBody v-show="isLogin" />
    </div>
  </div>
</template>

<script>
import LoginPage from "../modules/components/login/LoginPage.vue";
import IncHeader from "../inc/Header.vue";
import IncLeftMenu from "../inc/LeftMenu.vue";
import IncBody from "../inc/Body.vue";

export default {
  name: "Home",
  components: {
    LoginPage,
    IncHeader,
    IncLeftMenu,
    IncBody,
  },
  computed: {
    isLogin() {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      console.log("is Authenticated:", isAuthenticated);
      return isAuthenticated === "true";
    },
  },
};
</script>
