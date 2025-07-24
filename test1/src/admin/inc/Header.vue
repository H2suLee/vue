<template>
  <div class="header">
    <h1>
      <img src="../../assets/images/logomini.svg" alt="TOYCHATLOGO" /> 관리자
    </h1>
    <ul class="dpf">
      <li>
        <img src="../../assets/images/userlogin.svg" alt="사람 모양의 아이콘" />
        <span class="em">{{ nick }}</span
        >&nbsp;&nbsp;님&nbsp;&nbsp;&nbsp;접속중
      </li>
      <li>
        {{ sessionTime }}
      </li>
      <li>
        <a @click="handleLogout"
          ><img
            src="../../assets/images/userlogout.svg"
            alt="로그아웃 아이콘"
          />로그아웃</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/axios.js";
import { SESSION_TIMEOUT } from "@/constant/constants.js";
import { initWebsocket } from "@/common/websocketManager.js";
import { useChatStore } from "@/stores/chatStore";
import { requestFCMPermission } from "@/common/firebaseNotificationManager.js";
export default {
  setup() {
    const router = useRouter();
    const nick = ref(localStorage.getItem("adminNick"));
    const sessionTime = ref("");
    const sessionExpTime = ref(localStorage.getItem("sessionTime"));
    let sessionTimeWorker = null;
    const chatStore = useChatStore();

    // 로그아웃
    const handleLogout = () => {
      //router.push("/admin") 이게안됨;
      window.location.href = axios.defaults.baseURL + "/admin";
      localStorage.clear();
      chatStore.resetStore();
    };

    const setLocalTime = () => {
      if (typeof Worker != "undefined") {
        if (!sessionTimeWorker) {
          // sessionTimeWorker를 public 바로 밑에 두고 /sessionTimeWorker.js 로 호출하면 아래와 같이 굳이 URL 안 써도 됨
          sessionTimeWorker = new Worker(
            new URL("@/worker/sessionTimeWorker.js", import.meta.url),
            { type: "module" }
          );
          sessionTimeWorker.addEventListener("message", function (e) {
            var data = e.data;

            if (data.type == "tick") {
              var minutes = Math.floor(data.remainingTime / 60);
              var seconds = data.remainingTime % 60;
              // 시간 값을 포맷팅하여 화면의 컨트롤에 표시
              var formattedValue =
                fillZero(2, minutes.toString()) +
                " : " +
                fillZero(2, seconds.toString());
              sessionTime.value = formattedValue;
            } else if (data.type == "timeout") {
              alert("세션 타임 아웃");
              handleLogout();
            }
          });
        }

        sessionTimeWorker.postMessage({
          command: "reset",
          timeoutSeconds: sessionExpTime.value,
        });
      } else {
        console.log("Your browser doesn't support web workers.");
      }
    };

    const fillZero = (width, str) => {
      return str.length >= width
        ? str
        : new Array(width - str.length + 1).join("0") + str;
    };

    onMounted(() => {
      initWebsocket();
      setLocalTime();
      requestFCMPermission();
    });

    onUnmounted(() => {
      if (sessionTimeWorker) {
        sessionTimeWorker.terminate();
        sessionTimeWorker = null;
      }
    });

    return {
      nick,
      handleLogout,
      sessionTime,
    };
  },
};
</script>
