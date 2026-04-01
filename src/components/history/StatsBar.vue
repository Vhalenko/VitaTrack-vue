<template>
  <div class="stats-bar">
    <div v-for="s in statItems" :key="s.label" class="stat-item">
      <span class="stat-value mono">{{ s.value }}</span>
      <span class="stat-label">{{ s.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: { type: Object, default: null },
  goal:  { type: Number, default: 2000 },
})

const statItems = computed(() => {
  const s = props.stats
  if (!s) return []
  return [
    { label: 'Days tracked',    value: s.days_tracked        ?? '—' },
    { label: 'Avg daily kcal',  value: s.avg_daily_calories  ? Math.round(s.avg_daily_calories) : '—' },
    { label: 'Best day',        value: s.max_daily_calories  ? Math.round(s.max_daily_calories) + ' kcal' : '—' },
    { label: 'Lightest day',    value: s.min_daily_calories  ? Math.round(s.min_daily_calories) + ' kcal' : '—' },
    {
      label: 'Goal hit rate',
      value: s.days_tracked && s.avg_daily_calories && props.goal
        ? Math.round(Math.max(0, 100 - Math.abs(s.avg_daily_calories - props.goal) / props.goal * 100)) + '%'
        : '—'
    },
  ]
})
</script>

<style scoped>
.stats-bar {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.stat-item {
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-right: 1px solid var(--border);
}
.stat-item:last-child { border-right: none; }

.stat-value {
  font-family: 'DM Mono', monospace;
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

@media (max-width: 700px) {
  .stats-bar { grid-template-columns: repeat(3, 1fr); }
  .stat-item:nth-child(3) { border-right: none; }
  .stat-item:nth-child(4) { border-top: 1px solid var(--border); }
  .stat-item:nth-child(5) { border-top: 1px solid var(--border); border-right: none; }
}
</style>