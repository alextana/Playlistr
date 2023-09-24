<template>
  <div class="editable-name flex gap-2 items-center">
    <UiTextInput
      id="playlist_name"
      ref="nameInput"
      classes="min-h-[80px] min-w-full ring-0 text-5xl bg-transparent !outline-0 px-0 border-0 font-extrabold"
      :value="generatedName"
      v-model="playlist_name"
      autofocus
      required
    />
  </div>
</template>

<script setup>
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'

const generatedName = ref()
const playlist_name = ref(generatedName)
const emit = defineEmits(['update'])

watch(playlist_name, (updated) => {
  emit('update', updated)
})

onMounted(() => {
  generatedName.value = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: ' ',
    length: 3,
  })
})
</script>
