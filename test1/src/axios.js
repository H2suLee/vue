import axios from "axios";
import { useAuthStore } from "@/stores/authStore.js";

const instance = axios.create({
  baseURL: "/", // 로컬 프론트에서 돌릴때
});

instance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("jwt");
      if (token) {
        //resetSessionTimer(SESSION_TIMEOUT);
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("axios response interceptor catch: ", error);
    }
    return config;
  },
  (error) => {
    console.log("axios response interceptor error: ", error);
    return Promise.reject(error);
  }
);

async function refreshJwt() {
  try {
    const refreshResponse = await axios.post("/api/common/refreshJwt", {
      withCredentials: true, // 쿠키 자동 전송 옵션
    });

    // 로컬 저장소 업데이트
    const newAccessToken = refreshResponse.data.jwt;
    if (newAccessToken) {
      localStorage.setItem("jwt", newAccessToken);
      return newAccessToken;
    } else {
      const auth = useAuthStore();
      alert("refresh token 만료");
      auth.logout();
    }
  } catch (error) {
    const auth = useAuthStore();
    alert("access token 갱신 실패");
    auth.logout();
    //throw error;
  }
}

let refreshJwtPromise = null;
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 && 아직 retry 안한 요청만
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshJwtPromise) {
          refreshJwtPromise = refreshJwt().finally(() => {
            refreshJwtPromise = null;
          });
        }

        const newAccessToken = await refreshJwtPromise;
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } else {
          return new Promise(() => {});
        }
      } catch (refreshError) {
        return new Promise(() => {});
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default instance;
