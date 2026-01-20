import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set the token cookie to expire, effectively removing it
  res.setHeader(
    'Set-Cookie',
    'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict'
  )

  res.status(200).json({ message: 'Logged out' })
}
