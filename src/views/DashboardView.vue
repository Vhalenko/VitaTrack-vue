<template>
  <div class="dashboard">
    <h1 class="title">Dashboard</h1>

    <div class="dashboard-grid">
      <CalorieSummary />
      <MacroSummary />
      <MealSummary />
      <QuickActions />
    </div>
  </div>
</template>

<script>
import CalorieSummary from "@/components/dashboard/CalorieSummary.vue";
import MacroSummary from "@/components/dashboard/MacroSummary.vue";
import MealSummary from "@/components/dashboard/MealSummary.vue";
import QuickActions from "@/components/dashboard/QuickActions.vue";

export default {
  name: "DashboardView",
  components: {
    CalorieSummary,
    MacroSummary,
    MealSummary,
    QuickActions
  }
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.title {
  margin-bottom: 20px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
</style>