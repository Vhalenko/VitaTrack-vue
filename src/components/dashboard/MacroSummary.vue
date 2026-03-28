<template>
  <div class="card">
    <h2>Macronutrients</h2>

    <div class="macro">
      <p>Protein: {{ protein }}g</p>
      <p>Carbs: {{ carbs }}g</p>
      <p>Fat: {{ fat }}g</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MacroSummary",
  data() {
    return {
      protein: 80,
      carbs: 150,
      fat: 50
    };
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