<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>

      <!-- Use the reusable LoginForm component -->
      <LoginForm @login="handleLogin" />

      <p class="register-link">
        Don't have an account?
        <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/auth/LoginForm.vue";

export default {
  name: "LoginView",
  components: {
    LoginForm
  },
  methods: {
    handleLogin(credentials) {
      // credentials = { email, password } emitted from LoginForm
      console.log("Login data:", credentials);

      if (
        credentials.email === "test@test.com" &&
        credentials.password === "123456"
      ) {
        localStorage.setItem("user", JSON.stringify(credentials));
        this.$router.push("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    }
  }
};
</script>
<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f6f8;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px; /* limit card width */
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>