import { createRouter } from './context'
import { z } from 'zod'

export const playlistRouter = createRouter().query('get-all-playlists', {
  async resolve({ ctx }) {
    const token = ctx.req?.cookies['next-auth.session-token']
    const data = await fetch(
      'https://api.spotify.com/v1/me/playlists?limit=20',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const res = await data.json()

    return {
      data: res,
    }
  },
})
