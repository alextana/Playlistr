<template>
  <label v-if="props.label" :for="props.id" class="label">
    <span class="label-text font-extrabold text-white">{{ props.label }}</span>
  </label>
  <input
    :id="props.id"
    class="input input-bordered input-primary w-full max-w-xs"
    :class="props.classes"
    :type="props.type"
    :disabled="props.disabled"
    :placeholder="props.placeholder || null"
    :aria-describedby="props.help ? `helper-${props.id}` : null"
    :style="props.style"
    :value="props.modelValue || props.value"
    :autofocus="props.autofocus || null"
    @input="$emit('update:modelValue', $event.target.value)"
    :required="props.required || null"
  />
  <small v-if="props.help" :id="`helper-${props.id}`">{{ props.help }}</small>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
  },
  placeholder: {
    type: String,
    default: '',
  },
  classes: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
  style: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: null,
  },
  help: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: 'text',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
})
</script>
