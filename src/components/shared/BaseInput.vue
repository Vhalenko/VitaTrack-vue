<template>
  <div class="input-group">
    <label v-if="label">{{ label }}</label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input"
    />
  </div>
</template>

<script>
export default {
  name: "BaseInput",
  props: {
    modelValue: String,
    label: String,
    type: {
      type: String,
      default: "text"
    },
    placeholder: String
  }
};
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-weight: 600;
}

.input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
</style>