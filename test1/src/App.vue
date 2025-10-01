<template>
  <div>
    <!-- 사용자 -->
    <div v-if="!isAdmin">
      <div>
        <Login v-if="!isLogin" />
        <div v-else>
          <Header />
          <LeftMenu />
          <router-view />
        </div>
      </div>
      <router-view v-if="isOauthCallback" />
    </div>
    <!-- 관리자 -->
    <div v-if="isAdmin">
      <div>
        <AdminLogin v-if="!isLogin" />
        <div v-else>
          <AdminHeader />
          <AdminLeftMenu />
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/authStore.js";

// user
import Header from "./user/inc/Header.vue";
import LeftMenu from "./user/inc/LeftMenu.vue";
import Login from "./user/modules/components/login/LoginPage.vue";
import Home from "./user/views/Home.vue";

// admin
import AdminHeader from "./admin/inc/Header.vue";
import AdminLeftMenu from "./admin/inc/LeftMenu.vue";
import AdminLogin from "./admin/modules/components/login/LoginPage.vue";
import AdminHome from "./admin/views/Home.vue";

export default {
  name: "App",
  components: {
    Header,
    LeftMenu,
    Login,
    AdminHeader,
    AdminLeftMenu,
    AdminLogin,
    Home,
    AdminHome,
  },
  setup() {
    const auth = useAuthStore();
    const isAdmin = computed(() => auth.isAdmin);
    const isLogin = computed(() => auth.isLogin);
    const isOauthCallback = computed(() => auth.isOauthCallback);

    onMounted(() => {
      auth.loginCheck();
    });

    return {
      isAdmin,
      isLogin,
      isOauthCallback,
    };
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
/*#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
@import "@/assets/css/base.css";
@import "@/assets/css/user.css";
@import "@/assets/css/Header.css";
@import "@/assets/css/LeftMenu.css";
@import "@/assets/css/Body.css";
@import "@/assets/css/ChatList.css";
</style>
