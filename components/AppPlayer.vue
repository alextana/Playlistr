<template>
  <div
    :class="`player min-h-[100px] max-h-[100px] grid grid-cols-3 justify-between overflow-hidden w-full ${classes.app.appBackground} p-3`"
  >
    <!-- <div v-if="data">
      <div class="song-info flex items-center gap-2">
        <img
          :src="data.item.album.images[0].url"
          width="80"
          class="rounded-xl"
        />
        <div class="song-details">
          <UiText el="h4">
            {{ data.item.name }}
          </UiText>
          <template v-for="(artist, i) in data.item.artists" el="h5">
            <span :class="{ 'text-gray-400': i > 0 }">
              {{ i === 0 ? artist.name : ',' + artist.name }}
              {{
                i === data.item.artists.length - 1 &&
                data.item.artists.length > 1
                  ? '.'
                  : ''
              }}
            </span>
          </template>
        </div>
      </div>
    </div> -->
    <div class="player-controls mx-auto text-center">play</div>
    <div class="player-details ml-auto">volume</div>
  </div>
</template>

<script setup>
import { classes } from './utils/classes'
const { data, pending, error } = useFetch('/api/player/getPlayerState')
</script>
