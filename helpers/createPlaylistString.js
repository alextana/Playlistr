export const createPlaylistString = async (values, session) => {
  if (!values.value) {
    return
  }
  const { playlist_name, selected_purpose, selected_genres, track_number } =
    values.value

  if (!session) return

  const playlist = `playlist_name=${playlist_name}`
  const params = new URLSearchParams(playlist)
  const user_id = session?.id
  const seeds = selected_purpose?.seeds

  let seedString = null
  let seedGenres = null

  if (user_id) {
    params.set('user_id', user_id)
  }

  if (track_number) {
    params.set('limit', track_number.toString())
  }

  if (seeds) {
    seedString = '&' + Object.keys(seeds)
      .map((key) => key + '=' + seeds[key])
      .join('&')
      .toString()
  }

  if (selected_genres?.length) {
    seedGenres = 'seed_genres=' + selected_genres.join(',')
  }

  const string = [seedString, seedGenres].join('&')

  return `${params}${string}`
}