import axios from 'axios'
// import cookie from 'cookie'

// export default async (req: any, res: any) => {
//   console.log(req.body, req.method, 'before get')
//   // Parse cookies to extract auth tokens
//   const cookies = cookie.parse(req.headers.cookie ?? '')
//   const { auth_token } = cookies

//   // if (!auth_token) {
//   //   return res.status(401).json({
//   //     error: 'User is not authorized to make this request'
//   //   })
//   // }

//   // Config for axios requests
//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//       Authorization: `Token ${auth_token}`
//     }
//   }

//   // Handle GET request for a single restaurant
//   if (req.method === 'GET') {
//     console.log(req.body, req.method, 'inside get')
//     const id = req.body // Get the restaurant ID from query params

//     console.log(id, 'id')

//     if (!id) {
//       return res.status(400).json({ error: 'Restaurant ID is required' })
//     }

//     try {
//       // API request to fetch a single restaurant by ID
//       const apiResponse = await axios.get(`http://127.0.0.1:8000/api/whatseat/restaurants/`, config)

//       if (apiResponse.status === 200) {
//         // Return the restaurant data
//         return res.status(200).json(apiResponse.data)
//       } else {
//         return res.status(apiResponse.status).json({
//           error: 'Error fetching restaurant details'
//         })
//       }
//     } catch (error: any) {
//       // Handle API request errors
//       console.log('Error in getting restaurant details', error.response)
//       return res.status(500).json({ error: 'Internal server error' })
//     }
//   }
//   // Handle POST request to create a new restaurant

//   // Handle unsupported HTTP methods
//   else {
//     res.setHeader('Allow', ['GET'])
//     return res.status(405).json({
//       error: `Method ${req.method} not allowed.`
//     })
//   }
// }
export default async (req: any, res: any) => {
  console.log(req.method, req, 'dddddddddd')

  if (req.method === 'GET') {
    // console.log(req.method, req.body, 'req method')

    // Parse cookies to extract JWT access token
    // const cookies = cookie.parse(req.headers.cookie ?? '')
    // const access = cookies.access ?? false

    // const { auth_token, csrftoken } = cookies

    // Check if user is authorized
    // if (access === false) {
    //   return res.status(401).json({
    //     error: 'User is not authorized to make this request'
    //   })
    // }

    const id = req.body

    console.log('id = ', id)

    try {
      // Extract the address ID from the request body

      // Set up the API request config
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          // Authorization: `Token ${auth_token}`
        }
      }

      // Make the DELETE request to the API endpoint
      const apiResponse = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/whatseat/restaurants/${id}/`, config)

      // console.log("Deleted")
      // Check the response status and handle accordingly
      if (apiResponse?.status === 200) {
        return res.status(apiResponse.status).json({
          message: 'Resturant deleted successfully'
        })
      } else {
        return res.status(apiResponse?.status).json({
          error: 'Error deleting Resturant'
        })
      }
    } catch (error: any) {
      // Handle API request errors
      console.log('Error:', error.response.data)

      return res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    // Handle invalid HTTP methods
    res.setHeader('Allow', ['GET'])

    return res.status(405).json({
      error: `Method ${req.method} not allowed.`
    })
  }
}
