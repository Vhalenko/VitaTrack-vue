<template>
  <div class="field">
    <label v-if="label" :for="id">{{ label }}</label>
    <div class="input-wrap">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :class="{ 'input-error': error }"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <Transition name="fade">
      <p v-if="error" class="field-error">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5.5" stroke="currentColor"/>
          <path d="M6 4v3M6 8.5v.5" stroke="currentColor" stroke-linecap="round"/>
        </svg>
        {{ error }}
      </p>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue:   { type: String,  default: '' },
  label:        { type: String,  default: '' },
  type:         { type: String,  default: 'text' },
  placeholder:  { type: String,  default: '' },
  error:        { type: String,  default: '' },
  disabled:     { type: Boolean, default: false },
  autocomplete: { type: String,  default: 'off' },
})

defineEmits(['update:modelValue'])

const id = computed(() =>
  props.label
    ? props.label.toLowerCase().replace(/\s+/g, '-')
    : Math.random().toString(36).slice(2)
)
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-wrap {
  position: relative;
}

input {
  width: 100%;
  padding: 10px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9375rem;
  color: var(--text-primary);
  background: var(--surface-2);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  outline: none;
  transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);
  appearance: none;
  color-scheme: dark;
}

input:focus {
  border-color: var(--border-focus);
  background: var(--surface);
  box-shadow: 0 0 0 3px rgba(240, 237, 232, 0.06);
}

input::placeholder {
  color: var(--text-muted);
}

input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.input-error {
  border-color: var(--error) !important;
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(224, 90, 74, 0.12) !important;
}
</style>