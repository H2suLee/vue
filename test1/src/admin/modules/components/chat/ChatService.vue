<template>
  <div class="contentW">
    <ul>
      <li class="tit">실시간 채팅 지원</li>
      <li class="navi">
        <ul>
          <li>홈</li>
          <li>실시간 채팅 지원</li>
        </ul>
      </li>
    </ul>
    <div v-if="chatrooms.length === 0">실시간 채팅 지원이 없습니다.</div>
    <div v-else>
      <h1 class="dpn">실시간 채팅 지원</h1>
      <table class="tbl">
        <!-- 내용, 날짜, 상태 -->
        <tbody>
          <tr
            v-for="chat in chatrooms?.slice(
              pageStartIdx,
              pageStartIdx + ITEM_PER_PAGE
            )"
            :key="chat.chatroomId"
            @click="openChatModal(chat._id)"
          >
            <td class="wd12">rid: {{ chat._id }}</td>
            <td class="wd12">닉: {{ chat.participants[0].nick }}</td>
            <td class="wd12">생성일: {{ chat.credt }}</td>
            <td class="wd12">상태: {{ chat.status }}</td>
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
import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "@/axios.js";
import ChatModal from "../../../../user/modules/components/chat/ChatModal.vue";
import Pagination from "@/common/Pagination.vue";
export default {
  components: { ChatModal, Pagination },
  setup() {
    const userId = ref(localStorage.getItem("adminId"));
    const nick = ref(localStorage.getItem("adminNick"));
    const role = ref("ADM");
    const isModalVisible = ref(false);
    const chatroomId = ref("");
    const chatrooms = ref([]);
    let activeAdminChkSocket = null;

    /* 페이징 관련 */
    const ITEM_PER_PAGE = ref(5);
    const PAGE_PER_SECTION = ref(5);
    let curPage = ref(1);

    const pageStartIdx = computed(() => {
      return (curPage.value - 1) * ITEM_PER_PAGE.value;
    });

    const onChangePage = (data) => {
      curPage.value = data;
    };

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
      let url = `ws://localhost:9090/ws/adminOnList?role=adm&nick=${nick.value}`;
      activeAdminChkSocket = new WebSocket(url);

      activeAdminChkSocket.onopen = () => {
        console.log("activeAdminChkSocket connection opened");
      };

      activeAdminChkSocket.onmessage = (event) => {
        console.log("activeAdminChkSocket got message");
        chatrooms.value = [];
        let jsonArr = JSON.parse(event.data);
        jsonArr.forEach((item) => {
          let jsonObj = {
            _id: item._id,
            participants: item.participants,
            credt: item.credt,
            status: item.status,
          };
          chatrooms.value.push(jsonObj);
        });
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
      ITEM_PER_PAGE,
      PAGE_PER_SECTION,
      pageStartIdx,
      onChangePage,
    };
  },
};
</script>
