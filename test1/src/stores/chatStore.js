import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    chatList: [], // [{ chatRoomId, credt, adm.nick, usr.nick, lastCredt,credt }]
    unreadCounts: {}, // { [chatRoomId]: number }
  }),

  actions: {
    handleIncomingMessage(message) {
      /*
        {
            "chatId": "443",
            "chatroomId": "161",
            "id": "admin8",
            "nick": "admin8",
            "content": "admin8님이 입장하였습니다.",
            "credt": "2025-06-18 16:44:54",
            "type": "ENTER",
            "role": "ADM"
        }
        */
      console.log("handling message");
      const existing = this.chatList.find(
        (c) => c.chatroomId === message.chatroomId
      );

      if (existing) {
        // 갱신 가능 항목: lastContent, lastCredt, status, adm

        var pushMsg = {
          ...existing,
          lastContent: message.content,
          lastCredt: message.credt,
          status: message.type === "END" ? "03" : existing.adm ? "02" : "01",
        };

        if (message.type === "ENTER" && message.role === "ADM") {
          pushMsg.adm.push({ nick: message.nick, id: message.id });
        }

        // 맨 위로 이동(기존항목을 찾아서 제거)
        this.chatList = [
          pushMsg,
          ...this.chatList.filter((c) => c.chatroomId !== message.chatroomId),
        ];
      } else {
        // 신규 채팅방 추가 : chatRoomId, credt, usr, lastContent, lastCredt, status
        var pushMsg = {
          chatroomId: message.chatroomId,
          credt: message.credt,
          usr: { id: message.id, nick: message.nick },
          adm: [],
          lastContent: message.content,
          lastCredt: message.credt,
          status: "01",
        };
        this.chatList.unshift(pushMsg);
      }

      // 안 읽은 메시지 수 증가
      this.unreadCounts[message.chatroomId] =
        (this.unreadCounts[message.chatroomId] || 0) + 1;
    },

    markAsRead(chatroomId) {
      this.unreadCounts[chatroomId] = 0;
    },

    setChatList(chatListFromApi) {
      this.chatList = chatListFromApi;
    },

    resetStore() {
      this.chatList = [];
      this.unreadCounts = {};
    },
  },

  // localStorage 자동 저장
  persist: {
    key: "chat-store",
    storage: localStorage,
    paths: ["chatList", "unreadCounts"],
  },
});
