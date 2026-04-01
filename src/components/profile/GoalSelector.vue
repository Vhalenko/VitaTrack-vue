<template>
  <div class="goal-selector">
    <button
      v-for="g in goals"
      :key="g.value"
      type="button"
      class="goal-card"
      :class="{ selected: modelValue === g.value }"
      @click="$emit('update:modelValue', g.value)"
    >
      <span class="goal-icon">{{ g.icon }}</span>
      <span class="goal-label">{{ g.label }}</span>
      <span class="goal-desc">{{ g.desc }}</span>
      <span class="goal-check" v-if="modelValue === g.value">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </button>
  </div>
</template>

<script setup>
defineProps({ modelValue: { type: String, default: 'maintain' } })
defineEmits(['update:modelValue'])

const goals = [
  { value: 'lose_weight',  icon: '↓', label: 'Lose weight',  desc: 'Calorie deficit' },
  { value: 'maintain',     icon: '→', label: 'Maintain',     desc: 'Balanced intake' },
  { value: 'gain_muscle',  icon: '↑', label: 'Gain muscle',  desc: 'Calorie surplus' },
]
</script>

<style scoped>
.goal-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.goal-card {
  position: relative;
  padding: 16px 12px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all var(--transition);
  font-family: 'DM Sans', sans-serif;
}

.goal-card:hover {
  border-color: var(--text-primary);
  background: var(--surface);
}

.goal-card.selected {
  border-color: var(--text-primary);
  background: var(--surface);
  box-shadow: inset 0 0 0 1px var(--text-primary);
}

.goal-icon {
  font-size: 1.25rem;
  font-weight: 300;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 2px;
}

.goal-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.goal-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.goal-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  background: var(--text-primary);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>