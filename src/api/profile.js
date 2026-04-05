import api from './index.js'

export const profileAPI = {
  get:            ()     => api.get('/profile'),
  update:         (data) => api.put('/profile', data),
  updatePassword: (data) => api.put('/profile/password', data),
}