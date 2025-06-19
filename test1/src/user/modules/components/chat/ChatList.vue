<template>
  <div class="contentW">
    <ul>
      <li class="tit">채팅 이력</li>
      <li class="navi">
        <ul>
          <li>홈</li>
          <li>채팅 이력</li>
        </ul>
      </li>
    </ul>
    <div>
      <h1 class="dpn">채팅 이력</h1>
      <table class="tbl">
        <!-- 생성일, 답변자, 내용, 마지막 채팅일시 -->
        <thead>
          <tr>
            <td class="wd6">roomId</td>
            <td class="wd12">생성일</td>
            <td class="wd12">답변자</td>
            <td>채팅</td>
            <td class="wd12">마지막 채팅일</td>
            <td class="wd12">상태(대기/진행중/완료)</td>
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
              chat.status === '03'
                ? openChatHistoryModal(chat.chatroomId)
                : openChatModal(chat.chatroomId)
            "
          >
            <td>{{ chat.chatroomId }}</td>
            <td>{{ chat.credt }}</td>
            <td>{{ chat.adm?.nick || "" }}</td>
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
      @refresh-list="getMyChatroomList"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import ChatHistoryModal from "./ChatHistoryModal.vue";
import ChatModal from "./ChatModal.vue";
import Pagination from "@/common/Pagination.vue";
import { useChatStore } from "@/stores/chatStore";

export default {
  components: { ChatHistoryModal, ChatModal, Pagination },
  setup() {
    const userId = ref(localStorage.getItem("id"));
    const nick = ref(localStorage.getItem("nick"));
    const role = ref("USR");
    const chatStore = useChatStore();
    const chatrooms = computed(() => chatStore.chatList);
    const unreadCounts = computed(() => chatStore.unreadCounts);
    const chatroomId = ref("");
    const isChatHistoryModalVisible = ref(false);
    const isModalVisible = ref(false);

    /* 페이징 관련 */
    const ITEM_PER_PAGE = ref(20);
    const PAGE_PER_SECTION = ref(10);
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
        const response = await axios.post("/api/chat/chatroomList", {
          id: userId.value,
        });
        chatrooms.value = response.data;
        // pinia
        chatStore.setChatList(response.data);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };

    // 채팅창 열기
    const openChatHistoryModal = (id) => {
      chatroomId.value = id;
      isChatHistoryModalVisible.value = true;
    };

    const openChatModal = (id) => {
      chatroomId.value = id;
      isModalVisible.value = true;
    };

    onMounted(() => {
      getMyChatroomList();
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
      /*resetChatroomId,*/
      ITEM_PER_PAGE,
      PAGE_PER_SECTION,
      pageStartIdx,
      onChangePage,
      getMyChatroomList,
    };
  },
};
</script>
