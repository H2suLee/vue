<template>
  <div class="contentW">
    <ul>
      <li class="tit">채팅 이력</li>
      <li class="navi">
        <ul>
          <li>홈</li>
          <li>채팅이력</li>
        </ul>
      </li>
    </ul>
    <div>
      <ChatList />
    </div>
  </div>
</template>

<script>
import ChatList from "/src/user/modules/components/chat/ChatList.vue";

export default {
  components: {
    ChatList,
  }
};
</script>
