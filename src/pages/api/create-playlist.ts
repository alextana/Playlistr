import { createPlaylist } from '../../libs/spotify'
import { addToPlaylist } from '../../libs/spotify'
import { getRecommendations } from '../../libs/spotify'
import { getArtists } from '../../libs/spotify'
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req })
  const { query } = req

  if (!token) {
    return res.status(401).json({ error: 'No token found' })
  }

  const accessToken = token.accessToken as string
  const response = await createPlaylist(
    accessToken,
    query.user_id as string,
    query.playlist_name as string
  )
  const playlist = await response.json()

  let seed_artists: any = null
  let limit: any = query.limit || '20'

  if (playlist) {
    // playlist created - add tracks
    // if no seed_genres then get artists
    if (!query.seed_genres) {
      const offset: string = Math.floor(Math.random() * 10).toString()

      const artists = await getArtists(accessToken, offset)

      const artistsData = await artists.json()

      seed_artists = artistsData?.items.map(function (artist: any) {
        return artist['id']
      })
    }
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
    return res.status(500).json(error)
  }

  const recommended = await recommendedData?.json()
  const tracks = recommended?.tracks?.map((track: any) => track.uri)

  if (tracks) {
    // add to playlist
    try {
      await addToPlaylist(accessToken, playlist.id, tracks.join(','))
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  return res.status(200).json(playlist)
}

export default handler
