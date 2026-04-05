<template>
  <div class="auth-shell">
    <div class="auth-left">
      <div class="brand">
        <span class="brand-icon">◎</span>
        <span class="brand-name">VitaTrack</span>
      </div>
      <div class="tagline">
        <h1>Track what<br>you eat.</h1>
        <p>Simple, focused nutrition tracking to help you reach your goals.</p>
      </div>
      <div class="stats">
        <div class="stat">
          <span class="stat-number">2,400</span>
          <span class="stat-label">avg. kcal tracked / day</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-number">12 wks</span>
          <span class="stat-label">average goal timeline</span>
        </div>
      </div>
    </div>

    <div class="auth-right">
      <div class="auth-card">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

/* Left panel */
.auth-left {
  background: var(--surface);
  color: var(--text-primary);
  padding: 48px 56px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  font-size: 1.5rem;
  line-height: 1;
  opacity: 0.7;
}

.brand-name {
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

.tagline h1 {
  font-size: clamp(2rem, 3vw, 2.75rem);
  font-weight: 300;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.tagline p {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  max-width: 300px;
  line-height: 1.6;
}

.stats {
  display: flex;
  align-items: center;
  gap: 32px;
}

.stat-number {
  display: block;
  font-family: 'DM Mono', monospace;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--border);
}

/* Right panel */
.auth-right {
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
}

.auth-card {
  width: 100%;
  max-width: 380px;
}

/* Responsive */
@media (max-width: 768px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }
  .auth-left {
    padding: 32px 24px 40px;
    min-height: 220px;
  }
  .tagline h1 {
    font-size: 2rem;
  }
  .stats {
    gap: 20px;
  }
  .auth-right {
    padding: 40px 24px;
    align-items: flex-start;
  }
}
</style>