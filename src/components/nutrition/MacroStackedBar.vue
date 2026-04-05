<template>
  <div class="stacked-card">
    <div class="stacked-head">
      <h3 class="card-label">Macro trend <span class="text-muted">(kcal)</span></h3>
      <div class="legend-inline">
        <span v-for="m in macros" :key="m.key" class="legend-item">
          <span class="leg-dot" :style="{ background: m.color }"></span>
          {{ m.label }}
        </span>
      </div>
    </div>

    <div class="chart-area" v-if="trend.length">
      <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" class="stacked-svg">
        <!-- Bars -->
        <g v-for="(day, i) in chartDays" :key="getDate(day)">
          <!-- fat is at the bottom -->
          <rect
            :x="barX(i)"
            :y="barY(0) - barH(day.fat_kcal)"
            :width="barW" :height="barH(day.fat_kcal)"
            :fill="macros[2].color"
            class="bar-seg"
            @mouseenter="tooltip = { ...day, x: barX(i) + barW / 2 }"
            @mouseleave="tooltip = null"
          />
          <!-- carbs sits on top of fat -->
          <rect
            :x="barX(i)"
            :y="barY(+day.fat_kcal) - barH(day.carbs_kcal)"
            :width="barW" :height="barH(day.carbs_kcal)"
            :fill="macros[1].color"
            class="bar-seg"
            @mouseenter="tooltip = { ...day, x: barX(i) + barW / 2 }"
            @mouseleave="tooltip = null"
          />
          <!-- protein sits on top of fat + carbs -->
          <rect
            :x="barX(i)"
            :y="barY(+day.fat_kcal + +day.carbs_kcal) - barH(day.protein_kcal)"
            :width="barW" :height="barH(day.protein_kcal)"
            :fill="macros[0].color"
            class="bar-seg"
            @mouseenter="tooltip = { ...day, x: barX(i) + barW / 2 }"
            @mouseleave="tooltip = null"
          />
          <!-- X label -->
          <text
            :x="barX(i) + barW / 2" :y="H - 3"
            text-anchor="middle" class="axis-label"
          >{{ formatLabel(day) }}</text>
        </g>

        <!-- Tooltip -->
        <g v-if="tooltip">
          <rect
            :x="clampX(tooltip.x - 60)" :y="10"
            width="120" height="72"
            rx="6" fill="var(--text-primary)"
          />
          <text :x="clampX(tooltip.x)" :y="28"  text-anchor="middle" class="tt-date">{{ formatFull(tooltip) }}</text>
          <text :x="clampX(tooltip.x)" :y="44"  text-anchor="middle" class="tt-row tt-p">P: {{ Math.round(tooltip.protein_kcal) }} kcal</text>
          <text :x="clampX(tooltip.x)" :y="57"  text-anchor="middle" class="tt-row tt-c">C: {{ Math.round(tooltip.carbs_kcal) }} kcal</text>
          <text :x="clampX(tooltip.x)" :y="70"  text-anchor="middle" class="tt-row tt-f">F: {{ Math.round(tooltip.fat_kcal) }} kcal</text>
        </g>
      </svg>
    </div>

    <div v-else class="stacked-empty">No macro data for this period</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  trend: { type: Array, default: () => [] },
})

const tooltip = ref(null)

const W   = 600
const H   = 160
const PAD = { left: 6, right: 6, top: 16, bottom: 18 }

const macros = [
  { key: 'protein_kcal', label: 'Protein', color: '#2d6a4f' },
  { key: 'carbs_kcal',   label: 'Carbs',   color: '#e67e22' },
  { key: 'fat_kcal',     label: 'Fat',     color: '#c0392b' },
]

const chartDays = computed(() => props.trend)

const maxTotal = computed(() =>
  Math.max(...chartDays.value.map(d => +d.total_kcal), 1)
)

const n    = computed(() => chartDays.value.length || 1)
const barW = computed(() => Math.max(4, (W - PAD.left - PAD.right) / n.value * 0.6))
const gap  = computed(() => (W - PAD.left - PAD.right) / n.value)
const chartH = computed(() => H - PAD.top - PAD.bottom)

function barX(i) { return PAD.left + i * gap.value + (gap.value - barW.value) / 2 }

// Returns the Y coordinate for the TOP of a segment.
// kcalBelow = sum of all segments already drawn below this one.
// SVG Y increases downward, so higher kcal = lower Y value (higher on screen).
function barY(kcalBelow) {
  const bottom = PAD.top + chartH.value          // bottom of chart area
  const filledPx = chartH.value * (+kcalBelow / maxTotal.value)
  return bottom - filledPx                        // move UP by filled amount
}

function barH(kcal) {
  return Math.max(1, chartH.value * (+kcal / maxTotal.value))
}

function clampX(x) { return Math.max(64, Math.min(W - 64, x)) }

// API returns log_date, not date
function getDate(day) { return day.log_date ?? day.date ?? '' }

function formatLabel(day) {
  const d = getDate(day)
  if (!d) return ''
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
function formatFull(day) {
  const d = getDate(day)
  if (!d) return ''
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.stacked-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 22px;
}

.stacked-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-label {
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.legend-inline {
  display: flex;
  gap: 14px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.leg-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.chart-area { height: 160px; }
.stacked-svg { width: 100%; height: 100%; overflow: visible; }

.bar-seg {
  opacity: 0.85;
  transition: opacity var(--transition);
}
.bar-seg:hover { opacity: 1; }

.axis-label {
  font-size: 8px;
  fill: var(--text-muted);
  font-family: 'DM Mono', monospace;
}

.tt-date { font-size: 9px; fill: rgba(255,255,255,0.55); font-family: 'DM Sans', sans-serif; }
.tt-row  { font-size: 9px; font-family: 'DM Mono', monospace; }
.tt-p    { fill: #52b788; }
.tt-c    { fill: #f0a458; }
.tt-f    { fill: #e07070; }

.stacked-empty {
  text-align: center;
  padding: 32px;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>