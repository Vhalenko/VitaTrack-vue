<template>
  <div class="macro-card">
    <h3 class="macro-title">Macros</h3>
    <div class="macros">
      <div v-for="m in macros" :key="m.key" class="macro-item">
        <div class="macro-head">
          <span class="macro-name">{{ m.label }}</span>
          <span class="macro-value mono">{{ Math.round(totals[m.key]) }}<span class="macro-unit">g</span></span>
        </div>
        <div class="macro-bar-track">
          <div
            class="macro-bar-fill"
            :style="{
              width: barWidth(totals[m.key], m.goal) + '%',
              background: m.color
            }"
          ></div>
        </div>
        <div class="macro-goal">
          <span class="text-xs text-muted">{{ Math.round(totals[m.key]) }} / {{ m.goal }}g</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  totals: {
    type: Object,
    default: () => ({ protein: 0, carbs: 0, fat: 0 }),
  },
  goals: {
    type: Object,
    default: () => ({ protein: 150, carbs: 250, fat: 65 }),
  },
})

const macros = [
  { key: 'protein', label: 'Protein', color: '#2d6a4f', goal: props.goals.protein ?? 150 },
  { key: 'carbs',   label: 'Carbs',   color: '#e67e22', goal: props.goals.carbs   ?? 250 },
  { key: 'fat',     label: 'Fat',     color: '#c0392b', goal: props.goals.fat     ?? 65  },
]

function barWidth(value, goal) {
  return Math.min((value / goal) * 100, 100)
}
</script>

<style scoped>
.macro-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.macro-title {
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.macros {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.macro-item {}

.macro-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 7px;
}

.macro-name {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.macro-value {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
}

.macro-value.mono {
  font-family: 'DM Mono', monospace;
}

.macro-unit {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-left: 1px;
}

.macro-bar-track {
  height: 4px;
  background: var(--bg);
  border-radius: 4px;
  overflow: hidden;
}

.macro-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.macro-goal {
  margin-top: 5px;
  text-align: right;
}
</style>