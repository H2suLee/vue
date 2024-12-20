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
    </div>
    <ChatHistoryModal
      v-model:modalValue="isChatHistoryModalVisible"
      :chatroomId="chatroomId"
      @reset-chatroom-id="resetChatroomId"
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
      chatrooms,
      chatroomId,
      isChatHistoryModalVisible,
      openChatHistoryModal,
      resetChatroomId,
    };
  },
};
</script>
