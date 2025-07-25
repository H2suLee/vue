import { getToken, onMessage, deleteToken } from "firebase/messaging";
import { messaging } from "@/common/firebaseConfig";
import { VAPID_KEY } from "@/constant/constants.js";
import axios from "@/axios.js";

export function requestFCMPermission(userId) {
  // Notification 권한 요청
  console.log("권한을 요청하는 중...");

  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("알림 권한이 부여되었습니다.");

      // FCM 토큰 요청
      getToken(messaging, { vapidKey: VAPID_KEY })
        .then((currentToken) => {
          if (currentToken) {
            console.log("FCM Token:", currentToken);
            let id = userId;
            axios.post("/api/fcm/createKey", {
              token: currentToken,
              userId: id,
            });
          } else {
            console.log("권한을 허용해주세요");
          }
        })
        .catch((err) => {
          console.log("푸시 토큰 가져오는 중에 에러 발생", err);
        });

      onMessage(messaging, (payload) => {
        console.log("📩 Foreground 메시지 수신:", payload);

        const title = payload.data?.title || "알림";
        const body = payload.data?.body || "";

        new Notification(title, { body });
      });
    } else {
      console.log("권한을 얻을 수 없습니다.");
    }
  });
}

export async function deleteFCMToken(userId) {
  const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
  if (currentToken) {
    await axios.post("/api/fcm/deleteKey", {
      token: currentToken,
      userId: userId,
    });
    await deleteToken(messaging);
  } else {
    console.log("토큰 없음");
  }
}
