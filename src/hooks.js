import * as cookie from 'cookie'

export async function getSession({ request }) {
  const cookies = cookie.parse(request.headers.get('cookie') || '')

  if (!cookies.access_token) {
    return {
      authenticated: false,
    }
  } else {
    return {
      authenticated: true,
      access_token: cookies.access_token,
      refresh_token: cookies.refresh_token,
    }
  }
}