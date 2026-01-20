import { POST, GET, DELETE, GETBYID, PATCH, SEARCHBYPARAMS, SEARCHBYCONTACTPARAMS } from './api'
import { WhatsAppDataType } from './interface/whatsappInterface'
import { ENDPOINTS } from './vars/vars'

export async function FeedWhatsApp(data: WhatsAppDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.whatsapp}/`
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

export async function GetWhatsApp(): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.whatsapp}/`
    const response = await GET(url)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating Menu')
    }
  }
}

export async function deleteWhatsApp(id: string): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.whatsapp}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting whatsapp')
    }
  }
}
export async function getWhatsAppById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.whatsapp}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching whatsapp data')
    }
  }
}

export async function getWhatsAppQRByContact(params: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.whatsAppQR}`
    const response = await SEARCHBYCONTACTPARAMS(url, params)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching whatsappQR code')
    }
  }
}
export async function updateWhatsApp(id: number, data: WhatsAppDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.whatsapp}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating Whats App data')
    }
  }
}


