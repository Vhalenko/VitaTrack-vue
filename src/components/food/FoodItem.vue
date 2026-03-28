<template>
  <div class="food-item">
    <div class="info">
      <h4>{{ food.name }}</h4>
      <p>{{ food.calories }} kcal</p>
      <small>
        Protein: {{ food.protein }}g |
        Carbs: {{ food.carbs }}g |
        Fat: {{ food.fat }}g
      </small>
      <p class="meal">{{ food.meal }}</p>
    </div>

    <button @click="$emit('delete-food', index)">
      Delete
    </button>
  </div>
</template>

<script>
export default {
  name: "FoodItem",
  props: {
    food: Object,
    index: Number
  }
};
</script>

<style scoped>
.food-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.info h4 {
  margin: 0;
}

.meal {
  font-weight: bold;
  color: #42b883;
}

button {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
}
</style>