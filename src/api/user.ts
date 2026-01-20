import { GET, POST, DELETE, PUT, PATCH, GETNOAUTH, POSTNOAUTH, GETBYID } from './api'

import { ENDPOINTS } from './vars/vars'
import axios from 'axios'

import type {
  forgotPasswordUserType,
  LoginUser,
  RegisterUserType,
  resetPasswordUserType,
  updateUserPasswordData,
  User,
  verifyUserType
} from './interface/userInterface'

export async function registerUser(data: any): Promise<any> {
  try {
    console.log(data)
    const url = `account/${ENDPOINTS.register}/`

    return await POSTNOAUTH(url, data)
  } catch (error: any) {
    if (error.response && error.response) {
      throw error.response.data
    } else {
      throw new Error('Error in creating user')
    }
  }
}

export async function createUser(data: User): Promise<any> {
  try {
    const url = `account/${ENDPOINTS.register}/`

    return await POSTNOAUTH(url, data)
  } catch (error: any) {
    if (error.response && error.response) {
      throw error.response.data
    } else {
      throw new Error('Error in creating user')
    }
  }
}

export async function loginUser(data: LoginUser): Promise<any> {
  try {
    const url = `account/${ENDPOINTS.login}/`
    const response = await POSTNOAUTH(url, data)

    return response
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data
    } else {
      throw new Error('Login failed due to unexpected error')
    }
  }
}

export async function verifyUser(data: verifyUserType): Promise<any> {
  try {
    const url = `account/${ENDPOINTS.verify}/`
    const response = await POSTNOAUTH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Account Activation failed due to unexpected error')
    }
  }
}

export async function forgotPassword(data: forgotPasswordUserType): Promise<any> {
  try {
    const url = `account/${ENDPOINTS.forgotPassword}/`
    const response = await POSTNOAUTH(url, data)

    return response
  } catch (error: any) {
    console.error('Forgot password error:', error)

    if (error.response) {
      throw error.response
    } else {
      throw new Error('Forgot password failed due to unexpected error')
    }
  }
}

export async function resetPassword(
  data: resetPasswordUserType,
  params: {
    userId: string
    token: string
    expiration_time: string
  }
): Promise<any> {
  try {
    const url = `account/${ENDPOINTS.resetPassword}/${params.userId}/${params.token}/${params.expiration_time}/`
    const response = await POSTNOAUTH(url, data)

    return response
  } catch (error: any) {
    console.error('Reset password error:', error)

    if (error.response) {
      throw error.response
    } else {
      throw new Error('Reset password failed due to unexpected error')
    }
  }
}

export async function updateUserPassword(data: updateUserPasswordData): Promise<any> {
  try {
    const url = `account/${ENDPOINTS.updatePassword}/`
    const response = await POST(url, data)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Update Password failed due to unexpected error')
    }
  }
}

export async function getAllUsers(params?: { search?: string }): Promise<any> {
  try {
    let url = `account/${ENDPOINTS.users}/`
    if (params?.search) {
      const searchParams = new URLSearchParams({ search: params.search })
      url += `?${searchParams.toString()}`
    }
    const response = await GET(url)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Get users failed due to unexpected error')
    }
  }
}

export async function getUserTypes(): Promise<any> {
  try {
    const url = `account/${ENDPOINTS.userTypes}/`
    const response = await GETNOAUTH(url)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching user types')
    }
  }
}

export async function getUserByIduy(id: number): Promise<any> {
  try {
    const response = await axios.get(`/api/user/getById/`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': ''
      },
      data: id
    })

  
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching user data')
    }
  }
}

export async function deletUser(id: string): Promise<any> {
  try {
    const url = `account/${ENDPOINTS.users}`
    const response = await DELETE(url, `${id}/delete`)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting User')
    }
  }
}
export async function getUserById(id: number): Promise<any> {
  try {
    const url = `account/${ENDPOINTS.users}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching User data')
    }
  }
}
export async function updateUser(id: number, data: User): Promise<any> {
  try {
    const url = `account/${ENDPOINTS.users}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating User data')
    }
  }
}
