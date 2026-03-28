<template>
  <div class="card">
    <h2>Daily Calories</h2>

    <div class="calorie-info">
      <p>Goal: {{ goal }} kcal</p>
      <p>Consumed: {{ consumed }} kcal</p>
      <p class="remaining">Remaining: {{ remaining }} kcal</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CalorieSummary",
  data() {
    return {
      goal: 2000,
      consumed: 1450
    };
  },
  computed: {
    remaining() {
      return this.goal - this.consumed;
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
}

.remaining {
  font-weight: bold;
  color: #42b883;
}
</style>