import { getGenres } from 'src/libs/spotify'

import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req })
  if (!token) {
    return res.status(401).json({ error: 'No token found' })
  }
  const accessToken = token.accessToken as string
  const response = await getGenres(accessToken)
  const data = await response.json()

  return res.status(200).json(data.genres)
}

export default handler
