<template>
  <div>
    <h1>채팅 관리</h1>
    <table>
      <!-- 카테고리, 상태(진행중/완료), 채팅방 생성일, 마지막 수정,일 문의자, 관리-->
      <thead>
        <tr>
          <td>roomId</td>
          <td>상태(진행중/완료)</td>
          <td>카테고리</td>
          <td>생성일</td>
          <td>수정일</td>
          <td>문의자</td>
          <td>답변자</td>
          <td>관리</td>
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
              관리(클릭하면 카테고리/내용 등록할 수 있음)
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <ChatHistoryModal
      v-model:modalValue="isChatHistoryModalVisible"
      :chatroomId="chatroomId"
    />
    <ChatManageModal
      v-model:modalValue="isChatManageModalVisible"
      :chatroomId="chatroomId"
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
      console.log("admId : ", userId.value);
      console.log("admnick : ", nick.value);
      try {
        const response = await axios.post("/api/admin/chat/mnglist", {
          id: userId.value,
        });
        console.log("res : ", response.data);
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

    // 채팅 관리창 열기
    const openChatManageModal = (id) => {
      chatroomId.value = id;
      isChatManageModalVisible.value = true;
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
    };
  },
};
</script>
