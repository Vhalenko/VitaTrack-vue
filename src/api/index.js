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

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const url    = err.config?.url ?? ''

    if (status === 401 && url.includes('/auth/me')) {
      localStorage.removeItem('ct_token')
      localStorage.removeItem('ct_user')
      window.location.href = '/login'
    }

    return Promise.reject(err)
  }
)

export default api

export const authAPI = {
  register: (data) => api.post('/register', data),
  login:    (data) => api.post('/login', data),
  me:       ()     => api.get('/auth/me.php'),
}