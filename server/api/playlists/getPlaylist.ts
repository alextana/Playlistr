import { getPlaylist } from '~/lib/spotify'
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
  const token = await getToken({ event })

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No token found',
    })
  }

  const query = getQuery(event)
  const accessToken = token.accessToken as string

  const response = await getPlaylist(accessToken, query.id)

  const playlist = await response.json()

  return playlist
})
