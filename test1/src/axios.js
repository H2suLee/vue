import axios from "axios";

const instance = axios.create({
  //baseURL: "http://localhost:9091", // 로컬 프론트에서 돌릴때
  //baseURL: "http://localhost:9090", // 로컬 백엔드에서 돌릴때
  baseURL: "https://oral-therine-heesu-f4935ad1.koyeb.app", // 백엔드 서버 주소
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
