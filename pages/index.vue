<template>
  <div class="heading-container mt-1 mb-4">
    <UiText el="h1"
      >Hello {{ data.user.name.split(' ')[0] }},
      <span class="font-light">what would you like to do?</span></UiText
    >
  </div>
  <div class="actions grid grid-cols-1 items-stretch lg:grid-cols-3 gap-3 mb-4">
    <template v-for="action in actions">
      <NuxtLink :to="action.url">
        <button
          :class="{
            'disabled opacity-60 pointer-events-none': !action.available,
          }"
          class="action flex min-h-[140px] h-full w-full justify-between gap-2 tracking-tighter relative bg-neutral-900/60 hover:bg-indigo-800 p-4 text-left rounded-2xl"
        >
          <div
            class="absolute -top-2 right-0 uppercase text-xs font-extrabold transform rotate-2 px-2 py-1 bg-lime-500 text-black"
            v-if="!action.available"
          >
            coming soon
          </div>
          <div class="actions-description">
            <UiText el="h3">{{ action.name }}</UiText>
            <UiText el="h4" class="text-base font-normal text-gray-400">{{
              action.description
            }}</UiText>
          </div>
          <div v-if="action.icon" class="action-icon text-lime-500">
            <Icon :name="action.icon" size="80"></Icon>
          </div>
        </button>
      </NuxtLink>
    </template>
  </div>
  <div class="recommendations mb-4">
    <UiText el="h2"> Freshly baked </UiText>
    <div>
      <!-- TODO make recommendation playlists -->
    </div>
  </div>
</template>

<script setup>
const { data } = useAuth()

const actions = ref([
  {
    name: 'Generate a playlist',
    description: 'Use the wizard to auto-magically create a playlist',
    icon: 'material-symbols:playlist-add',
    url: '/playlists/generate',
    id: 1,
    available: true,
  },
  {
    name: 'Get album recommendations',
    description: 'Browse a list of recommended albums',
    icon: 'iconamoon:music-album',
    url: '',
    id: 2,
    available: true,
  },
  {
    name: 'Events',
    description: 'See events near you',
    available: false,
    icon: 'material-symbols:calendar-today-outline-sharp',
    url: '',
    id: 3,
  },
])
</script>
