import api from './index.js'

export const historyAPI = {
  getMonthly:  (month)      => api.get(`/history/monthly?month=${month}`),
  getDayDetail:(date)       => api.get(`/history/day?date=${date}`),
  getTrend:    (days = 30)  => api.get(`/history/trend?days=${days}`),
  getStats:    ()           => api.get('/history/stats'),
  getWeight:   (days = 90)  => api.get(`/weight?days=${days}`),
  addWeight:   (data)       => api.post('/weight', data),
  deleteWeight:(id)         => api.delete(`/weight?id=${id}`),
}