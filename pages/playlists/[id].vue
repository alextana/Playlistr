<template>
  <div :class="`playlist-info  w-full z-50 ${classes.app.contentBackground}`">
    <UiText el="h1" class="text-5xl">{{ playlistName }}</UiText>
  </div>
  <UiSeparator class="my-4" />
  <UiPlaylistDisplay
    ref="playlistDisplay"
    :tracks="tracks"
    :totalTracks="totalTracks"
    @load-more="handleLoadMore"
    :loading="loading"
  />
</template>

<script setup>
import { classes } from '~/components/utils/classes'
const route = useRoute()

const tracks = ref([])
const totalTracks = ref(null)
const playlistName = ref(route.query.name || '')

const loading = ref({})

const playlistDisplay = ref(null)

const loadTracks = (offset = 0) => {
  loading.value = {
    loading: true,
    offset,
  }
  $fetch(`/api/playlists/getPlaylistItems?id=${route.params.id}`, {
    method: 'GET',
    params: {
      offset: offset,
    },
  }).then(function (res) {
    totalTracks.value = res.total
    tracks.value = tracks.value?.length
      ? [...tracks.value, res.items].flat(1)
      : res.items
    loading.value = {
      loading: false,
      offset,
    }
  })
}

onMounted(() => {
  loadTracks()
})

const handleLoadMore = (offset) => {
  if (totalTracks.value <= 100) {
    return
  }

  loadTracks(offset)
}
</script>
