import { v4 as uuidv4 } from 'uuid'
import * as cookie from 'cookie'

export async function get() {
  let scope = ['user-read-private', 'user-read-email', 'playlist-modify-public', 'user-top-read']
  let state = uuidv4()
  let stateKey = 'spotify_auth_state'

  let url = `https://accounts.spotify.com/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}&response_type=code&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&scope=${encodeURIComponent(scope.join(' '))}&state=${state}`

  const headers = {
    'Set-Cookie': cookie.serialize(stateKey, state, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
    }),
    Location: url,
  }

  return {
    status: 302,
    headers
  }
}
