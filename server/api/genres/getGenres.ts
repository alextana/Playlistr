import { getGenres } from '~/lib/spotify'
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

  const response = await getGenres(accessToken)

  const genres = await response.json()

  return genres
})
