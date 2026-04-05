<template>
  <!-- Desktop navbar -->
  <nav class="navbar">
    <div class="navbar-inner">

      <!-- LEFT: brand + nav links -->
      <div class="nav-left">
        <div class="brand">
          <span class="brand-icon">◎</span>
          <span class="brand-name">VitaTrack</span>
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
          <button v-if="!isToday" class="today-chip" @click="goToday">Today</button>
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

  <!-- Mobile topbar -->
  <div class="mobile-topbar">
    <div class="mobile-brand">
      <span class="brand-icon">◎</span>
      <span class="brand-name">VitaTrack</span>
    </div>

    <!-- Mobile date controls -->
    <div class="mobile-date">
      <button class="arrow-btn" @click="changeDate(-1)">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span class="date-label">{{ formattedDate }}</span>
      <button class="arrow-btn" @click="changeDate(1)" :disabled="isToday">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Hamburger -->
    <button class="hamburger" @click="sidebarOpen = true" aria-label="Open menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>

  <!-- Sidebar overlay -->
  <Transition name="overlay">
    <div
      v-if="sidebarOpen"
      class="sidebar-overlay"
      @click="sidebarOpen = false"
    ></div>
  </Transition>

  <!-- Sidebar drawer -->
  <Transition name="sidebar">
    <aside v-if="sidebarOpen" class="sidebar">
      <div class="sidebar-head">
        <div class="sidebar-brand">
          <span class="brand-icon">◎</span>
          <span class="brand-name">Caloriq</span>
        </div>
        <button class="close-btn" @click="sidebarOpen = false" aria-label="Close menu">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- User info -->
      <div class="sidebar-user">
        <div class="sidebar-avatar">{{ initials }}</div>
        <div>
          <p class="sidebar-username">{{ auth.user?.name }}</p>
          <p class="sidebar-email">{{ auth.user?.email }}</p>
        </div>
      </div>

      <!-- Nav links -->
      <nav class="sidebar-nav">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="sidebar-link"
          :class="{ active: $route.name === link.name }"
          @click="sidebarOpen = false"
        >
          <span class="sidebar-link-icon" v-html="link.icon"></span>
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <button class="sidebar-logout" @click="handleLogout">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFoodLogStore } from '@/stores/foodLog'

const auth    = useAuthStore()
const foodLog = useFoodLogStore()
const router  = useRouter()

const sidebarOpen = ref(false)

const navLinks = [
  {
    to: '/dashboard', name: 'Dashboard', label: 'Dashboard',
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg>`
  },
  {
    to: '/nutrition', name: 'Nutrition', label: 'Nutrition',
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 4v4l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
  },
  {
    to: '/history', name: 'History', label: 'History',
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
  },
  {
    to: '/profile', name: 'Profile', label: 'Profile',
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M2 14c0-3 2.686-5 6-5s6 2 6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
  },
]

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
  sidebarOpen.value = false
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
/* DESKTOP NAVBAR*/
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
.brand-icon { font-size: 1.1rem; color: var(--accent); line-height: 1; }
.brand-name { font-size: 0.9375rem; font-weight: 500; letter-spacing: -0.02em; }

.nav-divider {
  width: 1px; height: 18px;
  background: var(--border);
  flex-shrink: 0;
}

.nav-links { display: flex; align-items: center; gap: 2px; }

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
.nav-link:hover { color: var(--text-primary); background: var(--bg); }
.nav-link.active { color: var(--text-primary); font-weight: 500; background: var(--bg); }
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 50%;
  transform: translateX(-50%);
  width: 16px; height: 2px;
  background: var(--accent);
  border-radius: 2px 2px 0 0;
}

.nav-center { display: flex; align-items: center; gap: 6px; }

.arrow-btn {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--transition);
  flex-shrink: 0;
}
.arrow-btn:hover:not(:disabled) { border-color: var(--text-primary); color: var(--text-primary); }
.arrow-btn:disabled { opacity: 0.25; cursor: not-allowed; }

.date-display {
  display: flex; align-items: center; gap: 7px;
  min-width: 120px; justify-content: center;
}
.date-label { font-size: 0.9rem; font-weight: 500; color: var(--text-primary); white-space: nowrap; }

.today-chip {
  padding: 2px 8px;
  font-size: 0.75rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  color: var(--accent);
  background: var(--accent-light);
  border: 1px solid #1f4a30;
  border-radius: 20px;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}
.today-chip:hover { opacity: 0.8; }

.nav-right { display: flex; align-items: center; gap: 8px; justify-content: flex-end; }

.profile-link {
  display: flex; align-items: center; gap: 7px;
  text-decoration: none;
  padding: 4px 10px 4px 4px;
  border-radius: 20px;
  border: 1px solid var(--border);
  transition: all var(--transition);
}
.profile-link:hover,
.profile-link.active { border-color: var(--text-primary); background: var(--bg); }

.avatar {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--bg);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.04em;
  flex-shrink: 0;
}
.user-name { font-size: 0.875rem; color: var(--text-secondary); }

.logout-btn {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--text-muted);
  transition: all var(--transition);
}
.logout-btn:hover { color: var(--text-primary); border-color: var(--text-primary); }

/* MOBILE TOPBAR */
.mobile-topbar { display: none; }

/* SIDEBAR */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 200;
}

.sidebar {
  position: fixed;
  top: 0; left: 0;
  width: 280px;
  height: 100dvh;
  background: var(--surface);
  border-right: 1px solid var(--border);
  z-index: 201;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
}

.sidebar-brand {
  display: flex; align-items: center; gap: 8px;
}

.close-btn {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--text-muted);
  transition: all var(--transition);
}
.close-btn:hover { color: var(--text-primary); border-color: var(--text-primary); }

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid var(--border);
}

.sidebar-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--bg);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8125rem; font-weight: 600;
  flex-shrink: 0;
}

.sidebar-username {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
}

.sidebar-email {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-top: 1px;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: var(--radius);
  text-decoration: none;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  transition: all var(--transition);
}
.sidebar-link:hover { background: var(--surface-2); color: var(--text-primary); }
.sidebar-link.active {
  background: var(--accent-light);
  color: var(--accent);
  font-weight: 500;
}

.sidebar-link-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  opacity: 0.7;
}
.sidebar-link.active .sidebar-link-icon { opacity: 1; }

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border);
}

.sidebar-logout {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9375rem;
  color: var(--text-muted);
  transition: all var(--transition);
}
.sidebar-logout:hover {
  color: var(--error);
  border-color: var(--error);
}

/* SIDEBAR TRANSITIONS */
.sidebar-enter-active,
.sidebar-leave-active { transition: transform 260ms cubic-bezier(0.4, 0, 0.2, 1); }
.sidebar-enter-from,
.sidebar-leave-to     { transform: translateX(-100%); }

.overlay-enter-active,
.overlay-leave-active { transition: opacity 260ms ease; }
.overlay-enter-from,
.overlay-leave-to     { opacity: 0; }

/* RESPONSIVE */
@media (max-width: 768px) {
  /* Hide desktop navbar */
  .navbar { display: none; }

  /* Show mobile topbar */
  .mobile-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    height: 52px;
    padding: 0 16px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    gap: 12px;
  }

  .mobile-brand {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .mobile-date {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    justify-content: center;
  }

  .hamburger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4.5px;
    width: 36px;
    height: 36px;
    background: none;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    padding: 0 9px;
    flex-shrink: 0;
    transition: border-color var(--transition);
  }
  .hamburger:hover { border-color: var(--text-primary); }
  .hamburger span {
    display: block;
    height: 1.5px;
    background: var(--text-secondary);
    border-radius: 2px;
    transition: background var(--transition);
  }
  .hamburger:hover span { background: var(--text-primary); }
}
</style>