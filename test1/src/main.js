import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
const app = createApp(App).use(router);

// Axios를 전역으로 사용할 수 있도록 설정
app.config.globalProperties.$axios = axios;

app.mount("#app");
