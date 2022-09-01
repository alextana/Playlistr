import { deletePlaylist } from '../../libs/spotify'
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req })
  const { query } = req

  if (!token) {
    return res.status(401).json({ error: 'No token found' })
  }
  const accessToken = token.accessToken as string

  const response = await deletePlaylist(accessToken, query.playlistId)

  return res.status(200).json(response)
}

export default handler
