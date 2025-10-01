import { defineStore } from "pinia";
import axios from "@/axios.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLogin: false,
    isAdmin: false,
    isOauthCallback: false,
  }),

  actions: {
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
    setIsAdmin(isAdmin) {
      this.isAdmin = isAdmin;
    },
    setIsLogin(isLogin) {
      this.isLogin = isLogin;
    },
    setIsOauthCallback(isOauthCallback) {
      this.isOauthCallback = isOauthCallback;
    },
  },
  /*
  persist: {
    key: "auth-store",
    storage: localStorage,
    paths: ["isLogin"],
},
*/
});
