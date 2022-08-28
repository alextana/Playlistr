import NextAuth from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    token: {
      id: string
    }
    user: {
      accessToken: string
      id: string
      image: string
      exp: number
      iat: number
      jti: string
      picture: string
      sub: string
    }
  }
}
