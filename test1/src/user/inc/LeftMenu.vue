<template>
  <div class="leftMenu">
    <p class="dpn">왼쪽메뉴</p>
    <ul>
      <li class="on">
        <router-link to="/chat/list">
          <img
            src="../../assets/images/chatlist.svg"
            alt="채팅 이력 아이콘"
          />채팅 이력 테스트 해보기
        </router-link>
      </li>
      <li>
        <router-link to="#none">
          <img
            src="../../assets/images/chatlist.svg"
            alt="채팅 이력 아이콘"
          />메뉴 추가 002
        </router-link>
      </li>
    </ul>
  </div>
</template>
