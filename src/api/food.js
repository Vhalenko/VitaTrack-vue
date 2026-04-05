import api from './index.js'

export const foodAPI = {
  search:     (q)      => api.get(`/foods/search?q=${encodeURIComponent(q)}`),
  getLogs:    (date)   => api.get(`/food-logs?date=${date}`),
  addLog:     (data)   => api.post('/food-logs', data),
  deleteLog:  (id)     => api.delete(`/food-logs?id=${id}`),
  getWeekly:  ()       => api.get('/food-logs/weekly'),
}