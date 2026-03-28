<template>
  <div class="food-log">
    <h1 class="title">Food Log</h1>

    <AddFoodForm @add-food="addFood" />

    <FoodList
      :foods="foods"
      @delete-food="deleteFood"
    />
  </div>
</template>

<script>
import AddFoodForm from "@/components/food/AddFoodForm.vue";
import FoodList from "@/components/food/FoodList.vue";

export default {
  name: "FoodLogView",
  components: {
    AddFoodForm,
    FoodList
  },
  data() {
    return {
      foods: []
    };
  },
  methods: {
    addFood(food) {
      this.foods.push(food);
    },
    deleteFood(index) {
      this.foods.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.food-log {
  padding: 20px;
}

.title {
  margin-bottom: 20px;
}
</style>