<template>
  <aside>
    <div class="heading-container px-3 mt-4">
      <UiText class="hidden lg:block mb-4" el="h2"> Your playlists </UiText>
      <div class="lg:hidden">L</div>
    </div>
    <div v-if="pending">loading...</div>
    <div class="playlist-container overflow-y-scroll overflow-x-hidden h-[90%]">
      <template
        class="playlist-container"
        v-if="data?.items"
        v-for="(playlist, i) in data.items"
        :key="playlist.id"
      >
        <div
          @click="navigateTo(`/playlists/${playlist.id}?name=${playlist.name}`)"
          class="playlist mb-2 flex items-center gap-0 cursor-pointer lg:gap-2 hover:bg-neutral-900/30 p-2"
          :class="{
            'bg-indigo-900 ': route.params.id === playlist.id,
          }"
        >
          <img
            v-if="playlist.images?.length"
            :src="playlist.images[0].url"
            width="50"
            class="rounded-xl"
          />
          <div class="playlist-info hidden lg:block">
            <UiText el="h5" class="font-normal">
              {{ playlist.name }}
            </UiText>
            <UiText el="p" class="text-xs text-neutral-300">
              {{ playlist.tracks.total }}
              {{ playlist.tracks.total === 1 ? 'track' : 'tracks' }}
            </UiText>
          </div>
        </div>
      </template>
    </div>
  </aside>
</template>

<script setup>
const route = useRoute()

const { data, pending, error } = useFetch('/api/playlists/getPlaylists', {
  key: 'playlists',
})
</script>
