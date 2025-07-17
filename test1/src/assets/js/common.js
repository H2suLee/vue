import axios from "@/axios";

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
  let host = axios.defaults.baseURL;
  host = host.replace(/^https?:\/\//, "");
  let wsUrl = `${protocol}://${host}`;
  if (wsUrl.includes("localhost")) {
    wsUrl = wsUrl.replace(":9091", ":9090");
    wsUrl = 'wss://oral-therine-heesu-f4935ad1.koyeb.app' // 디자인을 위해 임시추가
  }

  return wsUrl;
}
