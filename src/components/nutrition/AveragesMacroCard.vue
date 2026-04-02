<template>
  <div class="averages-card">
    <div class="avg-head">
      <h3 class="card-label">Avg over last</h3>
      <div class="period-tabs">
        <button
          v-for="p in periods"
          :key="p"
          class="period-tab"
          :class="{ active: activePeriod === p }"
          @click="$emit('change-period', p)"
        >{{ p }}d</button>
      </div>
    </div>

    <div v-if="averages && averages.days_with_data > 0" class="avg-content">
      <div class="avg-cal">
        <span class="avg-cal-num mono">{{ Math.round(averages.avg_calories) }}</span>
        <span class="avg-cal-label">avg kcal/day</span>
        <span class="avg-days text-xs text-muted">({{ averages.days_with_data }} days with data)</span>
      </div>

      <div class="avg-macros">
        <div v-for="m in macroRows" :key="m.key" class="avg-macro-row">
          <div class="avg-macro-head">
            <span class="avg-macro-name" :style="{ color: m.color }">{{ m.label }}</span>
            <div class="avg-macro-vals">
              <span class="mono">{{ Math.round(averages[m.avgKey]) }}g</span>
              <span class="text-muted text-xs">avg</span>
            </div>
          </div>
          <div class="avg-bar-track">
            <div
              class="avg-bar-fill"
              :style="{ width: barWidth(averages[m.avgKey], m.goal) + '%', background: m.color }"
            ></div>
            <!-- Goal marker -->
            <div class="goal-marker" :style="{ left: '100%' }" title="Your goal"></div>
          </div>
          <div class="avg-bar-footer">
            <span class="text-xs text-muted">0</span>
            <span class="text-xs text-muted">Goal: {{ m.goal }}g</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="avg-empty">
      No data for this period
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  averages:     { type: Object, default: null },
  goals:        { type: Object, default: () => ({ protein: 150, carbs: 250, fat: 65 }) },
  activePeriod: { type: Number, default: 7 },
})

defineEmits(['change-period'])

const periods = [7, 14, 30]

const macroRows = computed(() => [
  { key: 'protein', label: 'Protein', avgKey: 'avg_protein', color: '#2d6a4f', goal: props.goals.protein ?? 150 },
  { key: 'carbs',   label: 'Carbs',   avgKey: 'avg_carbs',   color: '#e67e22', goal: props.goals.carbs   ?? 250 },
  { key: 'fat',     label: 'Fat',     avgKey: 'avg_fat',      color: '#c0392b', goal: props.goals.fat     ?? 65  },
])

function barWidth(value, goal) {
  return Math.min((value / goal) * 100, 110)
}
</script>

<style scoped>
.averages-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 22px;
}

.avg-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.card-label {
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.period-tabs {
  display: flex;
  background: var(--bg);
  border-radius: var(--radius);
  padding: 3px;
  gap: 2px;
}

.period-tab {
  padding: 3px 10px;
  font-size: 0.8125rem;
  font-family: 'DM Sans', sans-serif;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-muted);
  transition: all var(--transition);
}
.period-tab.active {
  background: var(--surface);
  color: var(--text-primary);
  box-shadow: var(--shadow);
}

.avg-cal {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.avg-cal-num {
  font-family: 'DM Mono', monospace;
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1;
}

.avg-cal-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.avg-days { margin-left: auto; }

.avg-macros {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.avg-macro-row {}

.avg-macro-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.avg-macro-name {
  font-size: 0.875rem;
  font-weight: 500;
}

.avg-macro-vals {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 0.875rem;
}

.avg-bar-track {
  position: relative;
  height: 6px;
  background: var(--bg);
  border-radius: 6px;
  overflow: visible;
}

.avg-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 100%;
}

.goal-marker {
  position: absolute;
  top: -3px;
  width: 2px;
  height: 12px;
  background: var(--text-primary);
  border-radius: 2px;
  opacity: 0.3;
  transform: translateX(-50%);
}

.avg-bar-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
}

.avg-empty {
  text-align: center;
  padding: 24px;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>