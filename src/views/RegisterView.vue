<template>
  <AuthLayout>
    <div class="form-head">
      <h2>Create account</h2>
      <p class="text-secondary text-sm">Start tracking your nutrition today</p>
    </div>

    <Transition name="fade">
      <div v-if="globalError" class="alert alert-error" role="alert">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;margin-top:1px">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 5v4M8 10.5v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        {{ globalError }}
      </div>
    </Transition>

    <form class="form" @submit.prevent="handleRegister" novalidate>
      <BaseInput
        v-model="form.name"
        label="Full name"
        type="text"
        placeholder="Jane Smith"
        autocomplete="name"
        :error="errors.name"
        @input="errors.name = ''"
      />

      <BaseInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
        :error="errors.email"
        @input="errors.email = ''"
      />

      <div class="field">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          :type="showPass ? 'text' : 'password'"
          placeholder="Minimum 8 characters"
          autocomplete="new-password"
          :class="{ 'input-error': errors.password }"
          @input="onPasswordInput"
        />
        <button type="button" class="pass-toggle" @click="showPass = !showPass" tabindex="-1">
          {{ showPass ? 'Hide' : 'Show' }}
        </button>
        <Transition name="fade">
          <p v-if="errors.password" class="field-error">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5.5" stroke="currentColor"/>
              <path d="M6 4v3M6 8.5v.5" stroke="currentColor" stroke-linecap="round"/>
            </svg>
            {{ errors.password }}
          </p>
        </Transition>
        <!-- Password strength indicator -->
        <div v-if="form.password" class="strength-bar">
          <div
            class="strength-fill"
            :class="strengthClass"
            :style="{ width: strengthPercent + '%' }"
          ></div>
        </div>
        <p v-if="form.password" class="strength-label text-xs" :class="strengthClass">
          {{ strengthLabel }}
        </p>
      </div>

      <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
        <span v-if="loading" class="spinner"></span>
        <span>{{ loading ? 'Creating account…' : 'Create account' }}</span>
      </button>

      <p class="terms text-xs text-muted">
        By creating an account you agree to our
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </p>
    </form>

    <div class="divider">or</div>

    <p class="switch-link text-sm text-secondary">
      Already have an account?
      <RouterLink to="/login">Sign in</RouterLink>
    </p>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import BaseInput from '@/components/shared/BaseInput.vue'

const router = useRouter()
const auth   = useAuthStore()

const form = reactive({ name: '', email: '', password: '' })
const errors = reactive({ name: '', email: '', password: '' })
const globalError = ref('')
const loading  = ref(false)
const showPass = ref(false)

// Password strength
const strengthScore = computed(() => {
  const p = form.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8)  score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const strengthPercent = computed(() => (strengthScore.value / 5) * 100)

const strengthClass = computed(() => {
  const s = strengthScore.value
  if (s <= 1) return 'weak'
  if (s <= 3) return 'fair'
  return 'strong'
})

const strengthLabel = computed(() => {
  const s = strengthScore.value
  if (s <= 1) return 'Weak'
  if (s <= 3) return 'Fair'
  return 'Strong'
})

function onPasswordInput() {
  errors.password = ''
}

function validate() {
  let ok = true
  errors.name = errors.email = errors.password = ''

  if (!form.name || form.name.trim().length < 2) {
    errors.name = 'Enter your full name'; ok = false
  }
  if (!form.email) {
    errors.email = 'Email is required'; ok = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email'; ok = false
  }
  if (!form.password) {
    errors.password = 'Password is required'; ok = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'; ok = false
  }

  return ok
}

async function handleRegister() {
  globalError.value = ''
  if (!validate()) return

  loading.value = true
  try {
    await auth.register(form.name.trim(), form.email, form.password)
    router.push('/dashboard')
  } catch (err) {
    globalError.value = err.response?.data?.error || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-head {
  margin-bottom: 28px;
}
.form-head h2 {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 24px;
}

.field {
  position: relative;
  display: flex;
  flex-direction: column;
}

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
  transition: color var(--transition);
  padding: 4px;
}
.pass-toggle:hover { color: var(--text-primary); }

.input-error { border-color: var(--error) !important; }

/* Strength bar */
.strength-bar {
  height: 2px;
  background: var(--border);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}
.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 300ms ease, background 300ms ease;
}
.strength-fill.weak   { background: var(--error); }
.strength-fill.fair   { background: #e67e22; }
.strength-fill.strong { background: var(--accent); }
.strength-label {
  margin-top: 4px;
}
.strength-label.weak   { color: var(--error); }
.strength-label.fair   { color: #e67e22; }
.strength-label.strong { color: var(--accent); }

.terms { margin-top: -4px; }
.terms a {
  color: var(--text-secondary);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.terms a:hover { color: var(--text-primary); }

.divider { margin: 20px 0; }

.switch-link {
  text-align: center;
}
.switch-link a {
  color: var(--text-primary);
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid var(--border);
  transition: border-color var(--transition);
}
.switch-link a:hover { border-color: var(--text-primary); }

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.alert { margin-bottom: 20px; }
</style>