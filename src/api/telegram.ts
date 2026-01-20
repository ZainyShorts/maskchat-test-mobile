import { POST, GET, DELETE, PATCH, GETBYID } from './api'
import { TelegramDataType } from './interface/telegramInterface'

import { ENDPOINTS } from './vars/vars'


export async function FeedTelegram(data: TelegramDataType): Promise<any> {
  try {
    console.log('telegram payload', data)
    const url = `${ENDPOINTS.telegram}/telegram-platform/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating Whatsapp')
    }
  }
}


export async function TeleGram(data: TelegramDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.telegram}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating TeleGram')
    }
  }
}

export async function GetTeleGram(): Promise<any> {
  try {
    const url = `${ENDPOINTS.telegram}/telegram-platform/`
    const response = await GET(url)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in getting TeleGram')
    }
  }
}

export async function deletTeleGram(id: string): Promise<any> {
  try {
    const url = `${ENDPOINTS.telegram}/telegram-platform`
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
export async function getTelegramById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.telegram}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching telegram data')
    }
  }
}
export async function updateTelegram(id: number, data: TelegramDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.telegram}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating telegram data')
    }
  }
}
