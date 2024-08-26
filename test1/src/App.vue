<template>
  <div>
    <!-- 사용자 -->
    <div v-show="!isAdmin">
      <div>
        <Login v-if="!isLogin" />
        <div v-else>
          <Header />
          <LeftMenu />
        </div>
      </div>
    </div>
    <!-- 관리자 -->
    <div v-show="isAdmin">
      <div>
        <AdminLogin v-if="!isLogin" />
        <div v-else>
          <AdminHeader />
          <AdminLeftMenu />
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

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
    const route = useRoute();
    const router = useRouter();
    const isAdmin = ref(false);

    const checkAdminRoute = () => {
      isAdmin.value = route.path.startsWith("/admin");
    };

    router.afterEach((to, from) => {
      checkAdminRoute();
    });

    return {
      isAdmin,
    };
  },
  mounted() {
    this.isAdmin = this.$route.path.startsWith("/admin");
  },
  computed: {
    isLogin() {
      // 사용자
      const isAuthenticated =
        localStorage.getItem("isAuthenticated") === "true";

      // 관리자
      let isAdminAuthenticated;
      const token = localStorage.getItem("jwt");
      if (!token) {
        isAdminAuthenticated = false;
      }
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        const isExpired = payload.exp && Date.now() / 1000 > payload.exp;
        isAdminAuthenticated = !isExpired;
      } catch (err) {
        isAdminAuthenticated = false;
      }
      return this.isAdmin ? isAdminAuthenticated : isAuthenticated;
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
