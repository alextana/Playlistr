// src/server/router/index.ts
import { createRouter } from './context'
import superjson from 'superjson'

import { playlistRouter } from './playlists'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('playlists.', playlistRouter)

// export type definition of API
export type AppRouter = typeof appRouter
