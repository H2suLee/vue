<template>
  <div class="contentW">
    <ul>
      <li class="tit">내 채팅</li>
      <li class="navi">
        <ul>
          <li>홈</li>
          <li>내 채팅</li>
        </ul>
      </li>
    </ul>
    <div>
      <h1 class="dpn">내 채팅</h1>
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
            @click="
              chat.status === '02'
                ? openChatModal(chat.chatroomId)
                : openChatHistoryModal(chat.chatroomId)
            "
          >
            <td>{{ chat.chatroomId }}</td>
            <td>{{ chat.credt }}</td>
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
            <td>{{ chat.lastCredt }}</td>
            <td>{{ chat.status }}</td>
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
    <ChatHistoryModal
      v-model:modalValue="isChatHistoryModalVisible"
      :chatroomId="chatroomId"
    />
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
import { ref, onMounted, computed, nextTick } from "vue";
import axios from "@/axios.js";
import ChatHistoryModal from "../../../../user/modules/components/chat/ChatHistoryModal.vue";
import ChatModal from "../../../../user/modules/components/chat/ChatModal.vue";
import Pagination from "@/common/Pagination.vue";
import { PAGING_CONFIG } from "@/constant/constants.js";
import { useChatStore } from "@/stores/chatStore";
import { sendWebSocket, getWebSocket } from "@/common/websocketManager.js";

export default {
  components: { ChatHistoryModal, ChatModal, Pagination },
  setup() {
    const userId = ref(localStorage.getItem("adminId"));
    const nick = ref(localStorage.getItem("adminNick"));
    const role = ref("ADM");
    const chatStore = useChatStore();
    const chatrooms = computed(() => chatStore.chatList);
    const unreadCounts = computed(() => chatStore.unreadCounts);
    const chatroomId = ref("");
    const isChatHistoryModalVisible = ref(false);
    const isModalVisible = ref(false);
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

    // 채팅 리스트 가져오기 함수
    const getMyChatroomList = async () => {
      try {
        const response = await axios.post("/api/admin/chat/mylist", {
          id: userId.value,
        });
        //chatrooms.value = response.data;
        // pinia
        chatStore.setChatList(response.data);
      } catch (error) {
        console.error("Error fetching mylist:", error);
        console.log(error);
      }
    };

    // 채팅창 열기
    const openChatHistoryModal = async (id) => {
      chatroomId.value = id;
      await nextTick();
      isChatHistoryModalVisible.value = true;
    };

    const openChatModal = (id) => {
      chatroomId.value = id;
      isModalVisible.value = true;
      chatStore.markAsRead(id);
    };

    const resetChatroomId = () => {
      chatroomId.value = "";
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
      // 리스트 최신화
      await getMyChatroomList();
      // 채팅방 복구
      const socket = getWebSocket();
      await waitWebSocketOpen(socket);

      const rids = chatStore.chatList
        .filter((r) => r.status === "02")
        .map((r) => r.chatroomId);

      rids.forEach((rid) => {
        const sendBody = {
          chatroomId: rid,
          type: "REJOIN",
        };
        sendWebSocket(sendBody);
      });
    });

    return {
      userId,
      nick,
      role,
      chatrooms,
      unreadCounts,
      chatroomId,
      isChatHistoryModalVisible,
      isModalVisible,
      openChatHistoryModal,
      openChatModal,
      resetChatroomId,
      ITEM_PER_PAGE,
      PAGE_PER_SECTION,
      pageStartIdx,
      onChangePage,
    };
  },
};
</script>
