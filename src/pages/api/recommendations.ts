import { getRecommendations } from '../../libs/spotify'
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req })
  const { query } = req

  if (!token) {
    return res.status(401).json({ error: 'No token found' })
  }

  if (!query.tracks) {
    return res.status(404).json({ error: 'No tracks found' })
  }

  const accessToken = token.accessToken as string
  const response = await getRecommendations(accessToken, query.tracks)
  const playlist = await response.json()

  return res.status(200).json(playlist)
}

export default handler
