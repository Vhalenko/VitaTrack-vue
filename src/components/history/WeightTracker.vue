<template>
  <div class="weight-card">
    <div class="weight-header">
      <div>
        <h3 class="weight-title">Weight progress</h3>
        <p v-if="weightLogs.length" class="text-xs text-muted">
          {{ weightLogs.length }} entries ·
          <span v-if="delta !== null" :class="deltaClass">
            {{ delta > 0 ? '+' : '' }}{{ delta.toFixed(1) }} kg overall
          </span>
        </p>
      </div>
      <button class="add-btn" @click="showForm = !showForm">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Log weight
      </button>
    </div>

    <!-- Log form -->
    <Transition name="slide">
      <div v-if="showForm" class="log-form">
        <Transition name="fade">
          <div v-if="formError" class="alert alert-error" style="margin-bottom:10px">{{ formError }}</div>
        </Transition>
        <div class="form-row">
          <div class="field">
            <label for="wt-weight">Weight (kg)</label>
            <input id="wt-weight" v-model.number="form.weight" type="number" step="0.1" min="20" max="500" placeholder="70.0" />
          </div>
          <div class="field">
            <label for="wt-date">Date</label>
            <input id="wt-date" v-model="form.date" type="date" :max="today" />
          </div>
          <button class="btn btn-primary log-submit" :disabled="saving" @click="submitWeight">
            <span v-if="saving" class="spinner"></span>
            {{ saving ? '…' : 'Save' }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- SVG chart -->
    <div class="wt-chart-area">
      <svg v-if="weightPoints.length > 1" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" class="wt-svg">
        <!-- Area -->
        <path :d="weightAreaPath" class="wt-area" />
        <!-- Line -->
        <path :d="weightLinePath" class="wt-line" />
        <!-- Points -->
        <g v-for="(p, i) in weightPoints" :key="i">
          <circle
            :cx="p.x" :cy="p.y" r="3.5"
            class="wt-point"
            @mouseenter="wtTooltip = p"
            @mouseleave="wtTooltip = null"
          />
        </g>
        <!-- Tooltip -->
        <g v-if="wtTooltip">
          <rect
            :x="clampX(wtTooltip.x - 44)"
            :y="wtTooltip.y - 42"
            width="88" height="34"
            rx="5" fill="var(--text-primary)"
          />
          <text :x="clampX(wtTooltip.x)" :y="wtTooltip.y - 27" text-anchor="middle" class="wt-tooltip-date">
            {{ formatDate(wtTooltip.date) }}
          </text>
          <text :x="clampX(wtTooltip.x)" :y="wtTooltip.y - 14" text-anchor="middle" class="wt-tooltip-val">
            {{ wtTooltip.weight }} kg
          </text>
        </g>
        <!-- X labels -->
        <text
          v-for="(l, i) in wtXLabels" :key="'wx'+i"
          :x="l.x" :y="H - 3"
          text-anchor="middle" class="wt-axis-label"
        >{{ l.text }}</text>
      </svg>

      <div v-else-if="!loading" class="wt-empty">
        <p>No weight data yet</p>
        <p class="text-xs text-muted">Use the button above to log your weight</p>
      </div>
    </div>

    <!-- Recent entries list -->
    <div v-if="recentLogs.length" class="wt-list">
      <div class="wt-list-title text-xs text-muted">Recent entries</div>
      <div v-for="log in recentLogs" :key="log.log_date" class="wt-row">
        <span class="wt-date text-sm">{{ formatDate(log.log_date) }}</span>
        <span class="wt-val mono">{{ log.weight }} kg</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const props = defineProps({
  weightLogs: { type: Array,   default: () => [] },
  loading:    { type: Boolean, default: false },
})

const emit = defineEmits(['add', 'delete'])

const showForm  = ref(false)
const saving    = ref(false)
const formError = ref('')
const wtTooltip = ref(null)

const today = new Date().toISOString().slice(0, 10)
const form  = reactive({ weight: '', date: today })

const W   = 600
const H   = 130
const PAD = 10

const recentLogs = computed(() => [...props.weightLogs].reverse().slice(0, 5))

const delta = computed(() => {
  if (props.weightLogs.length < 2) return null
  const first = +props.weightLogs[0].weight
  const last  = +props.weightLogs[props.weightLogs.length - 1].weight
  return +(last - first).toFixed(1)
})

const deltaClass = computed(() => {
  if (delta.value === null) return ''
  return delta.value < 0 ? 'text-accent' : delta.value > 0 ? 'text-error' : ''
})

const minW = computed(() => Math.min(...props.weightLogs.map(l => +l.weight)) - 1)
const maxW = computed(() => Math.max(...props.weightLogs.map(l => +l.weight)) + 1)

const weightPoints = computed(() => {
  const logs = props.weightLogs
  if (logs.length < 2) return []
  const n      = logs.length
  const xStep  = (W - PAD * 2) / (n - 1)
  const yRange = maxW.value - minW.value || 1
  return logs.map((l, i) => ({
    x:      PAD + i * xStep,
    y:      PAD + (1 - (+l.weight - minW.value) / yRange) * (H - PAD * 2),
    weight: l.weight,
    date:   l.log_date,
  }))
})

const weightLinePath = computed(() =>
  weightPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
)

const weightAreaPath = computed(() => {
  if (!weightPoints.value.length) return ''
  const bottom = H - PAD
  const f = weightPoints.value[0]
  const l = weightPoints.value[weightPoints.value.length - 1]
  return `${weightLinePath.value} L ${l.x} ${bottom} L ${f.x} ${bottom} Z`
})

const wtXLabels = computed(() => {
  const pts  = weightPoints.value
  if (!pts.length) return []
  const step = Math.ceil(pts.length / 4)
  return pts.filter((_, i) => i % step === 0 || i === pts.length - 1).map(p => ({
    x: p.x, text: formatDate(p.date),
  }))
})

function clampX(x) { return Math.max(44, Math.min(W - 44, x)) }
function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

async function submitWeight() {
  formError.value = ''
  if (!form.weight || form.weight < 20 || form.weight > 500) {
    formError.value = 'Enter a valid weight (20–500 kg)'
    return
  }
  saving.value = true
  try {
    await emit('add', form.weight, form.date)
    showForm.value = false
    form.weight = ''
  } catch (e) {
    formError.value = 'Failed to save. Try again.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.weight-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 22px;
}

.weight-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.weight-title {
  font-size: 0.9375rem;
  font-weight: 500;
  margin-bottom: 2px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: none;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.8125rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--transition);
}
.add-btn:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.log-form {
  background: var(--bg);
  border-radius: var(--radius);
  padding: 14px;
  margin-bottom: 16px;
  border: 1px solid var(--border);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  align-items: flex-end;
}

.field { display: flex; flex-direction: column; }

.log-submit {
  height: 38px;
  padding: 0 16px;
  white-space: nowrap;
}

/* Chart */
.wt-chart-area {
  height: 130px;
  margin-bottom: 14px;
}

.wt-svg { width: 100%; height: 100%; overflow: visible; }

.wt-line {
  fill: none;
  stroke: #e67e22;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.wt-area {
  fill: #e67e22;
  opacity: 0.08;
}

.wt-point {
  fill: var(--surface);
  stroke: #e67e22;
  stroke-width: 2;
  cursor: pointer;
}
.wt-point:hover { r: 5; }

.wt-axis-label  { font-size: 8px; fill: var(--text-muted); font-family: 'DM Mono', monospace; }
.wt-tooltip-date { font-size: 8px; fill: rgba(255,255,255,0.6); font-family: 'DM Sans', sans-serif; }
.wt-tooltip-val  { font-size: 10px; fill: #fff; font-family: 'DM Mono', monospace; font-weight: 500; }

.wt-empty {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  height: 100%; gap: 4px;
  font-size: 0.875rem; color: var(--text-secondary);
}

/* List */
.wt-list { border-top: 1px solid var(--border); padding-top: 14px; }
.wt-list-title { margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }

.wt-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
}
.wt-row:last-child { border-bottom: none; }

.wt-date { color: var(--text-secondary); }
.wt-val  { font-family: 'DM Mono', monospace; font-size: 0.875rem; font-weight: 500; }

/* Slide */
.slide-enter-active, .slide-leave-active {
  transition: max-height 250ms ease, opacity 250ms ease;
  overflow: hidden; max-height: 200px;
}
.slide-enter-from, .slide-leave-to { max-height: 0; opacity: 0; }

.spinner {
  width: 12px; height: 12px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>