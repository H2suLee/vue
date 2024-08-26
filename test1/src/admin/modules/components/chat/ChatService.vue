<template>
  <div>
    <h1>실시간 채팅 지원</h1>
    <table>
      <!-- 내용, 날짜, 상태 -->
      <tbody>
        <tr
          v-for="chat in chatrooms"
          :key="chat.chatroomId"
          @click="openChatModal(chat._id)"
        >
          <td>닉: {{ chat.participants[0].nick }}</td>
          <td>생성일: {{ chat.credt }}</td>
          <td>상태: {{ chat.status }}</td>
        </tr>
      </tbody>
    </table>
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
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import ChatModal from "../../../../user/modules/components/chat/ChatModal.vue";

export default {
  components: { ChatModal },
  setup() {
    const userId = ref(localStorage.getItem("adminId"));
    const nick = ref(localStorage.getItem("adminNick"));
    const role = ref("ADM");
    const isModalVisible = ref(false);
    const chatroomId = ref("");
    const chatrooms = ref([]);
    let activeAdminChkSocket = null;

    const openChatModal = (id) => {
      chatroomId.value = id;
      isModalVisible.value = true;
    };

    const getLiveChatWaitingList = async () => {
      try {
        const response = await axios.post(
          "/api/admin/chat/liveChatWaitingList",
          {
            //id: userId.value,
          }
        );

        chatrooms.value = response.data;
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };

    const openActiveAdminChkSocket = () => {
      let url = `ws://localhost:9090/ws/adminOnList?nick=${nick.value}`;
      activeAdminChkSocket = new WebSocket(url);

      activeAdminChkSocket.onopen = () => {
        console.log("activeAdminChkSocket connection opened");
      };

      activeAdminChkSocket.onclose = () => {
        console.log("activeAdminChkSocket connection closed");
      };

      activeAdminChkSocket.onerror = (error) => {
        console.error("activeAdminChkSocket error:", error);
      };
    };

    onMounted(() => {
      // 웹소켓 연결
      openActiveAdminChkSocket();
      // 실시간 상담 대기 리스트
      getLiveChatWaitingList();
    });

    // 다른 페이지로 이동시 웹소켓 close
    onUnmounted(() => {
      if (activeAdminChkSocket) {
        activeAdminChkSocket.close();
      }
    });

    return {
      userId,
      nick,
      role,
      chatrooms,
      chatroomId,
      isModalVisible,
      openChatModal,
    };
  },
};
</script>
