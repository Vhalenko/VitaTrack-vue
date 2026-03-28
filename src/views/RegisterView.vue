<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Register</h1>

      <RegisterForm @register="handleRegister" />

      <p class="login-link">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import RegisterForm from "@/components/auth/RegisterForm.vue";

export default {
  name: "RegisterView",
  components: {
    RegisterForm
  },
  methods: {
    handleRegister(userData) {
      console.log("Register data:", userData);

      // Fake frontend registration
      localStorage.setItem("user", JSON.stringify(userData));

      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f6f8;
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  margin-bottom: 20px;
}

.login-link {
  margin-top: 15px;
}
</style>