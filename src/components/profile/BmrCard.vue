<template>
  <div class="bmr-card" v-if="bmr || tdee">
    <h4 class="bmr-title">Your estimates</h4>
    <div class="bmr-stats">
      <div class="bmr-stat">
        <span class="bmr-value mono">{{ bmr ?? '—' }}</span>
        <span class="bmr-label">BMR</span>
        <span class="bmr-sub">Base metabolic rate</span>
      </div>
      <div class="bmr-divider"></div>
      <div class="bmr-stat">
        <span class="bmr-value mono">{{ tdee ?? '—' }}</span>
        <span class="bmr-label">TDEE</span>
        <span class="bmr-sub">Total daily expenditure</span>
      </div>
    </div>
    <p class="bmr-note">
      Based on Mifflin-St Jeor formula. Use TDEE as your maintenance calorie goal.
    </p>
  </div>
  <div class="bmr-card empty" v-else>
    <p class="text-sm text-muted">
      Fill in your age, weight and height to see your BMR and TDEE estimates.
    </p>
  </div>
</template>

<script setup>
defineProps({
  bmr:  { type: Number, default: null },
  tdee: { type: Number, default: null },
})
</script>

<style scoped>
.bmr-card {
  background: var(--accent-light);
  border: 1px solid #c3e6d3;
  border-radius: var(--radius-lg);
  padding: 20px;
}

.bmr-card.empty {
  background: var(--bg);
  border-color: var(--border);
}

.bmr-title {
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent);
  margin-bottom: 16px;
}

.bmr-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 14px;
}

.bmr-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bmr-value {
  font-family: 'DM Mono', monospace;
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1;
}

.bmr-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent);
}

.bmr-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.bmr-divider {
  width: 1px;
  height: 40px;
  background: #c3e6d3;
}

.bmr-note {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>