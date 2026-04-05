<template>
  <div class="dashboard">
    <AppNavbar />

    <main class="main">
      <div class="container">

        <!-- Top row: summary + macros -->
        <div class="top-grid">
          <CalorieSummary
            :eaten="totals.calories"
            :goal="auth.user?.daily_calorie_goal ?? 2000"
          />
          <MacroBar :totals="{ protein: totals.protein, carbs: totals.carbs, fat: totals.fat }" />
          <WeeklyChart
            :weekly="weekly"
            :goal="auth.user?.daily_calorie_goal ?? 2000"
            :active-date="activeDate"
            @select-date="onSelectDate"
          />
        </div>

        <!-- Food log section -->
        <div class="log-section">
          <div class="log-header">
            <h2 class="section-title">Food Log</h2>
            <div class="search-container">
              <FoodSearch @added="onFoodAdded" />
            </div>
          </div>

          <!-- Loading skeleton -->
          <div v-if="loading" class="skeleton-wrap">
            <div v-for="n in 4" :key="n" class="skeleton-meal"></div>
          </div>

          <!-- Meal sections -->
          <template v-else>
            <div class="meals-grid">
              <MealSection
                v-for="meal in meals"
                :key="meal"
                :meal="meal"
                :items="logs[meal] ?? []"
                @delete="handleDelete"
              />
            </div>

            <!-- Empty state -->
            <Transition name="fade">
              <div v-if="allEmpty" class="empty-state">
                <div class="empty-icon">🥗</div>
                <p>Nothing logged for {{ formattedDate }}.</p>
                <p class="text-muted text-sm">Search for a food above to get started.</p>
              </div>
            </Transition>
          </template>
        </div>

      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore }    from '@/stores/auth'
import { useFoodLogStore } from '@/stores/foodLog'
import AppNavbar    from '@/components/layout/AppNavbar.vue'
import CalorieSummary from '@/components/food/Caloriesummary.vue'
import MacroBar     from '@/components/layout/MacroBar.vue'
import WeeklyChart  from '@/components/food/Weeklychart .vue'
import FoodSearch   from '@/components/food/Foodsearch.vue'
import MealSection  from '@/components/food/Mealsection.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const auth    = useAuthStore()
const foodLog = useFoodLogStore()

const meals = ['breakfast', 'lunch', 'dinner', 'snack']

const logs       = computed(() => foodLog.logs)
const totals     = computed(() => foodLog.totals)
const weekly     = computed(() => foodLog.weekly)
const loading    = computed(() => foodLog.loading)
const activeDate = computed(() => foodLog.activeDate)

const allEmpty = computed(() =>
  meals.every(m => (logs.value[m] ?? []).length === 0)
)

const formattedDate = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  if (activeDate.value === today) return 'today'
  const d = new Date(activeDate.value + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
})

onMounted(async () => {
  await Promise.all([
    foodLog.fetchLogs(),
    foodLog.fetchWeekly(),
  ])
})

function onFoodAdded() {
  foodLog.fetchWeekly()
}

function onSelectDate(date) {
  foodLog.fetchLogs(date)
}

async function handleDelete(id) {
  await foodLog.deleteLog(id)
  foodLog.fetchWeekly()
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: var(--bg);
}

.main {
  padding: 32px 24px 64px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.top-grid {
  display: grid;
  grid-template-columns: 260px 1fr 1fr;
  gap: 16px;
}

.log-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.log-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.section-title {
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.search-container {
  flex: 1;
  max-width: 440px;
}

.meals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.skeleton-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.skeleton-meal {
  height: 56px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-secondary);
}
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}
.empty-state p { margin-bottom: 6px; }

@media (max-width: 900px) {
  .top-grid {
    grid-template-columns: 1fr 1fr;
  }
  .top-grid > :first-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  .top-grid        { grid-template-columns: 1fr; }
  .meals-grid      { grid-template-columns: 1fr; }
  .skeleton-wrap   { grid-template-columns: 1fr; }
  .log-header      { flex-direction: column; align-items: flex-start; }
  .search-container { max-width: 100%; width: 100%; }
  .main { padding: 20px 16px 48px; }
}
</style>