<template>
  <div class="leftMenu">
    <p class="dpn">왼쪽메뉴</p>
    <ul>
      <li>
        <router-link to="/chat/list" active-class="on">
          <img
            src="../../assets/images/chatlist.svg"
            alt="채팅 이력 아이콘"
          />채팅 이력
        </router-link>
      </li>
      <li>
        <router-link to="/chat/paginationTest" active-class="on">
          <img
            src="../../assets/images/chatlist.svg"
            alt="채팅 이력 아이콘"
          />페이징 테스트
        </router-link>
      </li>
    </ul>
  </div>
</template>
