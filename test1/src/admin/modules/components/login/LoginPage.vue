<template>
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
        const response = await axios.post("/api/admin/login", {
          id: this.id,
          pw: this.password,
        });

        const token = response.data.jwt;
        const nick = response.data.nick;

        localStorage.setItem("jwt", token);
        localStorage.setItem("adminNick", nick);
        localStorage.setItem("adminId", this.id);

        this.$router.go("/admin/chat/mnglist");
      } catch (err) {
        this.error =
          "Login failed: " + (err.response?.data?.message || "Unknown error");
        this.$router.go("/admin");
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
