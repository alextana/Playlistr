// src/server/router/index.ts
import { createRouter } from './context'
import superjson from 'superjson'

import { exampleRouter } from './example'
import { playlistRouter } from './playlists'
import { authRouter } from './auth'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('playlists.', playlistRouter)
  .merge('auth.', authRouter)

// export type definition of API
export type AppRouter = typeof appRouter
