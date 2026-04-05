<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-left">
        <span class="footer-brand">
          <span class="brand-icon">◎</span>
          Caloriq
        </span>
        <span class="footer-tagline">Track what you eat.</span>
      </div>

      <nav class="footer-nav">
        <RouterLink to="/dashboard" class="footer-link">Dashboard</RouterLink>
        <RouterLink to="/nutrition" class="footer-link">Nutrition</RouterLink>
        <RouterLink to="/history"   class="footer-link">History</RouterLink>
        <RouterLink to="/profile"   class="footer-link">Profile</RouterLink>
      </nav>

      <div class="footer-right">
        <span class="footer-copy">© {{ year }} VitaTrack</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
  background: var(--surface);
  margin-top: auto;
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 24px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
}

/* Left */
.footer-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.brand-icon {
  color: var(--accent);
  font-size: 1rem;
}

.footer-tagline {
  font-size: 0.8125rem;
  color: var(--text-muted);
  padding-left: 10px;
  border-left: 1px solid var(--border);
}

/* Center nav */
.footer-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.footer-link {
  font-size: 0.8125rem;
  color: var(--text-muted);
  text-decoration: none;
  padding: 4px 10px;
  border-radius: var(--radius);
  transition: color var(--transition), background var(--transition);
}

.footer-link:hover {
  color: var(--text-primary);
  background: var(--surface-2);
}

.footer-link.router-link-active {
  color: var(--text-secondary);
}

/* Right */
.footer-right {
  display: flex;
  justify-content: flex-end;
}

.footer-copy {
  font-size: 0.8125rem;
  color: var(--text-muted);
  font-family: 'DM Mono', monospace;
}

@media (max-width: 640px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 16px;
    text-align: center;
  }

  .footer-left    { justify-content: center; }
  .footer-nav     { justify-content: center; flex-wrap: wrap; }
  .footer-right   { justify-content: center; }
  .footer-tagline { display: none; }
}
</style>