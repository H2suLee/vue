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
              chat.status === '02'
                ? openChatModal(chat.chatroomId)
                : openChatHistoryModal(chat.chatroomId)
            "
          >
            <td>{{ chat.chatroomId }}</td>
            <td>{{ chat.credt }}</td>
            <td>{{ chat.adm.nick }}</td>
            <td>{{ chat.lastContent }}</td>
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
      @reset-chatroom-id="resetChatroomId"
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
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import ChatHistoryModal from "../../../../user/modules/components/chat/ChatHistoryModal.vue";
import ChatModal from "../../../../user/modules/components/chat/ChatModal.vue";
import Pagination from "../../../../user/modules/components/common/Pagination.vue";

export default {
  components: { ChatHistoryModal, ChatModal, Pagination },
  setup() {
    const userId = ref(localStorage.getItem("adminId"));
    const nick = ref(localStorage.getItem("adminNick"));
    const role = ref("ADM");
    const chatrooms = ref([]);
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
        const response = await axios.post("/api/admin/chat/mylist", {
          id: userId.value,
        });
        chatrooms.value = response.data;
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
      console.log("id> ", id);
      chatroomId.value = id;
      isModalVisible.value = true;
    };

    const resetChatroomId = () => {
      chatroomId.value = "";
    };

    // mounted 훅에서 getMyChatroomList 호출
    onMounted(() => {
      getMyChatroomList();
    });

    return {
      userId,
      nick,
      role,
      chatrooms,
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
