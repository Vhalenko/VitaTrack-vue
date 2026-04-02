<template>
  <div class="donut-card">
    <h3 class="card-label">Macro split</h3>

    <div class="donut-wrap">
      <!-- Donut ring -->
      <div class="donut-container">
        <svg viewBox="0 0 160 160" class="donut-svg">
          <g transform="rotate(-90 80 80)">
            <circle cx="80" cy="80" r="58" fill="none" stroke="var(--border)" stroke-width="18"/>
            <circle
              v-for="(seg, i) in segments"
              :key="seg.key"
              cx="80" cy="80" r="58"
              fill="none"
              :stroke="seg.color"
              stroke-width="18"
              stroke-linecap="butt"
              :stroke-dasharray="seg.dashArray"
              :stroke-dashoffset="seg.dashOffset"
              class="donut-seg"
              :style="{ animationDelay: `${i * 120}ms` }"
            />
          </g>
        </svg>

        <!-- Center label as HTML — always stays inside -->
        <div class="donut-center">
          <span class="donut-cal">{{ Math.round(totals.calories || 0) }}</span>
          <span class="donut-unit">kcal</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="donut-legend">
        <div v-for="seg in segments" :key="seg.key" class="legend-row">
          <span class="legend-dot" :style="{ background: seg.color }"></span>
          <span class="legend-name">{{ seg.label }}</span>
          <span class="legend-pct mono">{{ percentages[seg.key] }}%</span>
          <span class="legend-grams mono text-muted">{{ Math.round(totals[seg.key] || 0) }}g</span>
        </div>
        <div class="legend-row legend-row--kcal">
          <span class="legend-name text-muted text-xs">Kcal from macros</span>
          <span class="legend-grams mono text-muted text-xs">
            {{ Math.round((totals.protein_kcal || 0) + (totals.carbs_kcal || 0) + (totals.fat_kcal || 0)) }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="!totals.calories" class="donut-empty">
      No food logged yet
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totals:      { type: Object, default: () => ({}) },
  percentages: { type: Object, default: () => ({ protein: 0, carbs: 0, fat: 0 }) },
})

const COLORS = { protein: '#2d6a4f', carbs: '#e67e22', fat: '#c0392b' }
const LABELS = { protein: 'Protein', carbs: 'Carbs', fat: 'Fat' }

const circumference = 2 * Math.PI * 58

const segments = computed(() => {
  const keys = ['protein', 'carbs', 'fat']
  let consumed = 0
  return keys.map(key => {
    const pct  = (props.percentages[key] ?? 0) / 100
    const dash = pct * circumference
    const seg  = {
      key,
      label:      LABELS[key],
      color:      COLORS[key],
      dashArray:  `${dash} ${circumference - dash}`,
      dashOffset: -(circumference - consumed),
    }
    consumed += dash
    return seg
  })
})
</script>

<style scoped>
.donut-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 22px;
}

.card-label {
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.donut-wrap {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* Container gives the SVG a positioning context for the center label */
.donut-container {
  position: relative;
  width: 150px;
  height: 150px;
  flex-shrink: 0;
}

.donut-svg {
  width: 150px;
  height: 150px;
  display: block;
}

/* Center label sits in the hole of the donut via absolute positioning */
.donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.donut-cal {
  font-family: 'DM Mono', monospace;
  font-size: 1.375rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1;
}

.donut-unit {
  font-size: 0.6875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 3px;
}

.donut-seg {
  animation: drawIn 700ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes drawIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.donut-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 9px; height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-name {
  flex: 1;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.legend-pct {
  font-family: 'DM Mono', monospace;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  min-width: 36px;
  text-align: right;
}

.legend-grams {
  font-family: 'DM Mono', monospace;
  font-size: 0.8125rem;
  min-width: 38px;
  text-align: right;
}

.legend-row--kcal {
  border-top: 1px solid var(--border);
  padding-top: 8px;
  margin-top: 2px;
}

.donut-empty {
  text-align: center;
  padding: 20px;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>