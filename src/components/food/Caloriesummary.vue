<template>
  <div class="summary-card">
    <div class="ring-wrap">
      <svg class="ring" viewBox="0 0 120 120">
        <!-- Background track -->
        <circle class="track" cx="60" cy="60" r="50"
          fill="none" stroke-width="8"/>
        <!-- Progress arc -->
        <circle class="progress" cx="60" cy="60" r="50"
          fill="none" stroke-width="8"
          :stroke-dasharray="`${circumference}`"
          :stroke-dashoffset="dashOffset"
          :class="progressClass"
        />
      </svg>
      <div class="ring-center">
        <span class="ring-number">{{ Math.round(remaining) }}</span>
        <span class="ring-label">{{ remaining >= 0 ? 'remaining' : 'over goal' }}</span>
      </div>
    </div>

    <div class="summary-stats">
      <div class="stat-row">
        <span class="stat-label">Goal</span>
        <span class="stat-value mono">{{ goal }}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Eaten</span>
        <span class="stat-value mono">{{ Math.round(eaten) }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-row">
        <span class="stat-label">{{ remaining >= 0 ? 'Left' : 'Over' }}</span>
        <span class="stat-value mono" :class="remaining < 0 ? 'over' : ''">
          {{ Math.abs(Math.round(remaining)) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  eaten: { type: Number, default: 0 },
  goal:  { type: Number, default: 2000 },
})

const circumference = computed(() => 2 * Math.PI * 50)
const percent       = computed(() => Math.min(props.eaten / props.goal, 1))
const dashOffset    = computed(() => circumference.value * (1 - percent.value))
const remaining     = computed(() => props.goal - props.eaten)
const progressClass = computed(() => {
  if (percent.value >= 1) return 'over'
  if (percent.value >= 0.85) return 'warning'
  return 'normal'
})
</script>

<style scoped>
.summary-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.ring-wrap {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.track {
  stroke: var(--border);
}

.progress {
  stroke-linecap: round;
  transition: stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1),
              stroke 300ms ease;
}
.progress.normal  { stroke: var(--accent); }
.progress.warning { stroke: #e67e22; }
.progress.over    { stroke: var(--error); }

.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ring-number {
  font-family: 'DM Mono', monospace;
  font-size: 1.375rem;
  font-weight: 500;
  line-height: 1;
  color: var(--text-primary);
}

.ring-label {
  font-size: 0.6875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-top: 4px;
}

.summary-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stat-value {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
}

.stat-value.mono {
  font-family: 'DM Mono', monospace;
  font-size: 0.9375rem;
}

.stat-value.over {
  color: var(--error);
}

.stat-divider {
  height: 1px;
  background: var(--border);
  margin: 2px 0;
}
</style>