import {
  addToPlaylist,
  createPlaylist,
  getArtists,
  getRecommendations,
} from '~/lib/spotify'
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
  const token = await getToken({ event })

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No token found',
    })
  }

  const accessToken = token.accessToken as string
  const query = getQuery(event)

  const response = await createPlaylist(
    accessToken,
    query.user_id as string,
    query.playlist_name as string
  )

  const playlist = await response.json()

  let seed_artists: any = null
  let limit: any = query.limit || '20'

  if (!playlist) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not create the playlist',
    })
  }

  // playlist created - add tracks
  // if no seed_genres then get artists
  if (!query.seed_genres) {
    // start from a random offset of recently listened to artists, up to 20
    const offset: string = Math.floor(Math.random() * 20).toString()

    const artists = await getArtists(accessToken, offset)

    const artistsData = await artists.json()

    seed_artists = artistsData?.items.map(function (artist: any) {
      return artist['id']
    })
  }

  const seed_string = seed_artists
    ? 'seed_artists=' + seed_artists.join(',')
    : 'seed_genres=' + query.seed_genres

  let recommendedData = null

  try {
    recommendedData = await getRecommendations(
      accessToken,
      null,
      null,
      null,
      seed_string,
      limit
    )
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not fetch recommendations',
    })
  }

  const recommended = await recommendedData?.json()
  const tracks = recommended?.tracks?.map((track: any) => track.uri)

  if (tracks) {
    // add to playlist
    try {
      await addToPlaylist(accessToken, playlist.id, tracks.join(','))
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not add tracks to the playlist',
      })
    }
  }

  return playlist
})
