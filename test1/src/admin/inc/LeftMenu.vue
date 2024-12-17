<template>
  <div class="leftMenu">
    <p class="dpn">왼쪽메뉴</p>
    <ul>
      <li class="on">
        <router-link to="/admin/chat/mnglist">
          <img
            src="../../assets/images/chatlist.svg"
            alt="채팅 이력 아이콘"
          />채팅관리
        </router-link>
      </li>
      <li>
        <router-link to="/admin/chat/serviceList">
          <img
            src="../../assets/images/chatlist.svg"
            alt="채팅 이력 아이콘"
          />실시간 채팅 지원
        </router-link>
      </li>
      <li>
        <router-link to="/admin/chat/myList">
          <img
            src="../../assets/images/chatlist.svg"
            alt="채팅 이력 아이콘"
          />내 채팅
        </router-link>
      </li>
    </ul>
  </div>
</template>
