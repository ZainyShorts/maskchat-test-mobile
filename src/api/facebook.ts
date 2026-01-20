import { POST, GET, DELETE, GETBYID, PATCH } from './api'
import { MessengerDataType } from './interface/facebookInterface'
import { ENDPOINTS } from './vars/vars'

export async function FaceBook(data: MessengerDataType): Promise<any> {
  try {
    const url = `${ENDPOINTS.facebook}/messenger-platform/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating messenger')
    }
  }
}

export async function GetFaceBook(): Promise<any> {
  try {
    const url = `${ENDPOINTS.facebook}/messenger-platform/`
    const response = await GET(url)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in getting messenger')
    }
  }
}

export async function deleteFaceBook(id: string): Promise<any> {
  try {
    const url = `${ENDPOINTS.facebook}/messenger-platform`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting messenger')
    }
  }
}
export async function getFaceBookById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.facebook}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching messenger data')
    }
  }
}

export async function updateFaceBook(id: number, data: MessengerDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.facebook}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating facebook data')
    }
  }
}
