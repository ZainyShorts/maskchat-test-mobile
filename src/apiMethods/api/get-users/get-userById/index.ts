import axios from 'axios'
// import cookie from 'cookie'

export default async (req: any, res: any) => {
  console.log(req, req.body)

  // Parse cookies to extract auth tokens
  // const cookies = cookie.parse(req.headers.cookie ?? '')
  // const { auth_token } = cookies

  // Check if user is authorized
  // if (!auth_token) {
  //   return res.status(401).json({
  //     error: 'User is not authorized to make this request'
  //   })
  // }

  // Config for axios requests
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Authorization: `Token ${auth_token}`
    }
  }

  // Handle GET request for a single User
  if (req.method === 'GET') {
    const { id } = req.query // Fetch id from query parameters

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    try {
      // API request to fetch a single user by ID
      const apiResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/account/users/${id}/`, config)

      if (apiResponse.status === 200) {
        // Return the user data
        return res.status(200).json(apiResponse.data)
      } else {
        return res.status(apiResponse.status).json({
          error: 'Error fetching user details'
        })
      }
    } catch (error: any) {
      // Handle API request errors
      console.error('Error in getting user details', error)

      return res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['GET'])

    return res.status(405).json({
      error: `Method ${req.method} not allowed.`
    })
  }
}
