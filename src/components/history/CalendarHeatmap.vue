<template>
  <div class="calendar-card">
    <div class="cal-header">
      <button class="nav-btn" @click="prevMonth">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h3 class="cal-month">{{ monthLabel }}</h3>
      <button class="nav-btn" @click="nextMonth" :disabled="isCurrentMonth">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <div class="weekday-labels">
      <span v-for="d in weekdays" :key="d">{{ d }}</span>
    </div>

    <div class="cal-grid" v-if="!loading">
      <!-- Empty cells for offset -->
      <div v-for="n in startOffset" :key="'e'+n" class="cal-cell empty"></div>

      <!-- Day cells -->
      <button
        v-for="day in daysInMonth"
        :key="day.date"
        class="cal-cell"
        :class="{
          today: day.isToday,
          selected: selectedDate === day.date,
          logged: !!dayMap[day.date],
          future: day.isFuture,
        }"
        :style="cellStyle(day)"
        :title="dayMap[day.date] ? `${Math.round(dayMap[day.date].total_calories)} kcal` : ''"
        @click="!day.isFuture && $emit('select', day.date)"
        :disabled="day.isFuture"
      >
        <span class="day-num">{{ day.n }}</span>
        <span class="day-dot" v-if="dayMap[day.date]"></span>
      </button>
    </div>

    <div class="cal-grid loading" v-else>
      <div v-for="n in 35" :key="n" class="cal-cell skeleton"></div>
    </div>

    <!-- Legend -->
    <div class="legend">
      <span class="text-xs text-muted">Less</span>
      <div class="legend-steps">
        <div v-for="s in legendSteps" :key="s" class="legend-step" :style="{ background: heatColor(s, 1) }"></div>
      </div>
      <span class="text-xs text-muted">More</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  month:        { type: String,  required: true }, // YYYY-MM
  dayMap:       { type: Object,  default: () => ({}) },
  selectedDate: { type: String,  default: '' },
  goal:         { type: Number,  default: 2000 },
  loading:      { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'change-month'])

const weekdays    = ['M','T','W','T','F','S','S']
const legendSteps = [0.15, 0.35, 0.55, 0.75, 1]

function toLocal(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const today = toLocal(new Date())

const monthLabel = computed(() => {
  const [y, m] = props.month.split('-')
  return new Date(+y, +m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const isCurrentMonth = computed(() => {
  const now = new Date()
  const ym  = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return props.month === ym
})

const startOffset = computed(() => {
  const [y, m] = props.month.split('-')
  const d = new Date(+y, +m - 1, 1).getDay()
  return d === 0 ? 6 : d - 1 // Monday-first
})

const daysInMonth = computed(() => {
  const [y, m] = props.month.split('-')
  const count  = new Date(+y, +m, 0).getDate()
  return Array.from({ length: count }, (_, i) => {
    const n    = i + 1
    const date = `${y}-${m}-${String(n).padStart(2, '0')}`
    return { n, date, isToday: date === today, isFuture: date > today }
  })
})

function heatColor(ratio, alpha = 0.85) {
  if (!ratio) return 'transparent'
  // Green scale: light → dark accent
  const l = Math.round(90 - ratio * 50)
  return `hsla(152, 45%, ${l}%, ${alpha})`
}

function cellStyle(day) {
  const d = props.dayMap[day.date]
  if (!d) return {}
  const ratio = Math.min(parseFloat(d.total_calories) / props.goal, 1.3)
  return { background: heatColor(ratio * 0.8) }
}

function prevMonth() {
  const [y, m] = props.month.split('-').map(Number)
  const d = new Date(y, m - 2, 1)
  emit('change-month', `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
}

function nextMonth() {
  if (isCurrentMonth.value) return
  const [y, m] = props.month.split('-').map(Number)
  const d = new Date(y, m, 1)
  emit('change-month', `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
}
</script>

<style scoped>
.calendar-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 22px;
}

.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.cal-month {
  font-size: 0.9375rem;
  font-weight: 500;
}

.nav-btn {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--transition);
}
.nav-btn:hover:not(:disabled) {
  border-color: var(--text-primary);
  color: var(--text-primary);
}
.nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.weekday-labels {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 6px;
  text-align: center;
}
.weekday-labels span {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  padding: 2px 0;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}

.cal-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1.5px solid transparent;
  cursor: pointer;
  background: none;
  font-family: 'DM Sans', sans-serif;
  transition: all var(--transition);
  position: relative;
  gap: 2px;
}
.cal-cell.empty    { cursor: default; }
.cal-cell.future   { opacity: 0.3; cursor: not-allowed; }
.cal-cell.skeleton { background: var(--bg); animation: pulse 1.5s ease-in-out infinite; }

.cal-cell:not(.empty):not(.future):not(.skeleton):hover {
  border-color: var(--border);
  background: var(--bg);
}

.cal-cell.today .day-num {
  background: var(--accent);
  color: var(--bg);
  border-radius: 50%;
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
}

.cal-cell.selected {
  border-color: var(--text-primary) !important;
}

.day-num {
  font-size: 0.8125rem;
  color: var(--text-primary);
  line-height: 1;
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
}

.day-dot {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.7;
}

/* Legend */
.legend {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  justify-content: flex-end;
}

.legend-steps {
  display: flex;
  gap: 3px;
}

.legend-step {
  width: 14px; height: 14px;
  border-radius: 3px;
  border: 1px solid rgba(0,0,0,0.06);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
</style>