<template>
  <div class="top-foods-card">
    <h3 class="card-label">Most logged foods</h3>

    <div v-if="foods.length" class="foods-list">
      <div
        v-for="(food, i) in foods"
        :key="food.name"
        class="food-item"
      >
        <span class="food-rank">{{ i + 1 }}</span>
        <div class="food-info">
          <span class="food-name">{{ food.name }}</span>
          <div class="food-meta">
            <span class="text-xs text-muted">{{ food.times_logged }}× logged</span>
            <span class="dot">·</span>
            <span class="text-xs text-muted">avg {{ food.avg_portion }}g</span>
            <span class="dot">·</span>
            <span class="text-xs mono">{{ food.avg_calories }} kcal</span>
          </div>
        </div>
        <div class="food-macros">
          <span class="macro-tag protein">P {{ food.avg_protein }}g</span>
          <span class="macro-tag carbs">C {{ food.avg_carbs }}g</span>
          <span class="macro-tag fat">F {{ food.avg_fat }}g</span>
        </div>
      </div>
    </div>

    <div v-else class="foods-empty">
      No foods logged yet
    </div>
  </div>
</template>

<script setup>
defineProps({
  foods: { type: Array, default: () => [] },
})
</script>

<style scoped>
.top-foods-card {
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
  margin-bottom: 16px;
}

.foods-list {
  display: flex;
  flex-direction: column;
}

.food-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 0;
  border-bottom: 1px solid var(--border);
}
.food-item:last-child { border-bottom: none; }

.food-rank {
  font-family: 'DM Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  width: 18px;
  text-align: center;
  flex-shrink: 0;
}

.food-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.food-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.food-meta {
  display: flex;
  align-items: center;
  gap: 5px;
}

.dot { color: var(--text-muted); font-size: 0.75rem; }

.food-macros {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.macro-tag {
  font-size: 0.7rem;
  font-family: 'DM Mono', monospace;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.macro-tag.protein { background: #e8f4ee; color: var(--accent); }
.macro-tag.carbs   { background: #fef3e8; color: #e67e22; }
.macro-tag.fat     { background: #fef0ee; color: var(--error); }

.foods-empty {
  text-align: center;
  padding: 24px;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>