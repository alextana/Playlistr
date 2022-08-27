import { searchSongs } from '../../libs/spotify'
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req })
  const { query } = req

  if (!token) {
    return res.status(401).json({ error: 'No token found' })
  }

  if (!query.terms) {
    return res.status(404).json({ error: 'No terms found' })
  }

  const accessToken = token.accessToken as string
  const terms = query.terms as string
  const response = await searchSongs(accessToken, terms)
  const search = await response.json()

  return res.status(200).json(search)
}

export default handler
