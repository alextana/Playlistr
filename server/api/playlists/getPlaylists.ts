import { getPlaylists } from '~/lib/spotify'
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

  const response = await getPlaylists(accessToken)

  const items = await response.json()

  return items
})
