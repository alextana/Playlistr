<template>
  <div class="container flex gap-3">
    <button
      @click="$emit('update', option)"
      v-for="option in availableOptions"
      :class="`w-full ${classes.hoverableButton.default} rounded-lg p-2 ${
        props.selectedNumber === option ? classes.hoverableButton.selected : ''
      }`"
    >
      {{ option }}
    </button>
  </div>
</template>

<script setup>
import { classes } from './utils/classes'
const availableOptions = ['5', '10', '15', '20', '30', '50', '80', '100']

const props = defineProps({
  selectedNumber: {
    type: String,
    default: null,
  },
})
</script>
