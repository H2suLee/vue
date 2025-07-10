<template>
  <div class="contentW">
    <ul>
      <li class="tit">실시간 채팅 지원</li>
      <li class="navi">
        <ul>
          <li>홈</li>
          <li>실시간 채팅 지원</li>
        </ul>
      </li>
    </ul>
    <div v-if="chatrooms.length === 0">실시간 채팅 지원이 없습니다.</div>
    <div v-else>
      <h1 class="dpn">실시간 채팅 지원</h1>
      <table class="tbl">
        <thead>
          <tr>
            <td class="wd6">rId</td>
            <td class="wd12">생성일</td>
            <td class="wd10">답변자</td>
            <td class="wd10">문의자</td>
            <td>채팅</td>
            <td class="wd12">마지막 채팅일</td>
            <td class="wd10">상태(대기/진행중/완료)</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="chat in chatrooms?.slice(
              pageStartIdx,
              pageStartIdx + ITEM_PER_PAGE
            )"
            :key="chat.chatroomId"
            @click="openChatModal(chat.chatroomId)"
          >
            <td class="wd16">{{ chat.chatroomId }}</td>
            <td class="wd12">{{ chat.credt }}</td>
            <td class="wd10">
              {{
                Array.isArray(chat.adm)
                  ? chat.adm.map((a) => a.nick).join(", ")
                  : ""
              }}
            </td>
            <td class="wd10">{{ chat.usr?.nick || "" }}</td>
            <td>
              {{ chat.lastContent }}
              <p v-if="unreadCounts[chat.chatroomId] != null">
                ( {{ unreadCounts[chat.chatroomId] }} )
              </p>
            </td>
            <td class="wd12">{{ chat.lastCredt }}</td>
            <td class="wd10">{{ chat.status }}</td>
          </tr>
        </tbody>
      </table>
      <Pagination
        v-if="chatrooms.length > 0"
        :list="chatrooms"
        v-bind="{ ITEM_PER_PAGE, PAGE_PER_SECTION }"
        @change-page="onChangePage"
      />
    </div>
    <ChatModal
      v-model:modelValue="isModalVisible"
      :userId="userId"
      :nick="nick"
      :role="role"
      :chatroomId="chatroomId"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import axios from "@/axios.js";
import ChatModal from "../../../../user/modules/components/chat/ChatModal.vue";
import Pagination from "@/common/Pagination.vue";
import { PAGING_CONFIG } from "@/constant/constants.js";
import { useChatStore } from "@/stores/chatStore";
import { sendWebSocket, getWebSocket } from "@/common/websocketManager.js";

export default {
  components: { ChatModal, Pagination },
  setup() {
    const userId = ref(localStorage.getItem("adminId"));
    const nick = ref(localStorage.getItem("adminNick"));
    const role = ref("ADM");
    const isModalVisible = ref(false);
    const chatStore = useChatStore();
    const chatrooms = computed(() => chatStore.chatList);
    const unreadCounts = computed(() => chatStore.unreadCounts);
    const chatroomId = ref("");
    let activeAdminChkSocket = null;

    /* 페이징 관련 */
    const ITEM_PER_PAGE = ref(PAGING_CONFIG.ITEM_PER_PAGE);
    const PAGE_PER_SECTION = ref(PAGING_CONFIG.PAGE_PER_SECTION);
    let curPage = ref(1);

    const pageStartIdx = computed(() => {
      return (curPage.value - 1) * ITEM_PER_PAGE.value;
    });

    const onChangePage = (data) => {
      curPage.value = data;
    };

    const openChatModal = (id) => {
      chatroomId.value = id;
      isModalVisible.value = true;
      chatStore.markAsRead(id);
    };

    const getLiveChatWaitingList = async () => {
      try {
        const response = await axios.post(
          "/api/admin/chat/liveChatWaitingList",
          {
            //id: userId.value,
          }
        );
        //chatrooms.value = response.data;
        // pinia
        chatStore.setChatList(response.data);
      } catch (error) {
        console.error("Error fetching livelist:", error);
      }
    };

    const openActiveAdminChkSocket = () => {
      let url = `ws://localhost:9090/ws/adminOnList?role=adm&nick=${nick.value}`;
      activeAdminChkSocket = new WebSocket(url);

      activeAdminChkSocket.onopen = () => {
        console.log("activeAdminChkSocket connection opened");
      };

      activeAdminChkSocket.onmessage = (event) => {
        console.log("activeAdminChkSocket got message");

        // 아래 부분 왜 있는지 모르겠는데 없으면 화면 변화가 안생김
        let jsonArr = JSON.parse(event.data);
        jsonArr.forEach((item) => {
          let jsonObj = {
            chatroomId: item._id,
            id: item.usr.id,
            nick: item.usr.nick,
            credt: item.credt,
            content: item.usr.nick + "님이 입장하였습니다.",
          };
          // pinia로 상태관리 {chatroomId, content, credt, id, nick, type}
          chatStore.handleIncomingMessage(jsonObj);
        });
      };

      activeAdminChkSocket.onclose = () => {
        console.log("activeAdminChkSocket connection closed");
      };

      activeAdminChkSocket.onerror = (error) => {
        console.error("activeAdminChkSocket error:", error);
      };
    };

    function waitWebSocketOpen(socket) {
      return new Promise((resolve) => {
        if (socket.readyState === WebSocket.OPEN) {
          resolve();
        } else {
          socket.addEventListener("open", resolve, { once: true });
        }
      });
    }

    onMounted(async () => {
      // 웹소켓 연결
      openActiveAdminChkSocket();

      // 실시간 상담 대기 리스트
      await getLiveChatWaitingList();

      // 채팅방 복구
      const socket = getWebSocket();
      await waitWebSocketOpen(socket);

      const rids = chatStore.chatList.map((r) => r.chatroomId);

      rids.forEach((rid) => {
        const sendBody = {
          chatroomId: rid,
          type: "REJOIN",
        };
        sendWebSocket(sendBody);
      });
    });

    // 다른 페이지로 이동시 웹소켓 close
    onUnmounted(() => {
      if (activeAdminChkSocket) {
        activeAdminChkSocket.close();
      }
    });

    return {
      userId,
      nick,
      role,
      chatrooms,
      unreadCounts,
      chatroomId,
      isModalVisible,
      openChatModal,
      ITEM_PER_PAGE,
      PAGE_PER_SECTION,
      pageStartIdx,
      onChangePage,
    };
  },
};
</script>
