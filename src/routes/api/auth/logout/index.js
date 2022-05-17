import * as cookie from 'cookie'

export async function get() {
  const headers = {
    'Set-Cookie': cookie.serialize('access_token', '', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    }),
    Location: '/',
  }
  return {
    status: 302,
    headers,
  }
}