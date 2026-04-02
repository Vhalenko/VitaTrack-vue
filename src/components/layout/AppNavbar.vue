<template>
  <nav class="navbar">
    <div class="navbar-inner">

      <!-- LEFT: brand + nav links -->
      <div class="nav-left">
        <div class="brand">
          <span class="brand-icon">◎</span>
          <span class="brand-name">Caloriq</span>
        </div>
        <div class="nav-divider"></div>
        <div class="nav-links">
          <RouterLink to="/dashboard" class="nav-link" :class="{ active: $route.name === 'Dashboard' }">Dashboard</RouterLink>
          <RouterLink to="/nutrition" class="nav-link" :class="{ active: $route.name === 'Nutrition' }">Nutrition</RouterLink>
          <RouterLink to="/history"   class="nav-link" :class="{ active: $route.name === 'History'   }">History</RouterLink>
        </div>
      </div>

      <!-- CENTER: date navigation -->
      <div class="nav-center">
        <button class="arrow-btn" @click="changeDate(-1)" title="Previous day">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="date-display">
          <span class="date-label">{{ formattedDate }}</span>
        </div>
        <button class="arrow-btn" @click="changeDate(1)" :disabled="isToday" title="Next day">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- RIGHT: profile + logout -->
      <div class="nav-right">
        <RouterLink to="/profile" class="profile-link" :class="{ active: $route.name === 'Profile' }">
          <div class="avatar">{{ initials }}</div>
          <span class="user-name">{{ auth.user?.name?.split(' ')[0] }}</span>
        </RouterLink>
        <button class="logout-btn" @click="handleLogout" title="Sign out">
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

const auth    = useAuthStore()
const foodLog = useFoodLogStore()
const router  = useRouter()

function toLocalDateString(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const isToday = computed(() => foodLog.activeDate === toLocalDateString(new Date()))

const formattedDate = computed(() => {
  const d = new Date(foodLog.activeDate + 'T00:00:00')
  if (isToday.value) return 'Today'
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (foodLog.activeDate === toLocalDateString(yesterday)) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
})

const initials = computed(() => {
  const name = auth.user?.name ?? ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

function changeDate(delta) {
  const d = new Date(foodLog.activeDate + 'T00:00:00')
  d.setDate(d.getDate() + delta)
  foodLog.fetchLogs(toLocalDateString(d))
}

function goToday() {
  foodLog.fetchLogs(toLocalDateString(new Date()))
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
}

.navbar-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
}

/* LEFT */
.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
}
.brand-icon {
  font-size: 1.1rem;
  color: var(--accent);
  line-height: 1;
}
.brand-name {
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: -0.02em;
}

.nav-divider {
  width: 1px;
  height: 18px;
  background: var(--border);
  flex-shrink: 0;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav-link {
  position: relative;
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--text-muted);
  text-decoration: none;
  padding: 5px 10px;
  border-radius: var(--radius);
  transition: all var(--transition);
}
.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg);
}
.nav-link.active {
  color: var(--text-primary);
  font-weight: 500;
  background: var(--bg);
}
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 2px;
  background: var(--accent);
  border-radius: 2px 2px 0 0;
}

/* CENTER */
.nav-center {
  display: flex;
  align-items: center;
  gap: 6px;
}

.arrow-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--transition);
  flex-shrink: 0;
}
.arrow-btn:hover:not(:disabled) {
  border-color: var(--text-primary);
  color: var(--text-primary);
}
.arrow-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 120px;
  justify-content: center;
}

.date-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

.today-chip {
  padding: 2px 8px;
  font-size: 0.75rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  color: var(--accent);
  background: var(--accent-light);
  border: 1px solid #c3e6d3;
  border-radius: 20px;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}
.today-chip:hover {
  background: #d4eddf;
}

/* RIGHT */
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 7px;
  text-decoration: none;
  padding: 4px 10px 4px 4px;
  border-radius: 20px;
  border: 1px solid var(--border);
  transition: all var(--transition);
}
.profile-link:hover,
.profile-link.active {
  border-color: var(--text-primary);
  background: var(--bg);
}

.avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--text-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  flex-shrink: 0;
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

@media (max-width: 768px) {
  .navbar-inner { grid-template-columns: auto 1fr auto; padding: 0 16px; }
  .brand-name   { display: none; }
  .nav-divider  { display: none; }
  .nav-link     { padding: 5px 7px; font-size: 0.8125rem; }
  .user-name    { display: none; }
  .profile-link { padding: 4px; border-radius: 50%; }
}
</style>