<template>
  <div class="profile-page">
    <AppNavbar />

    <main class="main">
      <div class="container">

        <!-- Page header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Profile & Goals</h1>
            <p class="text-secondary text-sm">Manage your personal info and calorie targets</p>
          </div>
          <RouterLink to="/dashboard" class="btn btn-ghost">
            ← Dashboard
          </RouterLink>
        </div>

        <div v-if="profileStore.loading && !profileStore.profile" class="loading-state">
          <div class="skeleton" style="height:200px"></div>
          <div class="skeleton" style="height:300px"></div>
        </div>

        <div v-else class="profile-grid">

          <!-- LEFT COLUMN -->
          <div class="col-left">

            <!-- Personal Info -->
            <section class="card">
              <div class="card-head">
                <h2 class="card-title">Personal info</h2>
              </div>

              <Transition name="fade">
                <div v-if="infoSuccess" class="alert alert-success mb">{{ infoSuccess }}</div>
              </Transition>
              <Transition name="fade">
                <div v-if="infoError" class="alert alert-error mb">{{ infoError }}</div>
              </Transition>

              <form class="form" @submit.prevent="saveInfo" novalidate>
                <BaseInput
                  v-model="infoForm.name"
                  label="Full name"
                  placeholder="Jane Smith"
                  :error="infoErrors.name"
                  @input="infoErrors.name = ''"
                />

                <div class="form-row">
                  <div class="field">
                    <label for="age">Age</label>
                    <input id="age" v-model.number="infoForm.age" type="number" min="10" max="120" placeholder="25" />
                  </div>
                  <div class="field">
                    <label for="weight">Weight (kg)</label>
                    <input id="weight" v-model.number="infoForm.weight" type="number" min="20" max="500" step="0.1" placeholder="70" />
                  </div>
                  <div class="field">
                    <label for="height">Height (cm)</label>
                    <input id="height" v-model.number="infoForm.height" type="number" min="50" max="300" placeholder="175" />
                  </div>
                </div>

                <!-- BMR display -->
                <BmrCard :bmr="profileStore.bmr" :tdee="profileStore.tdee" />

                <div class="form-actions">
                  <button type="submit" class="btn btn-primary" :disabled="infoSaving">
                    <span v-if="infoSaving" class="spinner"></span>
                    {{ infoSaving ? 'Saving…' : 'Save changes' }}
                  </button>
                </div>
              </form>
            </section>

            <!-- Change Password -->
            <section class="card">
              <div class="card-head">
                <h2 class="card-title">Change password</h2>
              </div>

              <Transition name="fade">
                <div v-if="passSuccess" class="alert alert-success mb">{{ passSuccess }}</div>
              </Transition>
              <Transition name="fade">
                <div v-if="passError" class="alert alert-error mb">{{ passError }}</div>
              </Transition>

              <form class="form" @submit.prevent="savePassword" novalidate>
                <div class="field">
                  <label for="current-pass">Current password</label>
                  <input
                    id="current-pass"
                    v-model="passForm.current"
                    :type="showCurrentPass ? 'text' : 'password'"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    :class="{ 'input-error': passErrors.current }"
                  />
                  <button type="button" class="pass-toggle" @click="showCurrentPass = !showCurrentPass">
                    {{ showCurrentPass ? 'Hide' : 'Show' }}
                  </button>
                  <p v-if="passErrors.current" class="field-error">{{ passErrors.current }}</p>
                </div>

                <div class="field">
                  <label for="new-pass">New password</label>
                  <input
                    id="new-pass"
                    v-model="passForm.newPass"
                    :type="showNewPass ? 'text' : 'password'"
                    placeholder="Minimum 8 characters"
                    autocomplete="new-password"
                    :class="{ 'input-error': passErrors.newPass }"
                  />
                  <button type="button" class="pass-toggle" @click="showNewPass = !showNewPass">
                    {{ showNewPass ? 'Hide' : 'Show' }}
                  </button>
                  <p v-if="passErrors.newPass" class="field-error">{{ passErrors.newPass }}</p>
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn btn-primary" :disabled="passSaving">
                    <span v-if="passSaving" class="spinner"></span>
                    {{ passSaving ? 'Updating…' : 'Update password' }}
                  </button>
                </div>
              </form>
            </section>
          </div>

          <!-- RIGHT COLUMN -->
          <div class="col-right">

            <!-- Goals -->
            <section class="card">
              <div class="card-head">
                <h2 class="card-title">Fitness goal</h2>
              </div>

              <Transition name="fade">
                <div v-if="goalsSuccess" class="alert alert-success mb">{{ goalsSuccess }}</div>
              </Transition>
              <Transition name="fade">
                <div v-if="goalsError" class="alert alert-error mb">{{ goalsError }}</div>
              </Transition>

              <form class="form" @submit.prevent="saveGoals" novalidate>
                <div class="field">
                  <label>What's your goal?</label>
                  <GoalSelector v-model="goalsForm.fitness_goal" />
                </div>

                <div class="field">
                  <label>Activity level</label>
                  <ActivitySelector v-model="goalsForm.activity_level" />
                </div>

                <div class="field calorie-goal-field">
                  <label for="calorie-goal">Daily calorie goal</label>
                  <div class="calorie-input-wrap">
                    <input
                      id="calorie-goal"
                      v-model.number="goalsForm.daily_calorie_goal"
                      type="number"
                      min="500"
                      max="10000"
                      step="50"
                      placeholder="2000"
                    />
                    <span class="calorie-unit">kcal / day</span>
                  </div>
                  <div class="calorie-suggestions" v-if="profileStore.tdee">
                    <span class="text-xs text-muted">Suggestions based on your TDEE ({{ profileStore.tdee }} kcal):</span>
                    <div class="suggestion-chips">
                      <button
                        v-for="s in calorieSuggestions"
                        :key="s.label"
                        type="button"
                        class="chip"
                        @click="goalsForm.daily_calorie_goal = s.value"
                      >
                        {{ s.label }} · {{ s.value }}
                      </button>
                    </div>
                  </div>
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn btn-primary" :disabled="goalsSaving">
                    <span v-if="goalsSaving" class="spinner"></span>
                    {{ goalsSaving ? 'Saving…' : 'Save goals' }}
                  </button>
                </div>
              </form>
            </section>

            <!-- Account info card -->
            <section class="card account-card">
              <div class="account-row">
                <div class="avatar">{{ initials }}</div>
                <div>
                  <p class="account-name">{{ profileStore.profile?.name }}</p>
                  <p class="text-sm text-muted">{{ profileStore.profile?.email }}</p>
                  <p class="text-xs text-muted" style="margin-top:4px">
                    Member since {{ memberSince }}
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useHistoryStore } from '@/stores/history'
import AppNavbar        from '@/components/layout/AppNavbar.vue'
import BaseInput        from '@/components//shared/BaseInput.vue'
import GoalSelector     from '@/components/profile/GoalSelector.vue'
import ActivitySelector from '@/components/profile/ActivitySelector.vue'
import BmrCard          from '@/components/profile/BmrCard.vue'

const profileStore = useProfileStore()
const historyStore = useHistoryStore()

// ── Personal info form ─────────────────────────────
const infoForm   = reactive({ name: '', age: '', weight: '', height: '' })
const infoErrors = reactive({ name: '' })
const infoSaving = ref(false)
const infoSuccess = ref('')
const infoError   = ref('')

// ── Password form ──────────────────────────────────
const passForm = reactive({ current: '', newPass: '' })
const passErrors = reactive({ current: '', newPass: '' })
const passSaving = ref(false)
const passSuccess = ref('')
const passError   = ref('')
const showCurrentPass = ref(false)
const showNewPass     = ref(false)

// ── Goals form ─────────────────────────────────────
const goalsForm = reactive({
  fitness_goal:       'maintain',
  activity_level:     'moderate',
  daily_calorie_goal: 2000,
})
const goalsSaving = ref(false)
const goalsSuccess = ref('')
const goalsError   = ref('')

// ── Computed ───────────────────────────────────────
const initials = computed(() => {
  const name = profileStore.profile?.name ?? ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const memberSince = computed(() => {
  const d = profileStore.profile?.created_at
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calorieSuggestions = computed(() => {
  const tdee = profileStore.tdee
  if (!tdee) return []
  return [
    { label: 'Lose weight',  value: Math.round((tdee - 500) / 50) * 50 },
    { label: 'Maintain',     value: Math.round(tdee / 50) * 50 },
    { label: 'Gain muscle',  value: Math.round((tdee + 300) / 50) * 50 },
  ]
})

// ── Populate forms when profile loads ─────────────
watch(() => profileStore.profile, (p) => {
  if (!p) return
  infoForm.name   = p.name   ?? ''
  infoForm.age    = p.age    ?? ''
  infoForm.weight = p.weight ?? ''
  infoForm.height = p.height ?? ''
  goalsForm.fitness_goal       = p.fitness_goal       ?? 'maintain'
  goalsForm.activity_level     = p.activity_level     ?? 'moderate'
  goalsForm.daily_calorie_goal = p.daily_calorie_goal ?? 2000
}, { immediate: true })

onMounted(() => profileStore.fetchProfile())

// ── Handlers ───────────────────────────────────────
function flashSuccess(ref, msg) {
  ref.value = msg
  setTimeout(() => { ref.value = '' }, 3000)
}

async function saveInfo() {
  infoError.value   = ''
  infoSuccess.value = ''
  infoErrors.name   = ''

  if (!infoForm.name || infoForm.name.trim().length < 2) {
    infoErrors.name = 'Name must be at least 2 characters'
    return
  }

  infoSaving.value = true
  try {
    const prevWeight = profileStore.profile?.weight
    await profileStore.updateProfile({
      name:   infoForm.name.trim(),
      age:    infoForm.age    || null,
      weight: infoForm.weight || null,
      height: infoForm.height || null,
    })

    // If weight changed, also save it as a weight log entry
    if (infoForm.weight && +infoForm.weight !== +prevWeight) {
      const today = new Date()
      const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
      await historyStore.addWeight(infoForm.weight, dateStr)
    }

    flashSuccess(infoSuccess, 'Profile updated successfully')
  } catch (err) {
    infoError.value = err.response?.data?.error ?? 'Failed to save. Please try again.'
  } finally {
    infoSaving.value = false
  }
}

async function savePassword() {
  passError.value   = ''
  passSuccess.value = ''
  passErrors.current  = ''
  passErrors.newPass  = ''

  if (!passForm.current) { passErrors.current = 'Required'; return }
  if (!passForm.newPass || passForm.newPass.length < 8) {
    passErrors.newPass = 'Minimum 8 characters'
    return
  }

  passSaving.value = true
  try {
    await profileStore.updatePassword(passForm.current, passForm.newPass)
    flashSuccess(passSuccess, 'Password updated')
    passForm.current = ''
    passForm.newPass = ''
  } catch (err) {
    passError.value = err.response?.data?.error ?? 'Failed to update password.'
  } finally {
    passSaving.value = false
  }
}

async function saveGoals() {
  goalsError.value   = ''
  goalsSuccess.value = ''
  goalsSaving.value  = true
  try {
    await profileStore.updateProfile({
      fitness_goal:       goalsForm.fitness_goal,
      activity_level:     goalsForm.activity_level,
      daily_calorie_goal: goalsForm.daily_calorie_goal,
    })
    flashSuccess(goalsSuccess, 'Goals saved successfully')
  } catch (err) {
    goalsError.value = err.response?.data?.error ?? 'Failed to save goals.'
  } finally {
    goalsSaving.value = false
  }
}
</script>

<style scoped>
.profile-page { min-height: 100vh; background: var(--bg); }

.main { padding: 32px 24px 64px; }

.container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

/* Grid */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

.col-left, .col-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Cards */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.card-head { margin-bottom: 20px; }

.card-title {
  font-size: 0.9375rem;
  font-weight: 500;
}

/* Form */
.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.field { display: flex; flex-direction: column; gap: 0; }

.form-actions { display: flex; justify-content: flex-end; }

.mb { margin-bottom: 4px; }

/* Calorie goal field */
.calorie-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.calorie-unit {
  position: absolute;
  right: 14px;
  font-size: 0.8125rem;
  color: var(--text-muted);
  pointer-events: none;
}

.calorie-input-wrap input {
  padding-right: 90px;
}

.calorie-suggestions { margin-top: 10px; }

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.chip {
  padding: 4px 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  font-size: 0.75rem;
  font-family: 'DM Sans', sans-serif;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition);
}
.chip:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

/* Password field */
.field { position: relative; }

.pass-toggle {
  position: absolute;
  right: 12px;
  top: 30px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8125rem;
  font-family: 'DM Sans', sans-serif;
  color: var(--text-muted);
  padding: 4px;
  transition: color var(--transition);
}
.pass-toggle:hover { color: var(--text-primary); }

.input-error { border-color: var(--error) !important; }

/* Account card */
.account-card { padding: 20px 24px; }

.account-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--text-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.account-name {
  font-weight: 500;
  font-size: 0.9375rem;
}

/* Loading skeleton */
.loading-state { display: flex; flex-direction: column; gap: 16px; }

.skeleton {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Spinner */
.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 720px) {
  .profile-grid { grid-template-columns: 1fr; }
  .form-row     { grid-template-columns: 1fr 1fr; }
  .page-header  { flex-direction: column; gap: 12px; }
}

@media (max-width: 480px) {
  .form-row { grid-template-columns: 1fr; }
  .main     { padding: 20px 16px 48px; }
}
</style>