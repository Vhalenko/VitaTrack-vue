import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { foodAPI } from '@/api/food'

export const useFoodLogStore = defineStore('foodLog', () => {
  const logs       = ref({ breakfast: [], lunch: [], dinner: [], snack: [] })
  const totals     = ref({ calories: 0, protein: 0, carbs: 0, fat: 0 })
  const weekly     = ref([])
  const activeDate = ref(new Date().toISOString().slice(0, 10))
  const loading    = ref(false)

  const allLogs = computed(() =>
    Object.values(logs.value).flat()
  )

  const caloriesByMeal = computed(() => {
    const result = {}
    for (const [meal, items] of Object.entries(logs.value)) {
      result[meal] = items.reduce((sum, i) => sum + parseFloat(i.total_calories), 0)
    }
    return result
  })

  async function fetchLogs(date = activeDate.value) {
    loading.value = true
    try {
      const res     = await foodAPI.getLogs(date)
      logs.value    = res.data.logs
      totals.value  = res.data.totals
      activeDate.value = date
    } finally {
      loading.value = false
    }
  }

  async function addLog(payload) {
    await foodAPI.addLog({ ...payload, date: activeDate.value })
    await fetchLogs(activeDate.value)
  }

  async function deleteLog(id) {
    await foodAPI.deleteLog(id)
    await fetchLogs(activeDate.value)
  }

  async function fetchWeekly() {
    const res    = await foodAPI.getWeekly()
    weekly.value = res.data.weekly
  }

  return {
    logs, totals, weekly, activeDate, loading,
    allLogs, caloriesByMeal,
    fetchLogs, addLog, deleteLog, fetchWeekly,
  }
})