<template>
  <div class="card profile-form">
    <form @submit.prevent="submitForm">
      <h2>Account Information</h2>

      <input v-model="user.name" type="text" placeholder="Full Name" required />
      <input v-model="user.email" type="email" placeholder="Email" required />
      <input v-model="user.password" type="password" placeholder="Password" />

      <h2>Daily Goals</h2>
      <input v-model.number="user.calorieGoal" type="number" placeholder="Calorie Goal" />
      <input v-model.number="user.proteinGoal" type="number" placeholder="Protein Goal (g)" />
      <input v-model.number="user.carbsGoal" type="number" placeholder="Carbs Goal (g)" />
      <input v-model.number="user.fatGoal" type="number" placeholder="Fat Goal (g)" />

      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "ProfileForm",
  data() {
    return {
      user: {
        name: "John Doe",
        email: "john@example.com",
        password: "",
        calorieGoal: 2000,
        proteinGoal: 100,
        carbsGoal: 200,
        fatGoal: 70
      }
    };
  },
  methods: {
    submitForm() {
      this.$emit("update-profile", { ...this.user });
    }
  }
};
</script>

<style scoped>
.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-width: 400px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

button {
  padding: 10px;
  border-radius: 6px;
  border: none;
  background: #42b883;
  color: white;
  cursor: pointer;
}
</style>