import * as cookie from 'cookie'
import querystring from 'query-string'

export async function get({ url }) {
  const refresh_token = url.searchParams.get('refresh_token')

  let formData = new URLSearchParams()
  formData.append('grant_type', 'refresh_token')
  formData.append('refresh_token', refresh_token)

  if (!refresh_token || refresh_token === 'undefined') {
    return {
      status: 404,
      message: 'No refresh token provided.'
    }
  }

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(import.meta.env.VITE_CLIENT_ID + ':' + import.meta.env.VITE_CLIENT_SECRET).toString('base64'))
    },
    body: formData,
  })

  if (res.status === 200) {
    const body = await res.json()
    const access_token = body.access_token
    const refresh_token = body.refresh_token

    return {
      body,
      status: 302,
      headers: {
        'Set-Cookie': [
          cookie.serialize('access_token', access_token, 'refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
            sameSite: 'lax',
          }),
          cookie.serialize('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
            sameSite: 'lax',
          })
        ],
        Location: '#' + querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token
        })
      }
    }
  } else {
    return {
      status: 302,
      headers: {
        Location: '/',
      }
    }
  }
}