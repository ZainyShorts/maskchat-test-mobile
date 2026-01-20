//import { API_URL } from '../../../../config'
import { getBaseUrl } from '@/api/vars/vars'
import axios from 'axios'
import cookie from 'cookie'

export default async (req: any, res: any) => {
  if (req.method === 'GET') {
    const cookies = cookie.parse(req.headers.cookie ?? '')

    const { auth_token, csrftoken } = cookies

    const access = cookies.access ?? false

    // console.log(cookies, 'cookies-----------')

    // if (access === false) {
    //   return res.status(401).json({
    //     error: 'User is not authorized to make this request'
    //   })
    // }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${auth_token}`
      }
    }

    try {
      // Assuming you have an API endpoint to fetch customer addresses
      const apiResponse = await axios.get(`${getBaseUrl()}account/users/`, config)

      // console.log(apiResponse, 'apiResponse')

      if (apiResponse?.status === 200) {
        // Assuming the response contains an array of customer addresses
        const addresses = apiResponse.data

        return res.status(apiResponse.status).json(addresses)
      } else {
        return res.status(apiResponse?.status).json({
          error: 'Error fetching customer addresses'
        })
      }
    } catch (error: any) {
      // Handle API request errors
      console.log('Error in getting users', error.response)

      return res.status(500).json({ error: error })
    }
  } else {
    res.setHeader('Allow', ['GET'])

    return res.status(405).json({
      error: `Method ${req.method} not allowed.`
    })
  }
}
