import { useChatStore } from "@/stores/chatStore";

let socket = null;

export function initWebsocket() {
  if (socket) return;

  socket = new WebSocket("ws://localhost:9090/ws/chat");

  socket.onopen = () => {
    console.log("전역 Websocket open");
  };

  socket.onmessage = (event) => {
    console.log("전역 got msg");
    const data = JSON.parse(event.data);
    const chatStore = useChatStore();
    chatStore.handleIncomingMessage(data);
  };

  socket.onclose = () => {
    console.warn("WebSocket closed. Reconnecting in 3s...");
    socket = null;
    setTimeout(initSocket, 3000);
  };

  socket.onerror = (e) => {
    console.error("WebSocket error", e);
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
