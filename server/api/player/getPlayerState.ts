import {
  getPlayerState,
  getRecentlyPlayed,
  getPlayerQueue,
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

  let res
  let items

  res = await getPlayerQueue(accessToken)
  items = await res.json()
  return items
})
