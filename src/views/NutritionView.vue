<template>
  <div class="nutrition-page">
    <AppNavbar />

    <main class="main">
      <div class="container">

        <!-- Header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Nutrition</h1>
            <p class="text-secondary text-sm">{{ formattedDate }}</p>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-if="nutritionStore.loading" class="skeleton-grid">
          <div class="skeleton" style="height: 200px"></div>
          <div class="skeleton" style="height: 200px"></div>
          <div class="skeleton" style="height: 200px; grid-column: 1/-1"></div>
        </div>

        <template v-else>
          <!-- Top row: donut + averages + top foods -->
          <div class="top-grid">
            <MacroDonut
              :totals="dayTotals"
              :percentages="dayPercentages"
            />
            <AveragesMacroCard
              :averages="nutritionStore.averages"
              :goals="macroGoals"
              :active-period="nutritionStore.avgPeriod"
              @change-period="onChangePeriod"
            />
            <TopFoodsCard :foods="nutritionStore.topFoods" />
          </div>

          <!-- Stacked macro trend -->
          <MacroStackedBar :trend="nutritionStore.macroTrend" />

          <!-- Per-food breakdown table -->
          <FoodBreakdownTable :items="dayItems" />

          <!-- Empty day state -->
          <Transition name="fade">
            <div v-if="!nutritionStore.hasDayData && !nutritionStore.loading" class="empty-day">
              <div class="empty-icon">🥗</div>
              <p>No food logged for {{ formattedDate }}</p>
              <p class="text-sm text-muted">Head to the dashboard to log your meals.</p>
              <RouterLink to="/dashboard" class="btn btn-primary" style="margin-top:12px">
                Go to dashboard
              </RouterLink>
            </div>
          </Transition>
        </template>
      </div>
    </main>
    <AppFooter/>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useAuthStore }      from '@/stores/auth'
import { useNutritionStore } from '@/stores/nutrition'
import { useFoodLogStore }   from '@/stores/foodLog'
import AppNavbar          from '@/components/layout/AppNavbar.vue'
import AppFooter       from '@/components/layout/AppFooter.vue'
import MacroDonut         from '@/components/nutrition/MacroDonut.vue'
import FoodBreakdownTable from '@/components/nutrition/FoodBreakdownTable.vue'
import MacroStackedBar    from '@/components/nutrition/MacroStackedBar.vue'
import AveragesMacroCard  from '@/components/nutrition/AveragesMacroCard.vue'
import TopFoodsCard       from '@/components/nutrition/TopFoodsCard.vue'

const auth           = useAuthStore()
const nutritionStore = useNutritionStore()
const foodLog        = useFoodLogStore()

const activeDate = computed(() => foodLog.activeDate)

const dayTotals = computed(() => nutritionStore.dayBreakdown?.totals ?? {
  calories: 0, protein: 0, carbs: 0, fat: 0,
  protein_kcal: 0, carbs_kcal: 0, fat_kcal: 0,
})

const dayPercentages = computed(() => nutritionStore.dayBreakdown?.percentages ?? {
  protein: 0, carbs: 0, fat: 0,
})

const dayItems = computed(() => nutritionStore.dayBreakdown?.items ?? [])

const formattedDate = computed(() => {
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
  if (activeDate.value === today) return "Today's breakdown"
  return new Date(activeDate.value + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
})

const macroGoals = computed(() => {
  const cal = auth.user?.daily_calorie_goal ?? 2000
  return {
    protein: Math.round(cal * 0.30 / 4),
    carbs:   Math.round(cal * 0.45 / 4),
    fat:     Math.round(cal * 0.25 / 9),
  }
})

watch(activeDate, (date) => {
  nutritionStore.fetchDay(date)
})

onMounted(async () => {
  await Promise.all([
    nutritionStore.fetchDay(activeDate.value),
    nutritionStore.fetchAverages(7),
    nutritionStore.fetchTopFoods(),
    nutritionStore.fetchMacroTrend(14),
  ])
})

async function onChangePeriod(days) {
  await nutritionStore.fetchAverages(days)
}
</script>

<style scoped>
.nutrition-page { min-height: 100vh; background: var(--bg); }

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

.top-grid {
  display: grid;
  grid-template-columns: 280px 1fr 1fr;
  gap: 16px;
  align-items: start;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: 280px 1fr 1fr;
  gap: 16px;
}

.skeleton {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.empty-day {
  text-align: center;
  padding: 56px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
.empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
.empty-day p { margin-bottom: 6px; }

@media (max-width: 900px) {
  .top-grid        { grid-template-columns: 1fr 1fr; }
  .top-grid > :first-child { grid-column: 1 / -1; }
  .skeleton-grid   { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 600px) {
  .top-grid      { grid-template-columns: 1fr; }
  .skeleton-grid { grid-template-columns: 1fr; }
  .page-header   { flex-direction: column; gap: 12px; }
  .main          { padding: 20px 16px 48px; }
}
</style>