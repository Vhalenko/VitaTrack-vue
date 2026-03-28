<template>
  <div class="card">
    <h2>Add Food</h2>

    <form @submit.prevent="submitForm">

      <input
        v-model="food.name"
        type="text"
        placeholder="Food name"
        required
      />

      <input
        v-model.number="food.calories"
        type="number"
        placeholder="Calories"
        required
      />

      <input
        v-model.number="food.protein"
        type="number"
        placeholder="Protein (g)"
      />

      <input
        v-model.number="food.carbs"
        type="number"
        placeholder="Carbs (g)"
      />

      <input
        v-model.number="food.fat"
        type="number"
        placeholder="Fat (g)"
      />

      <select v-model="food.meal">
        <option>Breakfast</option>
        <option>Lunch</option>
        <option>Dinner</option>
        <option>Snack</option>
      </select>

      <button type="submit">Add Food</button>

    </form>
  </div>
</template>

<script>
export default {
  name: "AddFoodForm",
  data() {
    return {
      food: {
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        meal: "Breakfast"
      }
    };
  },
  methods: {
    submitForm() {
      this.$emit("add-food", { ...this.food });

      this.food = {
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        meal: "Breakfast"
      };
    }
  }
};
</script>

<style scoped>
.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

form {
  display: grid;
  gap: 10px;
}

input, select {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

button {
  background: #42b883;
  color: white;
  padding: 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
</style>