<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <div class="brand">
        <span class="brand-icon">◎</span>
        <span class="brand-name">Caloriq</span>
      </div>

      <div class="nav-center">
        <span class="nav-date">{{ formattedDate }}</span>
        <div class="date-nav">
          <button class="date-btn" @click="changeDate(-1)" title="Previous day">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 11L5 7l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="date-btn today-btn" @click="goToday" :class="{ active: isToday }">
            Today
          </button>
          <button class="date-btn" @click="changeDate(1)" :disabled="isToday" title="Next day">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="nav-right">
        <span class="user-name">{{ auth.user?.name?.split(' ')[0] }}</span>
        <button class="logout-btn" @click="handleLogout">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFoodLogStore } from '@/stores/foodLog'

const auth     = useAuthStore()
const foodLog  = useFoodLogStore()
const router   = useRouter()

const isToday = computed(() => foodLog.activeDate === new Date().toISOString().slice(0, 10))

const formattedDate = computed(() => {
  const d = new Date(foodLog.activeDate + 'T00:00:00')
  if (isToday.value) return 'Today'
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (foodLog.activeDate === yesterday.toISOString().slice(0, 10)) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
})

function changeDate(delta) {
  const d = new Date(foodLog.activeDate + 'T00:00:00')
  d.setDate(d.getDate() + delta)
  const newDate = d.toISOString().slice(0, 10)
  foodLog.fetchLogs(newDate)
}

function goToday() {
  foodLog.fetchLogs(new Date().toISOString().slice(0, 10))
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(8px);
}

.navbar-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.brand-icon {
  font-size: 1.25rem;
  color: var(--accent);
}
.brand-name {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.02em;
}

.nav-center {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-date {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
  min-width: 80px;
  text-align: center;
}

.date-nav {
  display: flex;
  align-items: center;
  gap: 2px;
}

.date-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 8px;
  background: none;
  border: 1px solid transparent;
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-family: 'DM Sans', sans-serif;
  transition: all var(--transition);
}
.date-btn:hover:not(:disabled) {
  background: var(--bg);
  color: var(--text-primary);
  border-color: var(--border);
}
.date-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.today-btn.active { color: var(--accent); font-weight: 500; }

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
}

.user-name {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--text-muted);
  transition: all var(--transition);
}
.logout-btn:hover {
  color: var(--text-primary);
  border-color: var(--text-primary);
}
</style>