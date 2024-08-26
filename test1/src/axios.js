import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:9091", // 백엔드 서버 주소
  //baseURL: "https://oral-therine-heesu-f4935ad1.koyeb.app/", // 백엔드 서버 주소
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
