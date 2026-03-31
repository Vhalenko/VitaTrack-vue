<template>
  <div class="food-search">
    <!-- Search input -->
    <div class="search-wrap">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <input
        ref="searchInput"
        v-model="query"
        type="text"
        placeholder="Search food…"
        class="search-input"
        @input="onInput"
        @keydown.escape="close"
        autocomplete="off"
      />
      <button v-if="query" class="clear-btn" @click="clear">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- Results dropdown -->
    <Transition name="dropdown">
      <div v-if="results.length || searching" class="results">
        <div v-if="searching" class="results-state">
          <span class="spinner-sm"></span> Searching…
        </div>
        <template v-else>
          <button
            v-for="item in results"
            :key="item.id"
            class="result-item"
            @click="selectItem(item)"
          >
            <div class="result-name">{{ item.name }}</div>
            <div class="result-meta">
              <span class="mono">{{ item.calories_per_100g }} kcal</span>
              <span class="dot">·</span>
              <span>per 100g</span>
            </div>
          </button>
        </template>
      </div>
    </Transition>

    <!-- Add Log Modal -->
    <Transition name="fade">
      <div v-if="selected" class="modal-overlay" @click.self="selected = null">
        <div class="modal">
          <div class="modal-head">
            <div>
              <h3 class="modal-title">{{ selected.name }}</h3>
              <p class="text-sm text-muted">{{ selected.calories_per_100g }} kcal per 100g</p>
            </div>
            <button class="modal-close" @click="selected = null">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- Macro preview -->
          <div class="macro-preview">
            <div v-for="m in previewMacros" :key="m.label" class="macro-chip">
              <span class="chip-value mono">{{ m.value }}</span>
              <span class="chip-label">{{ m.label }}</span>
            </div>
          </div>

          <div class="modal-form">
            <div class="form-row">
              <div class="field">
                <label for="portion">Portion (grams)</label>
                <input
                  id="portion"
                  v-model.number="portion"
                  type="number"
                  min="1"
                  max="5000"
                  placeholder="100"
                />
              </div>
              <div class="field">
                <label for="meal">Meal</label>
                <select id="meal" v-model="meal">
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            </div>

            <div class="calories-preview">
              <span class="text-muted text-sm">Total calories:</span>
              <span class="mono cal-total">{{ previewCalories }} kcal</span>
            </div>

            <button
              class="btn btn-primary btn-full"
              :disabled="adding || portion <= 0"
              @click="confirmAdd"
            >
              <span v-if="adding" class="spinner"></span>
              {{ adding ? 'Adding…' : 'Add to log' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { foodAPI } from '@/api/food'
import { useFoodLogStore } from '@/stores/foodLog'

const emit = defineEmits(['added'])

const foodLog = useFoodLogStore()

const query     = ref('')
const results   = ref([])
const searching = ref(false)
const selected  = ref(null)
const portion   = ref(100)
const meal      = ref('breakfast')
const adding    = ref(false)

let debounceTimer = null

function onInput() {
  clearTimeout(debounceTimer)
  if (!query.value.trim()) { results.value = []; return }
  debounceTimer = setTimeout(doSearch, 300)
}

async function doSearch() {
  searching.value = true
  try {
    const res    = await foodAPI.search(query.value.trim())
    results.value = res.data.results
  } catch {
    results.value = []
  } finally {
    searching.value = false
  }
}

function selectItem(item) {
  selected.value = item
  portion.value  = 100
  results.value  = []
  query.value    = ''
}

function clear() {
  query.value   = ''
  results.value = []
}

function close() {
  clear()
  selected.value = null
}

const previewCalories = computed(() => {
  if (!selected.value || !portion.value) return 0
  return Math.round(selected.value.calories_per_100g * portion.value / 100)
})

const previewMacros = computed(() => {
  if (!selected.value) return []
  const p = portion.value || 0
  return [
    { label: 'Protein', value: (selected.value.protein_per_100g * p / 100).toFixed(1) + 'g' },
    { label: 'Carbs',   value: (selected.value.carbs_per_100g   * p / 100).toFixed(1) + 'g' },
    { label: 'Fat',     value: (selected.value.fat_per_100g     * p / 100).toFixed(1) + 'g' },
  ]
})

async function confirmAdd() {
  if (!selected.value || portion.value <= 0) return
  adding.value = true
  try {
    await foodLog.addLog({
      food_item_id:  selected.value.id,
      meal_category: meal.value,
      portion_grams: portion.value,
    })
    emit('added')
    close()
  } finally {
    adding.value = false
  }
}
</script>

<style scoped>
.food-search { position: relative; }

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  padding-left: 38px !important;
  padding-right: 36px !important;
}

.clear-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  transition: color var(--transition);
}
.clear-btn:hover { color: var(--text-primary); }

/* Results */
.results {
  position: absolute;
  top: calc(100% + 6px);
  left: 0; right: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  z-index: 50;
  overflow: hidden;
  max-height: 280px;
  overflow-y: auto;
}

.results-state {
  padding: 16px;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.result-item {
  width: 100%;
  padding: 11px 16px;
  background: none;
  border: none;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background var(--transition);
  font-family: 'DM Sans', sans-serif;
}
.result-item:last-child { border-bottom: none; }
.result-item:hover { background: var(--bg); }

.result-name {
  font-size: 0.9375rem;
  color: var(--text-primary);
}

.result-meta {
  font-size: 0.8125rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
}
.dot { opacity: 0.4; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(2px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 28px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 500;
}

.modal-close {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  padding: 6px;
  transition: all var(--transition);
}
.modal-close:hover {
  color: var(--text-primary);
  border-color: var(--text-primary);
}

.macro-preview {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.macro-chip {
  flex: 1;
  background: var(--bg);
  border-radius: var(--radius);
  padding: 10px 12px;
  text-align: center;
}

.chip-value {
  display: block;
  font-family: 'DM Mono', monospace;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
}

.chip-label {
  display: block;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-top: 3px;
}

.modal-form { display: flex; flex-direction: column; gap: 16px; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field { display: flex; flex-direction: column; }

.calories-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: var(--bg);
  border-radius: var(--radius);
}

.cal-total {
  font-family: 'DM Mono', monospace;
  font-weight: 500;
  font-size: 1rem;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Spinner */
.spinner-sm {
  width: 12px; height: 12px;
  border: 2px solid rgba(0,0,0,0.1);
  border-top-color: var(--text-muted);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}
.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>