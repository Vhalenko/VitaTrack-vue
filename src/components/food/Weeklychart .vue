<template>
  <div class="chart-card">
    <h3 class="chart-title">This Week</h3>
    <div class="chart-wrap">
      <div v-if="!hasData" class="chart-empty">No data yet this week</div>
      <div v-else class="bar-chart">
        <div
          v-for="day in chartDays"
          :key="day.date"
          class="bar-col"
          :class="{ today: day.isToday, active: day.date === activeDate }"
          @click="$emit('select-date', day.date)"
        >
          <span class="bar-label-top mono" v-if="day.calories > 0">
            {{ day.calories > 999 ? Math.round(day.calories / 100) / 10 + 'k' : day.calories }}
          </span>
          <div class="bar-track">
            <div
              class="bar-fill"
              :style="{ height: day.percent + '%' }"
              :class="barClass(day)"
            ></div>
          </div>
          <span class="bar-day">{{ day.label }}</span>
        </div>
      </div>
      <!-- Goal line label -->
      <div class="goal-note text-xs text-muted" v-if="hasData">
        Goal: {{ goal }} kcal / day
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  weekly:     { type: Array,  default: () => [] },
  goal:       { type: Number, default: 2000 },
  activeDate: { type: String, default: '' },
})

defineEmits(['select-date'])

const today = new Date().toISOString().slice(0, 10)

const hasData = computed(() => props.weekly.length > 0)

const chartDays = computed(() => {
  const days = []
  const maxCal = Math.max(...props.weekly.map(w => w.total_calories), props.goal)

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const found   = props.weekly.find(w => w.log_date === dateStr)
    const cals    = found ? Math.round(found.total_calories) : 0

    days.push({
      date:    dateStr,
      label:   d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1),
      calories: cals,
      percent: maxCal > 0 ? Math.min((cals / maxCal) * 100, 100) : 0,
      isToday: dateStr === today,
      overGoal: cals > props.goal,
    })
  }
  return days
})

function barClass(day) {
  if (day.overGoal)  return 'over'
  if (day.isToday)   return 'today'
  if (day.calories)  return 'normal'
  return 'empty'
}
</script>

<style scoped>
.chart-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.chart-title {
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.chart-wrap { position: relative; }

.chart-empty {
  text-align: center;
  padding: 32px 0;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 100px;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border-radius: var(--radius);
  padding: 4px 2px;
  transition: background var(--transition);
}
.bar-col:hover { background: var(--bg); }
.bar-col.active { background: var(--accent-light); }

.bar-label-top {
  font-family: 'DM Mono', monospace;
  font-size: 0.6875rem;
  color: var(--text-muted);
  min-height: 14px;
}

.bar-track {
  flex: 1;
  width: 100%;
  background: var(--bg);
  border-radius: 3px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  min-height: 60px;
}

.bar-fill {
  width: 100%;
  border-radius: 3px;
  transition: height 500ms cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 3px;
}
.bar-fill.normal { background: var(--accent); opacity: 0.6; }
.bar-fill.today  { background: var(--accent); opacity: 1; }
.bar-fill.over   { background: var(--error); opacity: 0.7; }
.bar-fill.empty  { background: var(--border); min-height: 2px; }

.bar-day {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}
.bar-col.today .bar-day {
  color: var(--accent);
  font-weight: 600;
}

.goal-note {
  margin-top: 12px;
  text-align: right;
}
</style>