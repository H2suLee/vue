<script setup>
import { useRoute, useRouter } from "vue-router";
const router = useRouter();

const params = new URLSearchParams(window.location.search);
const token = params.get("jwt");
const id = params.get("id");
const nick = params.get("nick");
const error = params.get("error");

if (token) {
  //로그인 여부 저장
  localStorage.setItem("isAuthenticated", true);
  localStorage.setItem("id", id);
  localStorage.setItem("nick", nick);
  localStorage.setItem("jwt", token);
  localStorage.setItem("role", "USR");
  router.push("/");
} else {
  if (error) {
    alert("로그인 실패 : " + error);
  }
  router.push("/");
}
</script>
