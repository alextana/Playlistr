import NextAuth, { type NextAuthOptions } from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

// Prisma adapter for NextAuth, optional and can be removed

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      authorization:
        'https://accounts.spotify.com/authorize?scope=playlist-modify-public,user-read-private,user-read-email,user-top-read',
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, profile }) {
      if (account) {
        token.id = account.id
        token.accessToken = account.refresh_token
      }

      if (profile) {
        token.id = profile.id
      }

      return token
    },
    async session({ session, user, token }) {
      // session.user = user
      session.token = token
      return session
    },
  },
  secret: process.env.JWT_SECRET as string,
}

export default NextAuth(authOptions)
