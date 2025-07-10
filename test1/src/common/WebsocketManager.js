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
    if (jsondata.type != "TYPING" && jsondata.type != "STOP") {
      chatStore.handleIncomingMessage(jsondata);
    }
    if (
      jsondata.type != "TYPING" &&
      jsondata.type != "STOP" &&
      jsondata.type != "LIST"
    ) {
      subscribers.forEach((callback) => callback(jsondata));
    }
  };
  socket.onclose = () => {
    console.warn("전역 WebSocket closed. Reconnecting in 3s...");
    socket = null;
    setTimeout(initWebsocket, 1000);
  };

  socket.onerror = (e) => {
    console.error("전역 WebSocket error", e);
  };
}

export function getWebSocket() {
  return socket;
}

export function sendWebSocket(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

export function subscribeToMessages(callback) {
  subscribers.add(callback);
}

export function unsubscribeFromMessages(callback) {
  subscribers.delete(callback);
}
