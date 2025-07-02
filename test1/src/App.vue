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
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

// user
import Header from "./user/inc/Header.vue";
import LeftMenu from "./user/inc/LeftMenu.vue";
import Body from "./user/inc/Body.vue";
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
    Body,
    AdminHeader,
    AdminLeftMenu,
    AdminLogin,
    Home,
    AdminHome,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isAdmin = ref(null);
    const isLogin = ref(null);
    const isOauthCallback = ref(null);

    const loginCheck = async () => {
      // 사용자 로그인 확인
      const isAuthenticated =
        localStorage.getItem("isAuthenticated") === "true";

      // 관리자 로그인 확인
      let isAdminAuthenticated = false;
      const token = localStorage.getItem("jwt");

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const isExpired = payload.exp && Date.now() / 1000 > payload.exp;
          isAdminAuthenticated = !isExpired;
        } catch (err) {
          isAdminAuthenticated = false;
        }
      }

      return isAdmin.value ? isAdminAuthenticated : isAuthenticated;
    };

    // 라우터 경로 변경을 감지하여 isAdmin 업데이트
    router.afterEach(async (to, from) => {
      isAdmin.value = to.path.startsWith("/admin");
      isOauthCallback.value = to.path.startsWith("/login/oauth2");
      isLogin.value = await loginCheck();
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
