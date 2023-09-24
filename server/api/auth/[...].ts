import { NuxtAuthHandler } from '#auth'
import SpotifyProvider from 'next-auth/providers/spotify'
export default NuxtAuthHandler({
  secret: '7ca0ae2a-a03e-41c4-a3fd-03d60b70ffd4',
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    SpotifyProvider.default({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          scope: [
            'user-read-playback-state',
            'user-read-recently-played',
            'user-read-currently-playing',
          ],
        },
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account) {
        token.accessToken = account.refresh_token
      }
      return token
    },
    session: async ({ session, token }) => {
      const newSession = {
        ...session,
        id: token.sub,
      }

      return newSession
    },
  },
})
