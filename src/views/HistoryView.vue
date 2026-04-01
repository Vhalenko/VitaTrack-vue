<template>
  <div class="history-page">
    <AppNavbar />

    <main class="main">
      <div class="container">

        <!-- Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">History & Progress</h1>
            <p class="text-secondary text-sm">Your nutrition journey over time</p>
          </div>
          <RouterLink to="/dashboard" class="btn btn-ghost">← Dashboard</RouterLink>
        </div>

        <!-- Stats overview -->
        <StatsBar :stats="historyStore.stats" :goal="calorieGoal" />

        <!-- Trend chart -->
        <TrendChart
          :trend="historyStore.trend"
          :goal="calorieGoal"
          :avg-calories="historyStore.avgCalories"
          :days="historyStore.trendDays"
          :active-period="historyStore.trendDays"
          :loading="trendLoading"
          @change-period="onChangePeriod"
        />

        <!-- Calendar + Weight side by side -->
        <div class="mid-grid">
          <CalendarHeatmap
            :month="historyStore.currentMonth"
            :day-map="historyStore.dayMap"
            :selected-date="selectedDate"
            :goal="calorieGoal"
            :loading="historyStore.loading"
            @select="onSelectDay"
            @change-month="onChangeMonth"
          />
          <WeightTracker
            :weight-logs="historyStore.weightLogs"
            @add="onAddWeight"
          />
        </div>

      </div>
    </main>

    <!-- Day detail side panel -->
    <DayDetailPanel
      :day="historyStore.selectedDay"
      :loading="dayLoading"
      @close="selectedDate = ''; historyStore.selectedDay = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore }    from '@/stores/auth'
import { useHistoryStore } from '@/stores/history'
import AppNavbar       from '@/components/layout/AppNavbar.vue'
import StatsBar        from '@/components/history/StatsBar.vue'
import TrendChart      from '@/components/history/TrendChart.vue'
import CalendarHeatmap from '@/components/history/CalendarHeatmap.vue'
import WeightTracker   from '@/components/history/WeightTracker.vue'
import DayDetailPanel  from '@/components/history/DayDetailPanel.vue'

const auth         = useAuthStore()
const historyStore = useHistoryStore()

const selectedDate  = ref('')
const trendLoading  = ref(false)
const dayLoading    = ref(false)

const calorieGoal = computed(() => auth.user?.daily_calorie_goal ?? 2000)

onMounted(async () => {
  await Promise.all([
    historyStore.fetchMonthly(),
    historyStore.fetchTrend(30),
    historyStore.fetchStats(),
    historyStore.fetchWeight(),
  ])
})

async function onSelectDay(date) {
  selectedDate.value = date
  dayLoading.value   = true
  try {
    await historyStore.fetchDayDetail(date)
  } finally {
    dayLoading.value = false
  }
}

async function onChangeMonth(month) {
  await historyStore.fetchMonthly(month)
}

async function onChangePeriod(days) {
  trendLoading.value = true
  try {
    await historyStore.fetchTrend(days)
  } finally {
    trendLoading.value = false
  }
}

async function onAddWeight(weight, date) {
  await historyStore.addWeight(weight, date)
}
</script>

<style scoped>
.history-page { min-height: 100vh; background: var(--bg); }

.main { padding: 32px 24px 64px; }

.container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.mid-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

@media (max-width: 800px) {
  .mid-grid { grid-template-columns: 1fr; }
  .page-header { flex-direction: column; gap: 12px; }
  .main { padding: 20px 16px 48px; }
}
</style>