<template>
  <div
    v-if="props.url"
    :class="`user-avatar rounded-full overflow-hidden outline outline-gray-900`"
    :style="`width: ${props.width}px; height: ${props.width}px`"
  >
    <img :src="props.url" :width="props.width" :height="props.width" />
  </div>
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  width: {
    type: [String, Number],
    required: true,
    default: 40,
  },
})
</script>
