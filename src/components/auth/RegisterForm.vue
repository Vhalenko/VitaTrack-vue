<template>
  <form @submit.prevent="handleSubmit" class="register-form">
    <div class="form-group">
      <BaseInput
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        v-model="name"
      />
    </div>

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

    <div class="form-group">
      <BaseInput
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        v-model="confirmPassword"
      />
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <BaseButton type="submit">
      Register
    </BaseButton>
  </form>
</template>

<script>
import { ref } from "vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import BaseButton from "@/components/shared/BaseButton.vue";

export default {
  name: "RegisterForm",
  components: {
    BaseInput,
    BaseButton
  },
  emits: ["register"],
  setup(props, { emit }) {
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const error = ref("");

    const handleSubmit = () => {
      error.value = "";

      if (!name.value || !email.value || !password.value || !confirmPassword.value) {
        error.value = "Please fill in all fields";
        return;
      }

      if (password.value !== confirmPassword.value) {
        error.value = "Passwords do not match";
        return;
      }

      emit("register", {
        name: name.value,
        email: email.value,
        password: password.value
      });
    };

    return {
      name,
      email,
      password,
      confirmPassword,
      error,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.register-form {
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