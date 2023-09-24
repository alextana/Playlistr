<template v-if="props.el">
  <component :is="props.el">
    <slot></slot>
  </component>
</template>

<script setup>
const props = defineProps({
  el: {
    type: String,
    required: true,
    default: 'span',
  },
})
</script>

<style>
@import url('~/assets/css/typography.css');
</style>
