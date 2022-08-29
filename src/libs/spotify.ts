const id = process.env.SPOTIFY_CLIENT_ID
const secret = process.env.SPOTIFY_CLIENT_SECRET
const basic = Buffer.from(`${id}:${secret}`).toString('base64')
const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists'
const PLAYLIST_ENDPOINT = 'https://api.spotify.com/v1/playlists'
const RECOMMENDED_ENDPOINT = 'https://api.spotify.com/v1/recommendations'
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`
const GENRES_ENDPOINT = `https://api.spotify.com/v1/recommendations/available-genre-seeds`
const ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists`
const SEARCH_ENDPOINT = `https://api.spotify.com/v1/search`

const getToken = async (refresh_token: string) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  })

  return response.json()
}

export const getPlaylists = async (refresh_token: string) => {
  const { access_token } = await getToken(refresh_token)
  return fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}

export const getPlaylist = async (refresh_token: string, id: any) => {
  const { access_token } = await getToken(refresh_token)
  return fetch(`${PLAYLIST_ENDPOINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: 'GET',
  })
}

export const getPlaylistItems = async (
  refresh_token: string,
  id: any,
  offset: any
) => {
  const { access_token } = await getToken(refresh_token)
  return fetch(`${PLAYLIST_ENDPOINT}/${id}/tracks?limit=100&offset=${offset}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: 'GET',
  })
}

export const addToPlaylist = async (
  refresh_token: string,
  playlistId: any,
  trackUri: any
) => {
  const { access_token } = await getToken(refresh_token)
  return fetch(`${PLAYLIST_ENDPOINT}/${playlistId}/tracks?uris=${trackUri}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: 'POST',
    // body: JSON.stringify(toAdd),
  })
}

export const removeTrack = async (
  refresh_token: string,
  playlistId: any,
  trackToDelete: any
) => {
  const { access_token } = await getToken(refresh_token)
  const toDelete = {
    tracks: [{ uri: trackToDelete }],
  }

  return fetch(`${PLAYLIST_ENDPOINT}/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: 'DELETE',
    body: JSON.stringify(toDelete),
  })
}

export const getGenres = async (refresh_token: string) => {
  const { access_token } = await getToken(refresh_token)

  return fetch(`${GENRES_ENDPOINT}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}

export const searchSongs = async (refresh_token: string, terms: string) => {
  const { access_token } = await getToken(refresh_token)

  return fetch(`${SEARCH_ENDPOINT}?q=${terms}&type=track`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}

export const getArtists = async (refresh_token: string, offset: string) => {
  const { access_token } = await getToken(refresh_token)

  return fetch(`${ARTISTS_ENDPOINT}?limit=5&offset=${offset}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}

export const getRecommendations = async (
  refresh_token: string,
  tracks?: any,
  seed_artists?: any,
  seed_genres?: any,
  seed_string?: string,
  limit?: string
) => {
  const { access_token } = await getToken(refresh_token)
  if (!limit) {
    limit = '20'
  }
  if (seed_string) {
    return fetch(`${RECOMMENDED_ENDPOINT}/?${seed_string}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  }

  return fetch(
    `${RECOMMENDED_ENDPOINT}/?seed_tracks=${tracks}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  )
}

export const createPlaylist = async (
  refresh_token: string,
  user_id: string,
  playlist_name: string
) => {
  const { access_token } = await getToken(refresh_token)
  const playlist = {
    name: playlist_name,
  }
  return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method: 'POST',
    body: JSON.stringify(playlist),
  })
}
