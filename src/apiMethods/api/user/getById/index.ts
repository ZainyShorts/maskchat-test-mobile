import axios from 'axios'
import cookie from 'cookie'

export default async (req: any, res: any) => {
  console.log(req.body, req.method, req, '00000000000000----')

  if (req.method === 'GET') {
    const { id } = req.query // Assuming the ID is passed as a query parameter

    console.log(id, 'id---------')

    if (!id) {
      return res.status(400).json({
        error: 'User ID is required to fetch data'
      })
    }

    const cookies = cookie.parse(req.headers.cookie ?? '')
    const { auth_token } = cookies

    if (!auth_token) {
      return res.status(401).json({
        error: 'User is not authorized to make this request'
      })
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${auth_token}`
      }
    }

    try {
      // Fetch user data by ID
      const apiResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/account/users/${id}/`, config)

      if (apiResponse?.status === 200) {
        // Assuming the response contains user data
        const userData = apiResponse.data

        // Refine the user data if needed (e.g., removing sensitive information)
        const refinedUserData = {
          id: userData.id,
          name: userData.name,
          email: userData.email

          // Add or remove fields as needed
        }

        return res.status(apiResponse.status).json(refinedUserData)
      } else {
        return res.status(apiResponse?.status).json({
          error: 'Error fetching user data'
        })
      }
    } catch (error: any) {
      // Handle API request errors
      console.error('Error in getting user data', error.response)

      return res.status(500).json({ error: error.response?.data || 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['GET'])

    return res.status(405).json({
      error: `Method ${req.method} not allowed.`
    })
  }
}
