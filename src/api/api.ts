import axios, { AxiosError } from 'axios'
import { getBaseUrl } from './vars/vars'

const API_URL = getBaseUrl()

export const GET = async (endpoint: string) => {
  const auth_token = localStorage.getItem('auth_token')
  
  console.log('auth_token',auth_token) 
  if (!auth_token) {
    console.error('No auth token found')
    throw new Error('Authentication token not available')
  }


  try {
    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${auth_token}`
      }
    })

    console.log(response)

    return response
  } catch (error) {
    const axiosError = error as AxiosError

    if (axiosError.response?.status === 401) {
      // Handle client-side redirect
      localStorage.removeItem('auth_token')
      window.location.href = '/en/login'

      console.error('Invalid or expired token')
      throw new Error('Authentication failed - please login again')
    }

    console.error('GET request failed:', error)
    throw error
  }
}

export const GETBYID = async (endpoint: string, id: string | number) => {
  const auth_token = localStorage.getItem('auth_token')
  // console.log(auth_token, 'auth_token -- GetById')

  try {
    // const parsedToken = JSON.parse(auth_token)
    // Construct the endpoint with the provided ID
    const url = `${API_URL}${endpoint}/${id}/`
    // console.log(url, 'url -- GetById')

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${auth_token}`
      }
    })
    // console.log(response, 'response -- GetById')

    return response
  } catch (error) {
    const axiosError = error as AxiosError

    if (axiosError.response?.status === 401) {
      // Handle client-side redirect
      localStorage.removeItem('auth_token')
      window.location.href = '/en/login'

      console.error('Invalid or expired token')
      throw new Error('Authentication failed - please login again')
    }

    console.error('GET request failed:', error)
    throw error
  }
}

export const SEARCHBYPARAMSPAGINATION = async (endpoint: string, params: any) => {
  console.log(params, 'params--------')

  const auth_token = localStorage.getItem('auth_token')
  // console.log(auth_token, 'auth_token -- GetById')

  try {
    // const parsedToken = JSON.parse(auth_token)
    // Construct the endpoint with the provided ID
    const url = `${API_URL}${endpoint}/?page=${params?.page_size}`
    // console.log(url, 'url -- GetById')

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${auth_token}`
      }
    })
    // console.log(response, 'response -- GetById')

    return response
  } catch (error) {
    const axiosError = error as AxiosError

    if (axiosError.response?.status === 401) {
      // Handle client-side redirect
      localStorage.removeItem('auth_token')
      window.location.href = '/en/login'

      console.error('Invalid or expired token')
      throw new Error('Authentication failed - please login again')
    }

    console.error('GET request failed:', error)
    throw error
  }
}

export const SEARCHBYPARAMS = async (endpoint: string, params: any) => {
  const auth_token = localStorage.getItem('auth_token')
  // console.log(auth_token, 'auth_token -- GetById')

  try {
    // const parsedToken = JSON.parse(auth_token)
    // Construct the endpoint with the provided ID
    const url = `${API_URL}${endpoint}/?search=${params}`
    // console.log(url, 'url -- GetById')

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${auth_token}`
      }
    })
    // console.log(response, 'response -- GetById')

    return response
  } catch (error) {
    const axiosError = error as AxiosError

    if (axiosError.response?.status === 401) {
      // Handle client-side redirect
      localStorage.removeItem('auth_token')
      window.location.href = '/en/login'

      console.error('Invalid or expired token')
      throw new Error('Authentication failed - please login again')
    }

    console.error('GET request failed:', error)
    throw error
  }
}

export const SEARCHBYIDPARAMS = async (endpoint: string, params: any) => {
  const auth_token = localStorage.getItem('auth_token')

  try {
    const url = `${API_URL}${endpoint}/?business_id=${params}`

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${auth_token}`
      }
    })

    return response
  } catch (error) {
    const axiosError = error as AxiosError

    if (axiosError.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/en/login'

      console.error('Invalid or expired token')
      throw new Error('Authentication failed - please login again')
    }

    console.error('GET request failed:', error)
    throw error
  }
}
export const SEARCHBYCONTACTPARAMS = async (endpoint: string, params: any) => {
  const auth_token = localStorage.getItem('auth_token')

  try {
    console.log('params',params)
    const cleanNumber = params.replace(/[^\d+]/g, '');
    console.log('cleanNumber',cleanNumber)
    const url = `${API_URL}${endpoint}/?number=${cleanNumber}`

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${auth_token}`
      },
      responseType: 'blob'
    })

    return response
  } catch (error) {
    const axiosError = error as AxiosError

    if (axiosError.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/en/login'

      console.error('Invalid or expired token')
      throw new Error('Authentication failed - please login again')
    }

    console.error('GET request failed:', error)
    throw error
  }
}

export const DELETE = async (endpoint: string, id: string | number) => {
  const auth_token = localStorage.getItem('auth_token')

  try {
    const url = `${API_URL}${endpoint}/${id}/`

    const response = await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${auth_token}`
      }
    })

    return response
  } catch (error) {
    const axiosError = error as AxiosError

    if (axiosError.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/en/login'

      console.error('Invalid or expired token')
      throw new Error('Authentication failed - please login again')
    }

    console.error('GET request failed:', error)
    throw error
  }
}

export const GETNOAUTH = async (endpoint: string) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    return response
  } catch (error) {
    console.error('GET request failed:', error)
    throw error
  }
}

export const POST = async (endpoint: string, data: any) => {
  const token = localStorage.getItem('auth_token')

  try {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Token ${token}`
    }

    const response = await axios.post(`${API_URL}${endpoint}`, data, { headers })

    return response
  } catch (error: any) {
    const axiosError = error as AxiosError

    if (axiosError.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = 'en/login'

      console.error('Invalid or expired token')
      throw new Error('Authentication failed - please login again')
    }

    console.error('GET request failed:', error)
    throw error
  }
}
export const POSTFILE = async (endpoint: string, data: any) => {
  const token = localStorage.getItem('auth_token')

  try {
    const headers = {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      Authorization: `Token ${token}`
    }

    const response = await axios.post(`${API_URL}${endpoint}`, data, { headers })

    return response
  } catch (error: any) {
    const axiosError = error as AxiosError

    if (axiosError.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/en/login'

      console.error('Invalid or expired token')
      throw new Error('Authentication failed - please login again')
    }

    console.error('GET request failed:', error)
    throw error
  }
}


export const PATCHFILE = async (endpoint: string, data: FormData) => {
  const token = localStorage.getItem('auth_token')

  try {
    // ✅ Append timestamp to file name
    for (const [key, value] of data.entries()) {
      if (value instanceof File) {
        const timestamp = Date.now()
        const ext = value.name.split('.').pop() // file extension
        const base = value.name.replace(/\.[^/.]+$/, '') // file name without extension
        const newFile = new File([value], `${base}_${timestamp}.${ext}`, { type: value.type })

        data.set(key, newFile) // replace old file with renamed one
      }
    }

    const headers = {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      Authorization: `Token ${token}`
    }

    const response = await axios.patch(`${API_URL}${endpoint}`, data, { headers })

    return response
  } catch (error: any) {
    const axiosError = error as AxiosError

    if (axiosError.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/en/login'

      console.error('Invalid or expired token')
      throw new Error('Authentication failed - please login again')
    }

    console.error('PATCH request failed:', error)
    throw error
  }
}


export const POSTNOAUTH = async (endpoint: string, data: any) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }

    const response = await axios.post(`${API_URL}${endpoint}`, data, { headers })

    return response
  } catch (error: any) {
    throw error
  }
}

export const PUT = async (endpoint: string, data: any) => {
  const auth_token = localStorage.getItem('auth_token')

  try {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Token ${auth_token}`
    }

    const response = await axios.put(`${API_URL}${endpoint}`, data, { headers })
    return response
  } catch (error) {
    const axiosError = error as AxiosError

    if (axiosError.response?.status === 401) {
      // Handle client-side redirect
      localStorage.removeItem('auth_token')
      window.location.href = '/en/login'

      console.error('Invalid or expired token')
      throw new Error('Authentication failed - please login again')
    }

    console.error('GET request failed:', error)
    throw error
  }
}

export const PATCH = async (endpoint: string, data: any) => {
  const auth_token = localStorage.getItem('auth_token')

  try {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Token ${auth_token}`
    }

    const response = await axios.patch(`${API_URL}${endpoint}`, data, { headers })
    return response
  } catch (error) {
    const axiosError = error as AxiosError

    if (axiosError.response?.status === 401) {
      // Handle client-side redirect
      localStorage.removeItem('auth_token')
      window.location.href = '/en/login'

      console.error('Invalid or expired token')
      throw new Error('Authentication failed - please login again')
    }

    console.error('GET request failed:', error)
    throw error
  }
}
