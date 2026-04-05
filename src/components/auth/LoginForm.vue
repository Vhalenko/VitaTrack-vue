<template>
  <form @submit.prevent="handleSubmit" class="login-form">
    <div class="form-group">
      <BaseInput
        label="Email"
        type="email"
        placeholder="Enter your email"
        v-model="email"
      />
    </div>

    <div class="form-group">
      <BaseInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        v-model="password"
      />
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <BaseButton type="submit">
      Login
    </BaseButton>
  </form>
</template>

<script>
import { ref } from "vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import BaseButton from "@/components/shared/BaseButton.vue";

export default {
  name: "LoginForm",
  components: { BaseInput, BaseButton },
  emits: ["login"],
  setup(_, { emit }) {
    const email = ref("");
    const password = ref("");
    const error = ref("");

    const handleSubmit = () => {
      error.value = "";

      if (!email.value || !password.value) {
        error.value = "Please fill in all fields";
        return;
      }

      emit("login", { email: email.value, password: password.value });
    };

    return { email, password, error, handleSubmit };
  }
};
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.form-group {
  width: 100%;
  max-width: 300px;
  margin-bottom: 15px;
}

.error {
  color: red;
  margin-bottom: 10px;
  font-size: 0.9rem;
  text-align: center;
}

button {
  width: 100%;
  max-width: 300px;
}
</style>