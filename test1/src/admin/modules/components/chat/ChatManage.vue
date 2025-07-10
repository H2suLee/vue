<template>
  <div class="contentW">
    <ul>
      <li class="tit">채팅 관리</li>
      <li class="navi">
        <ul>
          <li>홈</li>
          <li>채팅 관리</li>
        </ul>
      </li>
    </ul>
    <div>
      <h1 class="dpn">채팅 관리</h1>
      <table class="tbl">
        <thead>
          <tr>
            <td class="wd6">rId</td>
            <!-- <td class="wd12">상태(진행중/완료)</td> -->
            <td class="wd12">생성일</td>
            <td class="wd10">답변자</td>
            <td class="wd10">문의자</td>
            <td class="wd12">마지막 채팅일</td>
            <td class="wd12">카테고리</td>
            <td class="wd6">관리</td>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="chat in chatrooms?.slice(
              pageStartIdx,
              pageStartIdx + ITEM_PER_PAGE
            )"
            :key="chat.chatroomId"
            @click="openChatHistoryModal(chat.chatroomId)"
          >
            <td>{{ chat.chatroomId }}</td>
            <!-- <td>{{ chat.status }}</td> -->
            <td>{{ chat.credt }}</td>
            <td class="wd10">
              {{
                Array.isArray(chat.adm)
                  ? chat.adm.map((a) => a.nick).join(", ")
                  : ""
              }}
            </td>
            <td class="wd10">{{ chat.usr?.nick || "" }}</td>
            <td>{{ chat.lastCredt }}</td>
            <td>카테고리</td>
            <td>
              <button @click.stop="openChatManageModal(chat.chatroomId)">
                관리
              </button>
            </td>
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
      @reset-chatroom-id="resetChatroomId"
    />
    <ChatManageModal
      v-model:modalValue="isChatManageModalVisible"
      :chatroomId="chatroomId"
      @reset-chatroom-id="resetChatroomId"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "@/axios.js";
import ChatHistoryModal from "@/user/modules/components/chat/ChatHistoryModal.vue";
import ChatManageModal from "./ChatManageModal.vue";
import Pagination from "@/common/Pagination.vue";
import { PAGING_CONFIG } from "@/constant/constants.js";

export default {
  components: { ChatHistoryModal, ChatManageModal, Pagination },
  setup() {
    const userId = ref(localStorage.getItem("adminId"));
    const nick = ref(localStorage.getItem("adminNick"));
    const chatrooms = ref([]);
    const chatroomId = ref("");
    const isChatHistoryModalVisible = ref(false);
    const isChatManageModalVisible = ref(false);

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
    const getChatroomMngList = async () => {
      try {
        const response = await axios.post("/api/admin/chat/mnglist", {
          id: userId.value,
        });
        chatrooms.value = response.data;
      } catch (error) {
        console.error("Error fetching mnglist:", error);
      }
    };

    // 채팅창 열기
    const openChatHistoryModal = (id) => {
      console.log("id: ", id);
      chatroomId.value = id;
      isChatHistoryModalVisible.value = true;
    };

    // 채팅 관리창 열기
    const openChatManageModal = (id) => {
      chatroomId.value = id;
      isChatManageModalVisible.value = true;
    };

    const resetChatroomId = () => {
      chatroomId.value = "";
    };
    // mounted 훅에서 getMyChatroomList 호출
    onMounted(() => {
      getChatroomMngList();
    });

    return {
      userId,
      nick,
      chatrooms,
      chatroomId,
      isChatHistoryModalVisible,
      isChatManageModalVisible,
      openChatHistoryModal,
      openChatManageModal,
      resetChatroomId,
      ITEM_PER_PAGE,
      PAGE_PER_SECTION,
      pageStartIdx,
      onChangePage,
    };
  },
};
</script>
