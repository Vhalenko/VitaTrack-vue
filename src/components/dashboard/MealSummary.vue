<template>
  <div class="card">
    <h2>Today's Meals</h2>

    <div class="meal">
      <p><strong>Breakfast:</strong> 350 kcal</p>
      <p><strong>Lunch:</strong> 600 kcal</p>
      <p><strong>Dinner:</strong> 400 kcal</p>
      <p><strong>Snacks:</strong> 100 kcal</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MealSummary"
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