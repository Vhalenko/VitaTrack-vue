<template>
  <AuthLayout>
    <div class="form-head">
      <h2>Welcome back</h2>
      <p class="text-secondary text-sm">Sign in to your account</p>
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

    <form class="form" @submit.prevent="handleLogin" novalidate>
      <BaseInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
        :error="errors.email"
      />

      <div class="field">
        <div class="label-row">
          <label for="password">Password</label>
        </div>
        <input
          id="password"
          v-model="form.password"
          :type="showPass ? 'text' : 'password'"
          placeholder="••••••••"
          autocomplete="current-password"
          :class="{ 'input-error': errors.password }"
          @input="errors.password = ''"
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
      </div>

      <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
        <span v-if="loading" class="spinner"></span>
        <span>{{ loading ? 'Signing in…' : 'Sign in' }}</span>
      </button>
    </form>

    <div class="divider">or</div>

    <p class="switch-link text-sm text-secondary">
      Don't have an account?
      <RouterLink to="/register">Create one</RouterLink>
    </p>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import BaseInput from '@/components/shared/BaseInput.vue'

const router = useRouter()
const auth   = useAuthStore()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const globalError = ref('')
const loading = ref(false)
const showPass = ref(false)

function validate() {
  let ok = true
  errors.email    = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required'; ok = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email'; ok = false
  }

  if (!form.password) {
    errors.password = 'Password is required'; ok = false
  }

  return ok
}

async function handleLogin() {
  globalError.value = ''
  if (!validate()) return

  loading.value = true
  try {
    await auth.login(form.email, form.password)
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

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.field {
  position: relative;
  display: flex;
  flex-direction: column;
}

.pass-toggle {
  position: absolute;
  right: 12px;
  top: 36px;
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

/* Spinner */
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