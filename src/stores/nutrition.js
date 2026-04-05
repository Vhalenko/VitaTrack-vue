import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { nutritionAPI } from '@/api/nutrition'

export const useNutritionStore = defineStore('nutrition', () => {
  const dayBreakdown  = ref(null)
  const averages      = ref(null)
  const topFoods      = ref([])
  const macroTrend    = ref([])
  const activeDate    = ref(new Date().toISOString().slice(0, 10))
  const avgPeriod     = ref(7)
  const loading       = ref(false)

  const hasDayData = computed(() =>
    dayBreakdown.value && dayBreakdown.value.items?.length > 0
  )

  async function fetchDay(date = activeDate.value) {
    loading.value    = true
    activeDate.value = date
    try {
      const res         = await nutritionAPI.getDay(date)
      dayBreakdown.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchAverages(days = avgPeriod.value) {
    avgPeriod.value = days
    const res       = await nutritionAPI.getAverages(days)
    averages.value  = res.data.averages
  }

  async function fetchTopFoods() {
    const res      = await nutritionAPI.getTopFoods()
    topFoods.value = res.data.foods
  }

  async function fetchMacroTrend(days = 14) {
    const res         = await nutritionAPI.getMacroTrend(days)
    macroTrend.value  = res.data.trend
  }

  return {
    dayBreakdown, averages, topFoods, macroTrend,
    activeDate, avgPeriod, loading, hasDayData,
    fetchDay, fetchAverages, fetchTopFoods, fetchMacroTrend,
  }
})