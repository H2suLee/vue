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
import { initializeApp } from "firebase/app";
import { getToken, getMessaging, onMessage } from "firebase/messaging";
import axios from "@/axios.js";
import { SESSION_TIMEOUT } from "@/constant/constants.js";
import { initWebsocket } from "@/common/websocketManager.js";
import { useChatStore } from "@/stores/chatStore";

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

    // fcm
    const firebaseConfig = {
      apiKey: "AIzaSyBUochlrZu3cwXnaW907_ZvHPPNQkCHUaE",
      authDomain: "toychat-1a2b7.firebaseapp.com",
      projectId: "toychat-1a2b7",
      storageBucket: "toychat-1a2b7.appspot.com",
      messagingSenderId: "286624352269",
      appId: "1:286624352269:web:c05c71880d215786ea2d44",
      measurementId: "G-8LWB2ZRCW1",
    };

    // Initialize Firebase
    const firebaseApp = initializeApp(firebaseConfig);

    // Cloud Messaging 초기화
    const messaging = getMessaging(firebaseApp);

    // Foreground 메시지 처리
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      // 사용자에게 알림 표시 또는 처리할 로직 추가
    });

    // 브라우저 알림 허용 확인
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        //alert("Notification permission granted.");
      } else {
        alert("Unable to get permission to notify.");
      }
    });

    // 프로젝트 설정 - 클라우드 메시징 - 웹 푸시 인증서
    const appKey =
      "BB-jj2EArj_qbaSA6eCicuMBbt9CnaErLl7hHthN1M3UQif7XpnA6jQpiQ2ShqMmWCBX9zWbN_0F903c8K4NRwo";

    const retrieveToken = () => {
      getToken(messaging, { vapidKey: appKey })
        .then((currentToken) => {
          console.log("current Token?");
          if (currentToken) {
            try {
              let id = localStorage.getItem("adminId");
              axios.post("/api/fcm/createKey", {
                fcmKey: currentToken,
                id: id,
              });
            } catch (error) {
              console.error("Error fetching token:", error);
            }
          } else {
            // Show permission request UI
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });
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
      retrieveToken();
      setLocalTime();
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
