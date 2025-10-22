import { defineStore } from "pinia";

export const usePushStore = defineStore("push", {
  state: () => ({
    pushList: [], // [{ title, body, chatroomId, credt, chkYn, delYn }]
    unreadCounts: 0, // { [chatRoomId]: number }
  }),

  actions: {
    handleIncomingMessage(message) {
      /*
        {
            "title": "[채팅알림]",
            "body": "161",
            "chatroomId": "admin8",
            "credt": "2025-06-18 16:44:54",
            "type": "type00",
            "sender": "3651954457"
        }
        */

      message.chkYn = "N";
      this.pushList.unshift(message);

      // 안 읽은 메시지 수 증가
      this.unreadCounts++;
    },

    readOne(message) {
      this.pushList.splice(message.index, 1);
      this.unreadCounts--;
    },

    readAll() {
      this.resetStore();
    },

    setPushList(pushListFromApi) {
      this.pushList = pushListFromApi;
    },

    resetStore() {
      this.pushList = [];
      this.unreadCounts = 0;
    },
  },

  // localStorage 자동 저장
  persist: {
    key: "push-store",
    storage: localStorage,
    paths: ["pushList", "unreadCounts"],
  },
});
