// src/stores/profile.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { profileAPI } from '@/api/profile'
import { useAuthStore } from '@/stores/auth'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(null)
  const bmr     = ref(null)
  const tdee    = ref(null)
  const loading = ref(false)

  async function fetchProfile() {
    loading.value = true
    try {
      const res     = await profileAPI.get()
      profile.value = res.data.user
      bmr.value     = res.data.bmr
      tdee.value    = res.data.tdee

      // Sync auth store user too
      const auth = useAuthStore()
      if (auth.user) {
        auth.user = { ...auth.user, ...res.data.user }
      }
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data) {
    const res     = await profileAPI.update(data)
    profile.value = res.data.user
    bmr.value     = res.data.bmr
    tdee.value    = res.data.tdee

    // Sync auth store
    const auth = useAuthStore()
    if (auth.user) {
      auth.user = { ...auth.user, ...res.data.user }
    }

    return res.data
  }

  async function updatePassword(currentPassword, newPassword) {
    const res = await profileAPI.updatePassword({
      current_password: currentPassword,
      new_password:     newPassword,
    })
    return res.data
  }

  return { profile, bmr, tdee, loading, fetchProfile, updateProfile, updatePassword }
})