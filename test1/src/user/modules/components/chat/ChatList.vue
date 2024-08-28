<template>
  <div>
    <h1>채팅 이력</h1>
    <table>
      <!-- 생성일, 답변자, 내용, 마지막 채팅일시 -->
      <thead>
        <tr>
          <td>roomId</td>
          <td>생성일</td>
          <td>답변자</td>
          <td>채팅</td>
          <td>마지막 채팅일</td>
          <td>상태(대기/진행중/완료)</td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="chat in chatrooms"
          :key="chat.chatroomId"
          @click="openChatHistoryModal(chat.chatroomId)"
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
    <ChatHistoryModal
      v-model:modalValue="isChatHistoryModalVisible"
      :chatroomId="chatroomId"
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
        console.log("res", response.data);
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
