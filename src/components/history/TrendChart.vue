<template>
  <div class="trend-card">
    <div class="trend-header">
      <div>
        <h3 class="trend-title">Calorie trend</h3>
        <p class="text-xs text-muted" v-if="avgCalories">
          Avg {{ avgCalories }} kcal / day over {{ days }} days
        </p>
      </div>
      <div class="period-tabs">
        <button
          v-for="p in periods"
          :key="p.value"
          class="period-tab"
          :class="{ active: activePeriod === p.value }"
          @click="$emit('change-period', p.value)"
        >{{ p.label }}</button>
      </div>
    </div>

    <div class="chart-area" ref="chartArea">
      <svg v-if="points.length > 1" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" class="chart-svg">
        <!-- Goal line -->
        <line
          v-if="goal"
          :x1="PAD" :y1="goalY"
          :x2="W - PAD" :y2="goalY"
          stroke="var(--border)" stroke-width="1" stroke-dasharray="4 4"
        />

        <!-- Area fill -->
        <path :d="areaPath" class="area-fill" />

        <!-- Line -->
        <path :d="linePath" class="line-path" />

        <!-- Data points -->
        <g v-for="(p, i) in points" :key="i">
          <circle
            :cx="p.x" :cy="p.y" r="3.5"
            class="data-point"
            @mouseenter="tooltip = { ...p, index: i }"
            @mouseleave="tooltip = null"
          />
        </g>

        <!-- Tooltip -->
        <g v-if="tooltip" class="tooltip-group">
          <rect
            :x="clampX(tooltip.x - 50)"
            :y="tooltip.y - 44"
            width="100" height="36"
            rx="6"
            fill="var(--text-primary)"
          />
          <text
            :x="clampX(tooltip.x)"
            :y="tooltip.y - 28"
            text-anchor="middle"
            class="tooltip-date"
          >{{ formatTooltipDate(tooltip.date) }}</text>
          <text
            :x="clampX(tooltip.x)"
            :y="tooltip.y - 14"
            text-anchor="middle"
            class="tooltip-value"
          >{{ Math.round(tooltip.calories) }} kcal</text>
        </g>

        <!-- X axis labels -->
        <text
          v-for="(label, i) in xLabels"
          :key="'xl'+i"
          :x="label.x"
          :y="H - 4"
          text-anchor="middle"
          class="axis-label"
        >{{ label.text }}</text>

        <!-- Y axis labels -->
        <text
          v-for="(label, i) in yLabels"
          :key="'yl'+i"
          :x="PAD - 6"
          :y="label.y + 4"
          text-anchor="end"
          class="axis-label"
        >{{ label.text }}</text>
      </svg>

      <div v-else-if="!loading" class="chart-empty">
        <p>No data for this period</p>
        <p class="text-xs text-muted">Start logging food to see your trend</p>
      </div>

      <div v-if="loading" class="chart-loading">
        <div class="skeleton-line"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  trend:         { type: Array,  default: () => [] },
  goal:          { type: Number, default: 2000 },
  avgCalories:   { type: Number, default: 0 },
  days:          { type: Number, default: 30 },
  activePeriod:  { type: Number, default: 30 },
  loading:       { type: Boolean, default: false },
})

defineEmits(['change-period'])

const tooltip = ref(null)

const W   = 600
const H   = 180
const PAD = 40

const periods = [
  { label: '7d',  value: 7  },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
]

const minCal = computed(() => Math.min(...props.trend.map(d => +d.total_calories), props.goal * 0.5))
const maxCal = computed(() => Math.max(...props.trend.map(d => +d.total_calories), props.goal * 1.2))

const points = computed(() => {
  if (!props.trend.length) return []
  const n      = props.trend.length
  const xStep  = (W - PAD * 2) / Math.max(n - 1, 1)
  const yRange = maxCal.value - minCal.value || 1

  return props.trend.map((d, i) => ({
    x:        PAD + i * xStep,
    y:        PAD + (1 - (d.total_calories - minCal.value) / yRange) * (H - PAD * 2),
    calories: +d.total_calories,
    date:     d.log_date,
  }))
})

const goalY = computed(() => {
  const yRange = maxCal.value - minCal.value || 1
  return PAD + (1 - (props.goal - minCal.value) / yRange) * (H - PAD * 2)
})

const linePath = computed(() => {
  if (!points.value.length) return ''
  return points.value
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')
})

const areaPath = computed(() => {
  if (!points.value.length) return ''
  const bottom = H - PAD
  const first  = points.value[0]
  const last   = points.value[points.value.length - 1]
  return `${linePath.value} L ${last.x} ${bottom} L ${first.x} ${bottom} Z`
})

const xLabels = computed(() => {
  if (!points.value.length) return []
  const step = Math.ceil(points.value.length / 5)
  return points.value
    .filter((_, i) => i % step === 0 || i === points.value.length - 1)
    .map(p => ({
      x:    p.x,
      text: new Date(p.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }))
})

const yLabels = computed(() => {
  const range = maxCal.value - minCal.value || 1
  return [0, 0.25, 0.5, 0.75, 1].map(r => ({
    y:    PAD + (1 - r) * (H - PAD * 2),
    text: Math.round(minCal.value + r * range),
  }))
})

function clampX(x) {
  return Math.max(54, Math.min(W - 54, x))
}

function formatTooltipDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.trend-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 22px;
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}

.trend-title {
  font-size: 0.9375rem;
  font-weight: 500;
  margin-bottom: 2px;
}

.period-tabs {
  display: flex;
  background: var(--bg);
  border-radius: var(--radius);
  padding: 3px;
  gap: 2px;
}

.period-tab {
  padding: 4px 12px;
  font-size: 0.8125rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
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

.chart-area {
  position: relative;
  height: 180px;
}

.chart-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.line-path {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.area-fill {
  fill: var(--accent);
  opacity: 0.08;
}

.data-point {
  fill: var(--surface);
  stroke: var(--accent);
  stroke-width: 2;
  cursor: pointer;
  transition: r 150ms ease;
}
.data-point:hover { r: 5; }

.axis-label {
  font-size: 9px;
  fill: var(--text-muted);
  font-family: 'DM Mono', monospace;
}

.tooltip-date {
  font-size: 9px;
  fill: rgba(255,255,255,0.6);
  font-family: 'DM Sans', sans-serif;
}

.tooltip-value {
  font-size: 10px;
  fill: #fff;
  font-family: 'DM Mono', monospace;
  font-weight: 500;
}

.chart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 4px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.skeleton-line {
  width: 100%;
  height: 100%;
  background: var(--bg);
  border-radius: var(--radius);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
</style>