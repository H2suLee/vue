<template>
  <div>
    <h1>채팅 관리</h1>
    <table>
      <!-- 카테고리, 채팅방 생성일, 마지막 수정일, 참여자 -->
      <tbody>
        <tr
          v-for="chat in chatrooms"
          :key="chat.chatroomId"
          @click="openChatHistoryModal(chat.chatroomId)"
        >
          <td>카테고리</td>
          <td>채팅방 생성일</td>
          <td>{{ chat.lastCredt }}</td>
          <td>문의자</td>
          <td>답변자</td>
          <td><button>관리</button>클릭하면 카테고리/내용 등록할 수 있음</td>
        </tr>
      </tbody>
    </table>
    <ChatHistoryModal
      v-model:modalValue="isChatHistoryModalVisible"
      :chatroomId="chatroomId"
      :userId="userId"
      :nick="nick"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "@/axios.js";
import ChatHistoryModal from "../../../../user/modules/components/chat/ChatHistoryModal.vue";

export default {
  components: { ChatHistoryModal },
  setup() {
    const userId = ref(localStorage.getItem("adminId"));
    const nick = ref(localStorage.getItem("adminNick"));
    const chatrooms = ref([]);
    const chatroomId = ref("");
    const isChatHistoryModalVisible = ref(false);

    // 채팅 리스트 가져오기 함수
    const getChatroomMngList = async () => {
      console.log("admId : ", userId.value);
      console.log("admnick : ", nick.value);
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
      chatroomId.value = id;
      isChatHistoryModalVisible.value = true;
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
      openChatHistoryModal,
    };
  },
};
</script>
