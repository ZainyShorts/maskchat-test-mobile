import type { NextApiRequest, NextApiResponse } from 'next'
// import cookie from 'cookie'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // const cookies = cookie.parse(req.headers.cookie || '')
  const token = 'fff'

  // console.log(token, 'token-----------------uuu')

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  // Use the token to make a request to another API or perform any logic
  res.status(200).json({ success: true, token })
}
