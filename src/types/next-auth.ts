import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    accessToken?: string
    email?: string
    exp?: number
    iat?: number
    id?: string
    jti?: string
    name?: string
    picture?: string
  }
  interface Session {
    token: JWT
  }
}
