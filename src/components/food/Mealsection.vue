<template>
  <div class="meal-section">
    <div class="meal-header" @click="collapsed = !collapsed">
      <div class="meal-left">
        <span class="meal-icon">{{ icon }}</span>
        <span class="meal-name">{{ label }}</span>
        <span class="meal-count" v-if="items.length">{{ items.length }}</span>
      </div>
      <div class="meal-right">
        <span class="meal-cals mono" v-if="totalCalories > 0">{{ Math.round(totalCalories) }} kcal</span>
        <svg class="chevron" :class="{ open: !collapsed }" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 5l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <Transition name="slide">
      <div v-if="!collapsed" class="meal-body">
        <div v-if="items.length === 0" class="meal-empty">
          Nothing logged yet
        </div>
        <div
          v-for="item in items"
          :key="item.id"
          class="food-row"
        >
          <div class="food-info">
            <span class="food-name">{{ item.name }}</span>
            <span class="food-portion text-xs text-muted">{{ item.portion_grams }}g</span>
          </div>
          <div class="food-meta">
            <span class="food-cals mono">{{ Math.round(item.total_calories) }}</span>
            <span class="food-unit text-muted">kcal</span>
            <button class="delete-btn" @click="$emit('delete', item.id)" title="Remove">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  meal:  { type: String, required: true },
  items: { type: Array,  default: () => [] },
})

defineEmits(['delete'])

const collapsed = ref(false)

const labels = {
  breakfast: 'Breakfast',
  lunch:     'Lunch',
  dinner:    'Dinner',
  snack:     'Snack',
}

const icons = {
  breakfast: '☀️',
  lunch:     '🥗',
  dinner:    '🍽️',
  snack:     '🍎',
}

const label = computed(() => labels[props.meal] || props.meal)
const icon  = computed(() => icons[props.meal]  || '🍴')

const totalCalories = computed(() =>
  props.items.reduce((sum, i) => sum + parseFloat(i.total_calories || 0), 0)
)
</script>

<style scoped>
.meal-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  cursor: pointer;
  user-select: none;
  transition: background var(--transition);
}
.meal-header:hover { background: var(--bg); }

.meal-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meal-icon { font-size: 1rem; line-height: 1; }

.meal-name {
  font-size: 0.9375rem;
  font-weight: 500;
}

.meal-count {
  background: var(--bg);
  color: var(--text-muted);
  font-size: 0.75rem;
  padding: 1px 7px;
  border-radius: 20px;
  border: 1px solid var(--border);
}

.meal-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meal-cals {
  font-family: 'DM Mono', monospace;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.chevron {
  color: var(--text-muted);
  transition: transform var(--transition);
}
.chevron.open { transform: rotate(180deg); }

.meal-body {
  border-top: 1px solid var(--border);
}

.meal-empty {
  padding: 14px 18px;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
}

.food-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px;
  border-bottom: 1px solid var(--border);
  transition: background var(--transition);
}
.food-row:last-child { border-bottom: none; }
.food-row:hover { background: var(--bg); }

.food-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.food-name {
  font-size: 0.9375rem;
  color: var(--text-primary);
}

.food-meta {
  display: flex;
  align-items: center;
  gap: 4px;
}

.food-cals {
  font-family: 'DM Mono', monospace;
  font-size: 0.875rem;
  font-weight: 500;
}

.food-unit {
  font-size: 0.75rem;
  margin-right: 8px;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity var(--transition), color var(--transition);
}
.food-row:hover .delete-btn { opacity: 1; }
.delete-btn:hover { color: var(--error); }

.slide-enter-active,
.slide-leave-active {
  transition: max-height 250ms ease, opacity 250ms ease;
  overflow: hidden;
  max-height: 600px;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>