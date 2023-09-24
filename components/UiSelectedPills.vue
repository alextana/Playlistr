<template>
  <div class="flex gap-3">
    <div
      class="uppercase outline outline-offset-2 outline-lime-500 text-xs font-extrabold rounded-lg w-max px-4 py-2 bg-lime-500 text-black"
      v-for="selected in props.items"
    >
      {{ selected }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  removable: {
    type: Boolean,
    default: false,
  },
})
</script>
