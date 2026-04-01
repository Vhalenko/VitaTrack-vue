<template>
  <Transition name="panel">
    <div v-if="day" class="panel-overlay" @click.self="$emit('close')">
      <div class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">{{ formattedDate }}</h3>
            <p class="text-sm text-muted" v-if="day.totals">
              {{ Math.round(day.totals.calories) }} kcal total
            </p>
          </div>
          <button class="close-btn" @click="$emit('close')">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Macro summary -->
        <div class="macro-row" v-if="day.totals">
          <div v-for="m in macros" :key="m.key" class="macro-pill">
            <span class="pill-val mono">{{ Math.round(day.totals[m.key]) }}g</span>
            <span class="pill-label">{{ m.label }}</span>
          </div>
        </div>

        <!-- Meals -->
        <div class="meals" v-if="day.logs">
          <div v-for="meal in mealOrder" :key="meal" class="meal-group">
            <template v-if="day.logs[meal]?.length">
              <div class="meal-label">
                <span>{{ mealIcons[meal] }} {{ meal }}</span>
                <span class="mono text-xs text-muted">
                  {{ mealCalories(day.logs[meal]) }} kcal
                </span>
              </div>
              <div v-for="item in day.logs[meal]" :key="item.id" class="food-row">
                <span class="food-name text-sm">{{ item.name }}</span>
                <span class="food-meta text-xs text-muted">{{ item.portion_grams }}g · {{ Math.round(item.total_calories) }} kcal</span>
              </div>
            </template>
          </div>
        </div>

        <div v-if="loading" class="panel-loading">
          <div v-for="n in 3" :key="n" class="skeleton" :style="{ height: '44px', marginBottom: '8px' }"></div>
        </div>

        <!-- Go to day button -->
        <RouterLink
          :to="`/dashboard`"
          class="btn btn-ghost btn-full"
          style="margin-top: 16px; text-align: center;"
          @click="goToDay"
        >
          View in dashboard →
        </RouterLink>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useFoodLogStore } from '@/stores/foodLog'

const props = defineProps({
  day:     { type: Object,  default: null },
  loading: { type: Boolean, default: false },
})

defineEmits(['close'])

const foodLog = useFoodLogStore()

const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack']
const mealIcons = { breakfast: '☀️', lunch: '🥗', dinner: '🍽️', snack: '🍎' }
const macros    = [
  { key: 'protein', label: 'Protein' },
  { key: 'carbs',   label: 'Carbs'   },
  { key: 'fat',     label: 'Fat'     },
]

const formattedDate = computed(() => {
  if (!props.day?.date) return ''
  return new Date(props.day.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
})

function mealCalories(items) {
  return Math.round(items.reduce((s, i) => s + +i.total_calories, 0))
}

function goToDay() {
  if (props.day?.date) foodLog.fetchLogs(props.day.date)
}
</script>

<style scoped>
.panel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.25);
  backdrop-filter: blur(2px);
  z-index: 150;
  display: flex;
  justify-content: flex-end;
}

.panel {
  width: 340px;
  height: 100%;
  background: var(--surface);
  border-left: 1px solid var(--border);
  padding: 28px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.panel-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 2px;
}

.close-btn {
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--text-muted);
  transition: all var(--transition);
}
.close-btn:hover { border-color: var(--text-primary); color: var(--text-primary); }

.macro-row {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.macro-pill {
  flex: 1;
  background: var(--bg);
  border-radius: var(--radius);
  padding: 10px 8px;
  text-align: center;
}

.pill-val {
  display: block;
  font-family: 'DM Mono', monospace;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.pill-label {
  display: block;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-top: 2px;
}

.meals { display: flex; flex-direction: column; gap: 14px; }

.meal-group {}

.meal-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: capitalize;
  color: var(--text-secondary);
  margin-bottom: 6px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border);
}

.food-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 5px 0;
}

.food-name { color: var(--text-primary); }
.food-meta { color: var(--text-muted); }

.skeleton {
  background: var(--bg);
  border-radius: var(--radius);
  animation: pulse 1.5s ease-in-out infinite;
}

/* Panel slide */
.panel-enter-active, .panel-leave-active {
  transition: opacity 250ms ease;
}
.panel-enter-active .panel,
.panel-leave-active .panel {
  transition: transform 250ms ease;
}
.panel-enter-from, .panel-leave-to { opacity: 0; }
.panel-enter-from .panel, .panel-leave-to .panel { transform: translateX(100%); }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
</style>