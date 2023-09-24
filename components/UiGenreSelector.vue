<template>
  <template v-if="data">
    <div class="my-2">
      <div
        v-for="letter in getLetters(data)"
        :key="letter"
        class="genres-container w-full mx-auto gap-3 justify-center flex flex-wrap mb-2"
      >
        <template v-for="genre in data.genres" :key="genre">
          <div
            @click="handleSelect(genre)"
            :class="`${
              classes.hoverableButton.default
            } flex-auto capitalize w-max grid place-content-center p-4 rounded-lg ${
              props.selectedGenres.find((f) => f === genre)
                ? classes.hoverableButton.selected
                : ''
            }`"
            v-if="genre.charAt(0) === letter"
          >
            {{ genreName(genre) }}
          </div>
        </template>
      </div>
    </div>
  </template>
  <template v-if="pending">loading...</template>
  <div v-if="error" class="error-container text-center">
    <UiText el="h3">Could not retrieve genres from the Spotify API</UiText>
    <UiText el="p">Please try again</UiText>
  </div>
</template>

<script setup>
import { classes } from './utils/classes'
const { data, pending, error } = useFetch('/api/genres/getGenres')

const emits = defineEmits(['update'])
const props = defineProps({
  selectedGenres: {
    type: Array,
    default: () => [],
  },
})

const genreName = (genre) => {
  return genre.replace('-', ' ')
}

const handleSelect = (genre) => {
  emits('update', genre)
}

const getLetters = (data) => {
  return [...new Set(data.genres.map((x) => x.charAt(0)))]
}
</script>

<style>
.letters-enter-active,
.letters-leave-active {
  transition: all 0.5s ease;
}
.letters-enter-from,
.letters-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
