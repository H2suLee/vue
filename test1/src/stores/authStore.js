import { defineStore } from "pinia";
import axios from "@/axios.js";
import { deleteFCMToken } from "@/common/firebaseNotificationManager.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLogin: false,
    isAdmin: false,
    isOauthCallback: false,
  }),

  actions: {
    logout() {
      // fcmkey 토큰 삭제
      deleteFCMToken();
      // 상태 갱신
      this.setIsLogin(false);

      localStorage.clear();
    },
    async loginCheck() {
      try {
        const token = localStorage.getItem("jwt");
        if (token) {
          const response = await axios.get("/api/common/me");
          this.isLogin = response.data.valid;
        }
      } catch (error) {
        this.isLogin = false;
      } finally {
        console.log("is Valid? " + this.isLogin);
      }
    },
    async setIsAdmin(isAdmin) {
      this.isAdmin = isAdmin;
    },
    async setIsLogin(isLogin) {
      this.isLogin = isLogin;
    },
    async setIsOauthCallback(isOauthCallback) {
      this.isOauthCallback = isOauthCallback;
    },
  },
  persist: {
    key: "auth-store",
    storage: localStorage,
    paths: ["isLogin", "isAdmin", "isOauthCallback"],
  },
});
