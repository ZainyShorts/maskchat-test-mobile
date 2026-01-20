// ChatGptType
import { DELETE, GET, GETBYID, PATCH, POST, POSTFILE } from './api'
import { ChatGptType } from '@/api/interface/interfaceChatGPT'
import { ENDPOINTS } from './vars/vars'

export async function getChatGpt(): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.chatgpt}/`
    const response = await GET(url)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching chatgpt data')
    }
  }
}

export async function CreateChatGPT(data: ChatGptType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.chatgpt}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating chatgpt')
    }
  }
}
export async function deleteChatGPT(id: string): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.chatgpt}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting chatgpt')
    }
  }
}

export async function updateChatGPT(id: number, data: ChatGptType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.chatgpt}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating chatgpt data')
    }
  }
}

export async function getChatGptById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.chatgpt}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching chatgpt data')
    }
  }
}
