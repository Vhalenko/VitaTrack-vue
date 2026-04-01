// src/stores/history.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { historyAPI } from '@/api/history'

export const useHistoryStore = defineStore('history', () => {
  const monthlyDays  = ref([])
  const currentMonth = ref(new Date().toISOString().slice(0, 7))
  const trend        = ref([])
  const trendDays    = ref(30)
  const stats        = ref(null)
  const weightLogs   = ref([])
  const selectedDay  = ref(null)   // { date, logs, totals }
  const loading      = ref(false)

  // Map date -> calorie data for quick calendar lookup
  const dayMap = computed(() => {
    const map = {}
    for (const d of monthlyDays.value) map[d.log_date] = d
    return map
  })

  const avgCalories = computed(() => {
    if (!trend.value.length) return 0
    const sum = trend.value.reduce((s, d) => s + parseFloat(d.total_calories), 0)
    return Math.round(sum / trend.value.length)
  })

  async function fetchMonthly(month = currentMonth.value) {
    loading.value = true
    try {
      const res        = await historyAPI.getMonthly(month)
      monthlyDays.value = res.data.days
      currentMonth.value = month
    } finally {
      loading.value = false
    }
  }

  async function fetchDayDetail(date) {
    const res      = await historyAPI.getDayDetail(date)
    selectedDay.value = { date, ...res.data }
    return selectedDay.value
  }

  async function fetchTrend(days = trendDays.value) {
    trendDays.value = days
    const res    = await historyAPI.getTrend(days)
    trend.value  = res.data.trend
  }

  async function fetchStats() {
    const res   = await historyAPI.getStats()
    stats.value = res.data.stats
  }

  async function fetchWeight(days = 90) {
    const res        = await historyAPI.getWeight(days)
    weightLogs.value = res.data.logs
  }

  async function addWeight(weight, date) {
    await historyAPI.addWeight({ weight, date })
    await fetchWeight()
  }

  async function deleteWeight(id) {
    await historyAPI.deleteWeight(id)
    await fetchWeight()
  }

  return {
    monthlyDays, currentMonth, trend, trendDays, stats,
    weightLogs, selectedDay, loading,
    dayMap, avgCalories,
    fetchMonthly, fetchDayDetail, fetchTrend, fetchStats,
    fetchWeight, addWeight, deleteWeight,
  }
})