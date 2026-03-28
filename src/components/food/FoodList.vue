<template>
  <div class="card">
    <h2>Today's Foods</h2>

    <div v-if="foods.length === 0">
      No foods added yet
    </div>

    <FoodItem
      v-for="(food, index) in foods"
      :key="index"
      :food="food"
      :index="index"
      @delete-food="$emit('delete-food', index)"
    />
  </div>
</template>

<script>
import FoodItem from "./FoodItem.vue";

export default {
  name: "FoodList",
  components: {
    FoodItem
  },
  props: {
    foods: Array
  }
};
</script>

<style scoped>
.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>