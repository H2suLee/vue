import { createRouter, createWebHistory } from "vue-router";
import Home from "../user/views/Home.vue";
import AdminHome from "../admin/views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/chat/list",
    name: "ChatList",
    component: () => import("../user/modules/components/chat/ChatList.vue"),
  },
  {
    path: "/admin",
    name: "AdminHome",
    component: AdminHome,
    children: [
      {
        path: "/admin/chat/manage",
        name: "AdminChatManage",
        component: () =>
          import("../admin/modules/components/chat/ChatManage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
