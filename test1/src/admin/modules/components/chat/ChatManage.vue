<template>
  <div>
    <h1 class="dpn">채팅 관리</h1>
    <table class="tbl">
      <!-- 카테고리, 상태(진행중/완료), 채팅방 생성일, 마지막 수정,일 문의자, 관리-->
      <thead>
        <tr>
          <td class="wd6">roomId</td>
          <td class="wd12">상태(진행중/완료)</td>
          <td class="wd12">카테고리</td>
          <td class="wd12">생성일</td>
          <td class="wd12">수정일</td>
          <td class="wd12">문의자</td>
          <td class="wd12">답변자</td>
          <td class="wd6">관리</td>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="chat in chatrooms"
          :key="chat.chatroomId"
          @click="openChatHistoryModal(chat.chatroomId)"
        >
          <td>{{ chat.chatroomId }}</td>
          <td>{{ chat.status }}</td>
          <td>카테고리</td>
          <td>{{ chat.credt }}</td>
          <td>{{ chat.upddt }}</td>
          <td>{{ chat.usr.nick }}</td>
          <td>{{ chat.adm.nick }}</td>
          <td>
            <button @click.stop="openChatManageModal(chat.chatroomId)">
              관리
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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
import { ref, onMounted } from "vue";
import axios from "@/axios.js";
import ChatHistoryModal from "../../../../user/modules/components/chat/ChatHistoryModal.vue";
import ChatManageModal from "./ChatManageModal.vue";

export default {
  components: { ChatHistoryModal, ChatManageModal },
  setup() {
    const userId = ref(localStorage.getItem("adminId"));
    const nick = ref(localStorage.getItem("adminNick"));
    const chatrooms = ref([]);
    const chatroomId = ref("");
    const isChatHistoryModalVisible = ref(false);
    const isChatManageModalVisible = ref(false);

    // 채팅 리스트 가져오기 함수
    const getChatroomMngList = async () => {
      try {
        const response = await axios.post("/api/admin/chat/mnglist", {
          id: userId.value,
        });
        chatrooms.value = response.data;
      } catch (error) {
        console.error("Error fetching chat list:", error);
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
    };
  },
};
</script>
