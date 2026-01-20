import { ENDPOINTS } from './vars/vars'
import { GET, POST, GETBYID, PATCH, SEARCHBYPARAMS, DELETE } from './api'

export async function getAllShopify(params?: { search?: string }): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.shopify}/`

    const response = await GET(url)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Shopify store')
    }
  }
}

export async function deleteStore(id: string): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.shopify}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting restaurants')
    }
  }
}

export async function createStore(data: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.shopify}/`
    const response = await POST(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating Menu')
    }
  }
}



export async function getStoreById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.shopify}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching restaurants data')
    }
  }
}
export async function updateStore(id: number, data: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.shopify}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in updating restaurant data')
    }
  }
}

