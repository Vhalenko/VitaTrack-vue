<template>
  <div class="activity-selector">
    <button
      v-for="a in levels"
      :key="a.value"
      type="button"
      class="activity-item"
      :class="{ selected: modelValue === a.value }"
      @click="$emit('update:modelValue', a.value)"
    >
      <div class="activity-dot" :style="{ opacity: a.dots / 5 }"></div>
      <div class="activity-info">
        <span class="activity-label">{{ a.label }}</span>
        <span class="activity-desc">{{ a.desc }}</span>
      </div>
      <svg v-if="modelValue === a.value" class="activity-check" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7l3.5 3.5 5.5-5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({ modelValue: { type: String, default: 'moderate' } })
defineEmits(['update:modelValue'])

const levels = [
  { value: 'sedentary',   label: 'Sedentary',      desc: 'Desk job, little exercise',     dots: 1 },
  { value: 'light',       label: 'Lightly active',  desc: '1–3 workouts/week',             dots: 2 },
  { value: 'moderate',    label: 'Moderately active',desc: '3–5 workouts/week',            dots: 3 },
  { value: 'active',      label: 'Very active',     desc: '6–7 workouts/week',             dots: 4 },
  { value: 'very_active', label: 'Athlete',         desc: 'Twice daily / physical job',    dots: 5 },
]
</script>

<style scoped>
.activity-selector {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  text-align: left;
  font-family: 'DM Sans', sans-serif;
  transition: all var(--transition);
}

.activity-item:hover {
  border-color: var(--text-primary);
  background: var(--surface);
}

.activity-item.selected {
  border-color: var(--text-primary);
  background: var(--surface);
}

.activity-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

.activity-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.activity-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.activity-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.activity-check {
  color: var(--accent);
  flex-shrink: 0;
}
</style>