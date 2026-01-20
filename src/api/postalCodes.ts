import { GET, POST, DELETE, GETBYID, PATCH } from './api'
import { postalCodesDataType } from './interface/postalCodesInterface'

import { ENDPOINTS } from './vars/vars'

export async function FeedPostalCodes(data: postalCodesDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.postalCodes}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating postal Codes')
    }
  }
}

export async function getAllPostalCodes(): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.postalCodes}/`
    const response = await GET(url)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Postal Codes data')
    }
  }
}

export async function getPostalCodeById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.postalCodes}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in getPostalCodeById data')
    }
  }
}

export async function updatePostalCodes(id: number, data: postalCodesDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.postalCodes}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updatePostalCodes data')
    }
  }
}

export async function deletePostalCodes(id: string): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.postalCodes}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting PostalCodes')
    }
  }
}
