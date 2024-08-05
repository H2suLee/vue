<script>
import LoginPage from "./components/LoginPage.vue";
import IncHeader from "./inc/IncHeader.vue";
import IncLeftMenu from "./inc/IncLeftMenu.vue";
import IncBody from "./inc/IncBody.vue";

export default {
  name: "App",
  components: {
    LoginPage,
    IncHeader,
    IncLeftMenu,
    IncBody,
  },
  data: () => ({}),
  mounted() {},
  watch() {},
  computed: {
    isLogin() {
      return true;
    },
  },
};
</script>

<style>
@import "@/assets/css/lib/jquery.bxslider.css";
@import "@/assets/css/lib/slick.css";
@import "@/assets/css/lib/slick-theme.css";
@import "@/assets/css/lib/jquery-ui.min.css";
@import "@/assets/css/lib/jquery-ui.theme.min.css";
@import "@/assets/css/lib/sweetalert2.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  <!-- <p>안녕</p> -->

  <LoginPage v-if="!isLogin" />
  <IncHeader v-if="isLogin" />
  <IncLeftMenu v-if="isLogin" />
  <IncBody v-if="isLogin" />
</template>
