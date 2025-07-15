<template>
  <div class="bg">
    <div style="display: block">
      <p>TOYCHAT</p>
      <a :href="getSocialLoginUrl('kakao')">
        <img src="@/assets/images/login/kakao_btn.webp" width="50"
      /></a>
      <a :href="getSocialLoginUrl('naver')">
        <img src="@/assets/images/login/naver_btnD_아이콘원형.png" width="50"
      /></a>
      <a :href="getSocialLoginUrl('google')">
        <img
          src="@/assets/images/login/google_web_neutral_rd_na@4x.png"
          width="50"
      /></a>
      <a :href="getSocialLoginUrl('github')">
        <img src="@/assets/images/login/github.png" width="50"
      /></a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getSocialLoginUrl(provider) {
      let baseUrl = window.location.origin;
      baseUrl = axios.defaults.baseURL;

      // 개발 서버에서 baseUrl이 9091이면 9090으로 바꿔줌
      if (baseUrl.includes("localhost")) {
        baseUrl = baseUrl.replace(":9091", ":9090");
      }

      return `${baseUrl}/oauth2/authorization/${provider}`;
    },
    // 안씀
    fn_kakaoLogin() {
      window.Kakao.Auth.login({
        scope: "profile_nickname",
        success: this.fn_getKakaoAccount,
      });
    },
    // 안씀
    fn_getKakaoAccount() {
      window.Kakao.API.request({
        url: "/v2/user/me",
        success: (res) => {
          var id = res.id;
          var nick = res.kakao_account.profile.nickname;

          //로그인 여부 저장
          localStorage.setItem("isAuthenticated", true);
          localStorage.setItem("id", id);
          localStorage.setItem("nick", nick);
          localStorage.setItem("role", "USR");
          this.$router.go("/");
        },
        fail: (error) => {
          console.log(error);
          localStorage.setItem("isAuthenticated", false);
        },
      });
    },
  },
};
</script>

<style>
@import "@/assets/css/base.css";
@import "@/assets/css/user.css";
</style>
