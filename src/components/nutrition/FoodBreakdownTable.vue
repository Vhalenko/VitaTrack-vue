<template>
  <div class="breakdown-card">
    <div class="breakdown-head">
      <h3 class="card-label">Per food item</h3>
      <div class="meal-filter">
        <button
          v-for="m in meals"
          :key="m.value"
          class="filter-btn"
          :class="{ active: activeFilter === m.value }"
          @click="activeFilter = m.value"
        >{{ m.label }}</button>
      </div>
    </div>

    <div v-if="filteredItems.length" class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th class="col-name">
              <button class="sort-btn" @click="sort('name')">
                Food <SortIcon :active="sortKey === 'name'" :dir="sortDir" />
              </button>
            </th>
            <th class="col-meal">Meal</th>
            <th class="col-num">
              <button class="sort-btn" @click="sort('portion_grams')">
                Portion <SortIcon :active="sortKey === 'portion_grams'" :dir="sortDir" />
              </button>
            </th>
            <th class="col-num">
              <button class="sort-btn" @click="sort('calories')">
                Kcal <SortIcon :active="sortKey === 'calories'" :dir="sortDir" />
              </button>
            </th>
            <th class="col-num">
              <button class="sort-btn" @click="sort('protein')">
                Protein <SortIcon :active="sortKey === 'protein'" :dir="sortDir" />
              </button>
            </th>
            <th class="col-num">
              <button class="sort-btn" @click="sort('carbs')">
                Carbs <SortIcon :active="sortKey === 'carbs'" :dir="sortDir" />
              </button>
            </th>
            <th class="col-num">
              <button class="sort-btn" @click="sort('fat')">
                Fat <SortIcon :active="sortKey === 'fat'" :dir="sortDir" />
              </button>
            </th>
            <th class="col-bar"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in sortedItems"
            :key="item.id"
            class="table-row"
            :class="{ expanded: expandedId === item.id }"
            @click="expandedId = expandedId === item.id ? null : item.id"
          >
            <td class="col-name">
              <span class="food-name">{{ item.name }}</span>
            </td>
            <td class="col-meal">
              <span class="meal-badge" :class="item.meal_category">{{ item.meal_category }}</span>
            </td>
            <td class="col-num mono">{{ item.portion_grams }}g</td>
            <td class="col-num mono fw">{{ Math.round(item.calories) }}</td>
            <td class="col-num mono protein">{{ item.protein }}g</td>
            <td class="col-num mono carbs">{{ item.carbs }}g</td>
            <td class="col-num mono fat">{{ item.fat }}g</td>
            <td class="col-bar">
              <div class="cal-bar-track">
                <div class="cal-bar-fill" :style="{ width: calPercent(item.calories) + '%' }"></div>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="totals-row">
            <td colspan="2" class="col-name">Total</td>
            <td class="col-num mono">—</td>
            <td class="col-num mono fw">{{ Math.round(colTotals.calories) }}</td>
            <td class="col-num mono protein">{{ colTotals.protein.toFixed(1) }}g</td>
            <td class="col-num mono carbs">{{ colTotals.carbs.toFixed(1) }}g</td>
            <td class="col-num mono fat">{{ colTotals.fat.toFixed(1) }}g</td>
            <td class="col-bar"></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-else class="breakdown-empty">
      <p>No food logged{{ activeFilter !== 'all' ? ` for ${activeFilter}` : '' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineComponent, h } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
})

const SortIcon = defineComponent({
  props: { active: Boolean, dir: String },
  setup(p) {
    return () => h('span', { class: ['sort-icon', p.active ? 'active' : ''] },
      p.active ? (p.dir === 'asc' ? ' ↑' : ' ↓') : ' ↕'
    )
  }
})

const meals = [
  { value: 'all',       label: 'All'       },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch',     label: 'Lunch'     },
  { value: 'dinner',    label: 'Dinner'    },
  { value: 'snack',     label: 'Snack'     },
]

const activeFilter = ref('all')
const expandedId   = ref(null)
const sortKey      = ref('calories')
const sortDir      = ref('desc')

const filteredItems = computed(() =>
  activeFilter.value === 'all'
    ? props.items
    : props.items.filter(i => i.meal_category === activeFilter.value)
)

const sortedItems = computed(() => {
  const arr = [...filteredItems.value]
  arr.sort((a, b) => {
    const av = a[sortKey.value]
    const bv = b[sortKey.value]
    const cmp = typeof av === 'string' ? av.localeCompare(bv) : +av - +bv
    return sortDir.value === 'asc' ? cmp : -cmp
  })
  return arr
})

const colTotals = computed(() => ({
  calories: filteredItems.value.reduce((s, i) => s + +i.calories, 0),
  protein:  filteredItems.value.reduce((s, i) => s + +i.protein,  0),
  carbs:    filteredItems.value.reduce((s, i) => s + +i.carbs,    0),
  fat:      filteredItems.value.reduce((s, i) => s + +i.fat,      0),
}))

const maxCal = computed(() =>
  Math.max(...filteredItems.value.map(i => +i.calories), 1)
)

function calPercent(cal) {
  return Math.round((+cal / maxCal.value) * 100)
}

function sort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'desc'
  }
}
</script>

<style scoped>
.breakdown-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 22px;
  overflow: hidden;
}

.breakdown-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 10px;
}

.card-label {
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.meal-filter {
  display: flex;
  gap: 4px;
}

.filter-btn {
  padding: 4px 10px;
  font-size: 0.8125rem;
  font-family: 'DM Sans', sans-serif;
  background: none;
  border: 1.5px solid transparent;
  border-radius: 20px;
  cursor: pointer;
  color: var(--text-muted);
  transition: all var(--transition);
}
.filter-btn:hover  { color: var(--text-primary); border-color: var(--border); }
.filter-btn.active { color: var(--text-primary); border-color: var(--text-primary); background: var(--bg); }

.table-wrap { overflow-x: auto; margin: 0 -22px; padding: 0 22px; }

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

thead th {
  padding: 8px 10px;
  text-align: right;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
thead th.col-name,
thead th.col-meal { text-align: left; }

.col-name   { width: auto; min-width: 140px; }
.col-meal   { width: 100px; }
.col-num    { width: 72px; }
.col-bar    { width: 70px; }

.sort-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  white-space: nowrap;
  width: 100%;
}
thead th.col-name .sort-btn { justify-content: flex-start; }
.sort-btn:hover { color: var(--text-primary); }

.sort-icon       { color: var(--text-muted); font-size: 0.7rem; }
.sort-icon.active { color: var(--text-primary); }

.table-row {
  cursor: pointer;
  transition: background var(--transition);
  border-bottom: 1px solid var(--border);
}
.table-row:last-child { border-bottom: none; }
.table-row:hover  { background: var(--bg); }
.table-row.expanded { background: var(--accent-light); }

td {
  padding: 10px 10px;
  text-align: right;
  vertical-align: middle;
}
td.col-name,
td.col-meal { text-align: left; }

.food-name {
  font-size: 0.9rem;
  color: var(--text-primary);
}

.meal-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  border: 1px solid var(--border);
  color: var(--text-muted);
}
.meal-badge.breakfast { background: #fff8e6; border-color: #f5d98a; color: #a07000; }
.meal-badge.lunch     { background: #e8f4ee; border-color: #c3e6d3; color: var(--accent); }
.meal-badge.dinner    { background: #f0eafa; border-color: #d8c8f0; color: #6b3fa0; }
.meal-badge.snack     { background: #fef0ee; border-color: #f5c6c2; color: var(--error); }

.mono { font-family: 'DM Mono', monospace; }
.fw   { font-weight: 500; color: var(--text-primary); }
.protein { color: var(--accent); }
.carbs   { color: #e67e22; }
.fat     { color: var(--error); }

.col-bar { padding-left: 4px; }

.cal-bar-track {
  height: 3px;
  background: var(--bg);
  border-radius: 3px;
  overflow: hidden;
}
.cal-bar-fill {
  height: 100%;
  background: var(--text-primary);
  border-radius: 3px;
  opacity: 0.25;
  transition: width 400ms ease;
}

tfoot .totals-row {
  border-top: 2px solid var(--border);
  font-weight: 500;
}
tfoot td { padding: 10px 10px; }

.breakdown-empty {
  text-align: center;
  padding: 32px;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>