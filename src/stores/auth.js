// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(null)
  const token = ref(localStorage.getItem('ct_token') || null)

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  function setSession(data) {
    token.value = data.token
    user.value  = data.user
    localStorage.setItem('ct_token', data.token)
  }

  function clearSession() {
    token.value = null
    user.value  = null
    localStorage.removeItem('ct_token')
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await authAPI.me()
      user.value = res.data.user
    } catch {
      clearSession()
    }
  }

  async function login(email, password) {
    const res = await authAPI.login({ email, password })
    setSession(res.data)
    return res.data
  }

  async function register(name, email, password) {
    const res = await authAPI.register({ name, email, password })
    setSession(res.data)
    return res.data
  }

  function logout() {
    clearSession()
  }

  return { user, token, isLoggedIn, login, register, logout, fetchMe }
})