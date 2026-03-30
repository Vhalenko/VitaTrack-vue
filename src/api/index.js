// src/api/index.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ct_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ct_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/register', data),
  login:    (data) => api.post('/login', data),
  me:       ()     => api.get('/auth/me.php'),
}