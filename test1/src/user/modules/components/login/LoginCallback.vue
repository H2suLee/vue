<script setup>
import { useRoute, useRouter } from "vue-router";
import { deleteFCMToken } from "@/common/firebaseNotificationManager.js";
import { useAuthStore } from "@/stores/authStore.js";

const router = useRouter();
const auth = useAuthStore();

const params = new URLSearchParams(window.location.search);
const token = params.get("jwt");
const id = params.get("id");
const nick = params.get("nick");
const error = params.get("error");

if (token) {
  deleteFCMToken();
  localStorage.clear();

  //로그인 여부 저장
  localStorage.setItem("id", id);
  localStorage.setItem("nick", nick);
  localStorage.setItem("jwt", token);
  localStorage.setItem("role", "USR");
  auth.setIsLogin(true);
  router.push("/");
} else {
  if (error) {
    alert("로그인 실패 : " + error);
  }
  router.push("/");
}
</script>
