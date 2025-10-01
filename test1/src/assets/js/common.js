import { ref, onUnmounted, onMounted } from "vue";
import { SESSION_TIMEOUT } from "@/constant/constants.js";
import { deleteFCMToken } from "@/common/firebaseNotificationManager.js";
//import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore.js";

export function getCurrentDateTime() {
  const now = new Date();

  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

export function getWebSocketUri() {
  let protocol = window.location.protocol === "https:" ? "wss" : "ws";
  let host = window.location.origin;
  //host = axios.defaults.baseURL;
  host = host.replace(/^https?:\/\//, "");
  let wsUrl = `${protocol}://${host}`;
  if (wsUrl.includes("localhost")) {
    wsUrl = wsUrl.replace(":9091", ":9090");
    wsUrl = 'wss://oral-therine-heesu-f4935ad1.koyeb.app' // 디자인을 위해 임시추가
  }

  return wsUrl;
}

let sessionTimeWorker = null;
export function setLocalTime(handleLogout) {
  const sessionTime = ref("");
  const sessionExpTime = ref(SESSION_TIMEOUT);

  onMounted(() => {
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
            console.log("세션타임아웃");
            if (handleLogout) handleLogout();
          }
        });
      }

      resetSessionTimer(sessionExpTime.value);
    } else {
      console.log("Your browser doesn't support web workers.");
    }
  });

  const fillZero = (width, str) => {
    return str.length >= width
      ? str
      : new Array(width - str.length + 1).join("0") + str;
  };

  onUnmounted(() => {
    if (sessionTimeWorker) {
      sessionTimeWorker.terminate();
      sessionTimeWorker = null;
    }
  });

  return {
    sessionTime,
  };
}

export function resetSessionTimer(timeoutSeconds) {
  if (sessionTimeWorker) {
    sessionTimeWorker.postMessage({ command: "reset", timeoutSeconds });
  }
}

//const chatStore = useChatStore();
export async function logout() {
  const auth = useAuthStore();

  // fcmkey 토큰 삭제
  await deleteFCMToken();

  localStorage.clear();

  // 상태 갱신
  auth.setIsLogin(false);
}
