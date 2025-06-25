import { useChatStore } from "@/stores/chatStore";

let socket = null;
const subscribers = new Set();

export function initWebsocket() {
  if (socket) return;

  socket = new WebSocket("ws://localhost:9090/ws/chat");

  socket.onopen = () => {
    console.log("전역 Websocket open");
  };

  socket.onmessage = (event) => {
    let jsondata = JSON.parse(event.data);
    const chatStore = useChatStore();
    chatStore.handleIncomingMessage(jsondata);
    subscribers.forEach((callback) => callback(jsondata));
  };
  socket.onclose = () => {
    console.warn("전역 WebSocket closed. Reconnecting in 3s...");
    socket = null;
    setTimeout(initWebsocket, 3000);
  };

  socket.onerror = (e) => {
    console.error("전역 WebSocket error", e);
  };
}

export function getWebSocket() {
  return socket;
}

export function sendWebSocket(message) {
  console.log("전역 send");
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("전역 action");
    socket.send(JSON.stringify(message));
  }
}

export function subscribeToMessages(callback) {
  subscribers.add(callback);
}

export function unsubscribeFromMessages(callback) {
  subscribers.delete(callback);
}
