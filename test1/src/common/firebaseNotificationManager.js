import { getToken, onMessage, deleteToken } from "firebase/messaging";
import { messaging } from "@/common/firebaseConfig";
import { VAPID_KEY } from "@/constant/constants.js";
import axios from "axios";
import { usePushStore } from "@/stores/pushStore";
import { useAuthStore } from "@/stores/authStore.js";

export function requestFCMPermission(userId) {
  const auth = useAuthStore();
  // Notification 권한 요청
  console.log("권한을 요청하는 중...");

  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("알림 권한이 부여되었습니다.");

      // FCM 토큰 요청
      getToken(messaging, { vapidKey: VAPID_KEY })
        .then((currentToken) => {
          if (currentToken) {
            let id = userId;
            if (userId) {
              axios.post("/api/fcm/createKey", {
                token: currentToken,
                userId: id,
              });
            }
          } else {
            console.log("권한을 허용해주세요");
          }
        })
        .catch((err) => {
          console.log("푸시 토큰 가져오는 중에 에러 발생", err);
        });

      onMessage(messaging, (payload) => {
        console.log("onForegroundMessage");

        const title = payload.data?.title || "알림";
        const body = payload.data?.body || "";

        new Notification(title, { body });

        const pushStore = usePushStore();
        pushStore.handleIncomingMessage(payload.data);
      });
    } else {
      console.log("권한을 얻을 수 없습니다.");
    }
  });
}

export async function deleteFCMToken() {
  const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
  if (currentToken) {
    await axios.post("/api/fcm/deleteKey", {
      token: currentToken,
    });
    await deleteToken(messaging);
  } else {
    console.log("토큰 없음");
  }
}
