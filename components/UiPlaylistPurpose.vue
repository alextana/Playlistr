<template>
  <div
    class="purposes-container grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-3 mt-4"
  >
    <template
      v-if="playlistPurposes"
      v-for="purpose in purposes"
      :key="purpose.id"
    >
      <button
        @click="$emit('selectedPurpose', purpose)"
        :class="`${
          props.selectedPurpose === purpose
            ? classes.hoverableButton.selected
            : ''
        } w-full p-4 ${classes.hoverableButton.default}`"
      >
        <div class="purpose-icon text-center text-6xl mb-2">
          {{ purpose.icon }}
        </div>
        <h2>{{ purpose.name }}</h2>
      </button>
    </template>
  </div>
</template>

<script setup>
import { playlistPurposes } from './utils/purposes'
import { classes } from './utils/classes'
const purposes = ref(playlistPurposes)

const props = defineProps({
  selectedPurpose: {
    type: Object,
    default: () => {},
  },
})
</script>
