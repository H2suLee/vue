import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { useAuthStore } from "@/stores/authStore.js";

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

app.config.globalProperties.$axios = axios;

app.use(pinia);
app.use(router);

await router.isReady();

const auth = useAuthStore();
await auth.loginCheck();

app.mount("#app");
