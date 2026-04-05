import api from './index.js'

export const nutritionAPI = {
  getDay:        (date)      => api.get(`/nutrition/day?date=${date}`),
  getAverages:   (days = 7)  => api.get(`/nutrition/averages?days=${days}`),
  getTopFoods:   ()          => api.get('/nutrition/top-foods'),
  getMacroTrend: (days = 14) => api.get(`/nutrition/macro-trend?days=${days}`),
}