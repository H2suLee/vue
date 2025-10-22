import { createRouter, createWebHistory } from "vue-router";
//import Home from "../user/views/Home.vue";
import AdminHome from "../admin/views/Home.vue";
import { useAuthStore } from "@/stores/authStore.js";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../user/views/Home.vue"),
  },
  {
    path: "/chat/list",
    name: "ChatList",
    component: () => import("../user/modules/components/chat/ChatList.vue"),
  },
  {
    path: "/chat/paginationTest",
    name: "PaginationTest",
    component: () => import("../common/PaginationSampleList.vue"),
  },
  {
    path: "/admin",
    name: "AdminHome",
    component: () => import("../admin/views/Home.vue"),
  },
  {
    path: "/admin/chat/mnglist",
    name: "AdminChatManage",
    component: () => import("../admin/modules/components/chat/ChatManage.vue"),
  },
  {
    path: "/admin/chat/serviceList",
    name: "AdminChatService",
    component: () => import("../admin/modules/components/chat/ChatService.vue"),
  },
  {
    path: "/admin/chat/myList",
    name: "AdminMyChatManage",
    component: () =>
      import("../admin/modules/components/chat/MyChatManage.vue"),
  },
  {
    path: "/admin/chat/empty",
    name: "AdminEmpty",
    component: () => import("../admin/modules/components/chat/empty.vue"),
  },
  {
    path: "/login/oauth2/callback",
    name: "LoginCallback",
    component: () =>
      import("../user/modules/components/login/LoginCallback.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const auth = useAuthStore();
  let isAdmin = to.path.startsWith("/admin");
  auth.setIsAdmin(isAdmin);
  let isOauthCallback = to.path.startsWith("/login/oauth2");
  auth.setIsOauthCallback(isOauthCallback);

  let role = localStorage.getItem("role");
  if (role == "ADM" && !isAdmin) {
    auth.logout();
    return { path: "/" };
  } else if (role == "USR" && isAdmin) {
    auth.logout();
    return { path: "/admin" };
  }
});

export default router;
