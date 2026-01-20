import { DELETE, GET, GETBYID, PATCH, POST } from './api'
import { InstagramDataType } from './interface/instagramInterface'
import { ENDPOINTS } from './vars/vars'

export async function FeedInstaGram(data: InstagramDataType): Promise<any> {
  try {
    console.log('insta feed',data)
    const url = `${ENDPOINTS.instagram}/instagram-platform/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating instagram feed')
    }
  }
}

export async function GetInstaGram(): Promise<any> {
  try {
    const url = `${ENDPOINTS.instagram}/instagram-platform/`
    const response = await GET(url)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in getting Instagram')
    }
  }
}

export async function deleteInstagram(id: string): Promise<any> {
  try {
    const url = `${ENDPOINTS.instagram}/instagram-platform`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting Instagram')
    }
  }
}

export async function getInstgramById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.instagram}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching instagram data')
    }
  }
}

export async function updateInstagram(id: number, data: InstagramDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.instagram}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating instagram data')
    }
  }
}

export async function deletInstaGram(id: string): Promise<any> {
  try {
    const url = `${ENDPOINTS.instagram}/instagram-platform`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting TeleGram')
    }
  }
}
