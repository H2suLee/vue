import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const app = createApp(App).use(router);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Axios를 전역으로 사용할 수 있도록 설정
app.config.globalProperties.$axios = axios;
app.use(pinia);
app.mount("#app");
