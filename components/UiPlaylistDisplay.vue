<template>
  <div class="overflow-x-auto relative">
    <table class="table">
      <!-- head -->
      <thead>
        <tr class="border-0 text-gray-300">
          <template v-if="loading.loading">
            <th v-for="_ in new Array(5).fill()" />
          </template>
          <template v-else>
            <th>#</th>
            <th>Track</th>
            <th>Album</th>
            <th>Duration</th>
            <th>Actions</th>
          </template>
        </tr>
      </thead>
      <tbody v-for="(track, i) in props.tracks">
        <tr class="border-0 hover:bg-indigo-900" ref="itemRefs">
          <th>{{ i + 1 }}</th>
          <td class="text-ellipsis">
            <div class="track-info flex items-center space-x-3">
              <div class="avatar">
                <div class="mask mask-squircle w-12 h-12">
                  <img
                    :src="track.track.album.images[2].url"
                    alt="Avatar Tailwind CSS Component"
                  />
                </div>
              </div>
              <div class="track-details">
                <span class="block">{{ track.track.name }}</span>
                <span class="text-gray-400">
                  <template v-for="(artist, i) in track.track.artists">
                    {{ artist.name
                    }}{{
                      (track.track.artists.length > 1) &
                      (i < track.track.artists.length - 1)
                        ? ', '
                        : ''
                    }}
                  </template>
                </span>
              </div>
            </div>
          </td>
          <td>{{ track.track.album.name }}</td>
          <td>{{ msToMinutesAndSeconds(track.track.duration_ms) }}</td>
          <td>
            <div class="flex items-center gap-1">
              <Icon name="material-symbols:add" size="20" />
              <Icon name="mingcute:delete-line" size="20" />
            </div>
          </td>
        </tr>
      </tbody>
      <!-- loading state -->
      <tbody v-if="loading.loading" v-for="_ in new Array(20).fill()">
        <tr class="h-[72px] border-0 overflow-hidden mb-2">
          <th>
            <div class="skeleton block bg-[#1a1e45] w-6 h-6"></div>
          </th>
          <td>
            <div class="track-info flex items-center space-x-3">
              <div class="avatar">
                <div class="block skeleton w-12 h-12"></div>
              </div>
              <div class="info w-full">
                <div class="block skeleton w-full h-[15px] mb-2"></div>
                <div class="block skeleton w-full h-[10px]"></div>
              </div>
            </div>
          </td>
          <td>
            <div class="block skeleton w-full h-[15px] mb-2"></div>
          </td>
          <td>
            <div class="block skeleton w-full h-[15px] mb-2"></div>
          </td>
          <td>
            <div class="block skeleton w-full h-[15px] mb-2"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const emit = defineEmits(['loadMore'])
const props = defineProps({
  tracks: {
    type: Object,
    default: () => {},
  },
  loading: {
    type: Object,
    default: () => {
      ;(loading = true), (offset = 0)
    },
  },
  totalTracks: {
    type: Number,
    default: null,
  },
})

const target = ref(null)
const itemRefs = ref([])
const targetIsVisible = useElementVisibility(target)

onMounted(() => {
  target.value = itemRefs.value[65]
})

// When visible emit a load more event
watch(targetIsVisible, (newValue) => {
  if (props.totalTracks <= 100 || props.totalTracks === props.tracks.length) {
    return
  }

  if (newValue) {
    emit('loadMore', props.tracks.length)
  }
})

// On each update update the target element
// so we target one near the bottom of the next list
onUpdated(() => {
  target.value = itemRefs.value[itemRefs.value.length - 40]
})

const msToMinutesAndSeconds = (ms) => {
  let minutes = Math.floor(ms / 60000)
  let seconds = ((ms % 60000) / 1000).toFixed(0)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
</script>

<style>
.skeleton {
  animation-duration: 2.2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: loading;
  border: 1px solid rgb(39, 49, 63);
  border-radius: 15px;
  animation-timing-function: linear;
  background: #656889;
  background: linear-gradient(to right, #1a1e45 8%, #252a56 18%, #1a1e45 33%);
  background-size: 1200px 100%;
}

@-webkit-keyframes loading {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 100% 0;
  }
}

@keyframes loading {
  0% {
    background-position: -1200px 0;
  }
  100% {
    background-position: 1200px 0;
  }
}
</style>
