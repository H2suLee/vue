import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker 등록 성공:", registration);
    })
    .catch((err) => {
      console.log("Service Worker 등록 실패:", err);
    });
}
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Axios를 전역으로 사용할 수 있도록 설정
app.config.globalProperties.$axios = axios;
app.use(pinia);
app.use(router);
app.mount("#app");
