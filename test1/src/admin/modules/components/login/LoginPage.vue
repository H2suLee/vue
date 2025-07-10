<template>
  <div class="bg">
    <div class="login">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="username">Id:</label>
          <input type="text" v-model="id" id="id" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit">Login</button>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      id: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("/api/adminLogin", {
          id: this.id,
          pw: this.password,
        });

        const token = response.data.jwt;
        const nick = response.data.nick;
        localStorage.setItem("jwt", token);
        localStorage.setItem("adminNick", nick);
        localStorage.setItem("adminId", this.id);
        localStorage.setItem("isAuthenticated", true);
        console.log("성공");
        this.$router.go("/admin");
      } catch (err) {
        console.error(err);
        this.error =
          "Login failed: " + (err.response?.data?.message || "Unknown error");
        //this.$router.go("/admin");
        localStorage.setItem("isAuthenticated", false);
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
