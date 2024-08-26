<template>
  <div>
    <h1>채팅 이력</h1>
    <table>
      <!-- 내용, 날짜, 상태 -->
      <tbody>
        <tr
          v-for="chat in chatrooms"
          :key="chat.chatroomId"
          @click="openChatHistoryModal(chat.chatroomId)"
        >
          <td>{{ chat.lastContent }}</td>
          <td>{{ chat.lastCredt }}</td>
          <td>{{ chat.status }}</td>
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
import axios from "axios";
import ChatHistoryModal from "./ChatHistoryModal.vue";

export default {
  components: { ChatHistoryModal },
  setup() {
    const userId = ref(localStorage.getItem("id"));
    const nick = ref(localStorage.getItem("nick"));
    const chatrooms = ref([]);
    const chatroomId = ref("");
    const isChatHistoryModalVisible = ref(false);
    // 채팅 리스트 가져오기 함수
    const getMyChatroomList = async () => {
      try {
        const response = await axios.post("/api/chat/chatroomList", {
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
      getMyChatroomList();
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
