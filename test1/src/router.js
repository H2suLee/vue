import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("./views/Home.vue"), // 이 경로도 확인하세요
  },
  // 추가적인 라우트 설정
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
