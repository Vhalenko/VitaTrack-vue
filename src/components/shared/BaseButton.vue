<template>
  <div class="field">
    <label v-if="label" :for="id">{{ label }}</label>
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
  modelValue: { type: String, default: '' },
  label:      { type: String, default: '' },
  type:       { type: String, default: 'text' },
  placeholder:{ type: String, default: '' },
  error:      { type: String, default: '' },
  disabled:   { type: Boolean, default: false },
  autocomplete:{ type: String, default: 'off' },
})

defineEmits(['update:modelValue'])

const id = computed(() =>
  props.label ? props.label.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).slice(2)
)
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
}

.input-error {
  border-color: var(--error) !important;
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.1) !important;
}
</style>