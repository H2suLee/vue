<template>
  <div>
    <a @click="fn_kakaoLogin">
      <img
        src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
        width="222"
    /></a>
  </div>
</template>

<script>
export default {
  methods: {
    fn_kakaoLogin() {
      window.Kakao.Auth.login({
        scope: "profile_nickname",
        success: this.fn_getKakaoAccount,
      });
    },
    fn_getKakaoAccount() {
      window.Kakao.API.request({
        url: "/v2/user/me",
        success: (res) => {
          var id = res.id;
          var nick = res.kakao_account.profile.nickname;

          //로그인 여부 저장
          localStorage.setItem("isAdminAuthenticated", "true");
          localStorage.setItem("id", id);
          localStorage.setItem("nickname", nick);
          localStorage.setItem("role", "ADM");
          this.$router.go("/admin/chat/manage");
        },
        fail: (error) => {
          console.log(error);
          localStorage.setItem("isAdminAuthenticated", "false");
        },
      });
    },
  },
};
</script>
