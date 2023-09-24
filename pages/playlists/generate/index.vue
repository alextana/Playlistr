<template>
  <div class="action-bar mb-4">
    <div
      class="icon-wrapper rounded-full bg-black/60 w-8 h-8 grid place-content-center"
    >
      <Icon name="ic:twotone-arrow-back-ios" size="20" />
    </div>
  </div>
  <UiText el="span" class="font-extrabold uppercase text-xs"
    >New playlist</UiText
  >
  <div class="playlist-wizard">
    <UiPlaylistEditableName @update="formValues.playlist_name = $event" />

    <UiSeparator v-if="!formValues.playlist_name" class="mt-4" />

    <UiText el="p" v-if="!formValues.playlist_name">
      please insert a name for the playlist
    </UiText>

    <UiSeparator class="my-12" />

    <UiText el="h2">What's the purpose of the playlist? </UiText>
    <UiSeparator class="mb-4" />

    <UiPlaylistPurpose
      @selected-purpose="handleSelectedValues($event, 'selected_purpose', 1)"
      :selectedPurpose="formValues.selected_purpose"
    />

    <UiSeparator class="my-12" />

    <template v-if="formValues.selected_purpose && formValues.playlist_name">
      <UiText el="h3">How many tracks would you like to add?</UiText>
      <UiSeparator class="mt-4" />
      <UiPlaylistTrackNumber
        :selected-number="formValues.track_number"
        @update="handleSelectedValues($event, 'track_number', 1)"
      />
    </template>

    <UiSeparator class="my-12" />
    <!-- GENRE SELECTOR -->
    <template v-if="formValues.selected_purpose && formValues.playlist_name">
      <div>
        <UiText el="h3"
          >Select up to 3 genres
          <span class="font-light italic">(optional)</span></UiText
        >
        <UiText el="small"
          >Or we'll guess what you might like based on your favourite
          artists</UiText
        >
        <UiSeparator class="mb-4" />
        <div class="genres-display flex gap-6 items-center">
          <UiSelectedPills
            v-if="formValues.selected_genres?.length"
            :items="formValues.selected_genres"
          />

          <div class="buttons flex gap-2 items-center">
            <button
              class="btn btn-tertiary"
              :class="{
                'py-1 text-xs font-extrabold h-max min-h-max':
                  formValues.selected_genres.length,
              }"
              onclick="genres_modal.showModal()"
            >
              <span v-if="!formValues.selected_genres.length"
                >Select genres</span
              >
              <span class="flex items-center gap-2" v-else
                ><Icon name="fluent:edit-12-regular" size="24" />
              </span>
            </button>
            <button
              v-if="formValues.selected_genres.length"
              @click="formValues.selected_genres = []"
              class="btn btn-error py-1 text-xs font-extrabold h-max min-h-max"
            >
              <Icon name="ic:sharp-clear" size="24" />
            </button>
          </div>
        </div>
        <dialog id="genres_modal" class="modal">
          <div
            :class="`modal-box w-11/12 max-w-5xl ${classes.app.modalBackground} pl-6 pt-6 pr-6 !pb-0`"
          >
            <form method="dialog">
              <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
            </form>
            <UiText el="h3" class="text-2xl">Select up to 3 genres</UiText>
            <UiSeparator class="mb-8" />
            <UiGenreSelector
              @update="handleSelectedValues($event, 'selected_genres', 3)"
              :selectedGenres="formValues.selected_genres"
            />
            <div
              :class="`modal-action flex items-center justify-between sticky bottom-0 ${classes.app.modalBackground} p-4`"
            >
              <UiSelectedPills :items="formValues.selected_genres" />
              <form method="dialog" class="modal-backdrop">
                <button class="btn btn-primary">Done</button>
              </form>
            </div>
          </div>
          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </template>

    <UiSeparator class="mt-8 mb-16" />

    <div class="create w-max ml-auto sticky bottom-0">
      <UiButton
        :state="createButtonState"
        @click="handleSubmit"
        class="btn btn-primary font-bold items-center flex gap-2 rounded-lg"
      >
        Create playlist
        <Icon name="ion:sparkles-outline" size="24" />
      </UiButton>
    </div>

    <UiSeparator class="mb-8" />
  </div>
</template>

<script setup>
const urlString = ref('')
const createButtonState = ref('')

const { execute } = useFetch(
  () => `/api/playlists/generatePlaylist?${urlString.value}`,
  {
    onRequest() {
      createButtonState.value = 'loading'
    },
    onResponseError() {
      createButtonState.value = 'error'
    },
    async onResponse() {
      createButtonState.value = 'done'
      setTimeout(async () => {
        // TODO - send to created playlist page
        await navigateTo('/')
        refreshNuxtData('playlists')
      }, 800)
    },
    immediate: false,
  }
)
const { getSession } = useAuth()

import { classes } from '~/components/utils/classes'
import { createPlaylistString } from '~/helpers/createPlaylistString'

const formValues = ref({
  selected_purpose: null,
  playlist_name: null,
  selected_genres: [],
  track_number: null,
})

/*
  Playlist generator V2.0
  we want to be able to pick a mood or create one with no input, inputs:
*/

const handleSubmit = async () => {
  const session = await getSession()

  urlString.value = await createPlaylistString(formValues, session)

  execute()
}

const handleSelectedValues = (option, key, limit = null) => {
  let value = formValues.value[key]

  // on limits of 1 we can substitute the value
  if (limit === 1) {
    if (option === value) {
      return
    }

    return (formValues.value[key] = option)
  }

  // on higher limits we have to handle an array
  if (value.find((f) => f === option)) {
    value = value.filter((f) => f !== option)
    return (formValues.value[key] = value)
  }

  if (limit > 1 && value.length === limit) {
    // TODO - add toast for > 3
    return
  }

  value = [...value, option]

  return (formValues.value[key] = value)
}
</script>
