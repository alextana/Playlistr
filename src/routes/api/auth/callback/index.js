import querystring from 'query-string'
import * as cookie from 'cookie'

export async function post({ url, request }) {
  let code = url.searchParams.get('code')
  let state = url.searchParams.get('state')

  let storedState = request.headers.get('cookie') || null

  if (!state || !state.indexOf(storedState > -1)) {
    return {
      status: 302,
      headers: {
        Location: '#' + querystring.stringify({
          error: 'state_mismatch'
        })
      }
    }
  } else {
    // Build formData object.
    let formData = new URLSearchParams()
    formData.append('code', code)
    formData.append('redirect_uri', import.meta.env.VITE_REDIRECT_URI)
    formData.append('grant_type', 'authorization_code')

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
          Location: '#' + querystring.stringify({
            error: 'invalid_token'
          })
        }
      }
    }
  }
}
