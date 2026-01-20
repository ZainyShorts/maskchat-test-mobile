import { ENDPOINTS } from './vars/vars'
import { GET, POST, PATCH, DELETE, SEARCHBYIDPARAMS, GETBYID } from './api'

import { ToppingDataType } from './interface/toppingInterface'

export async function getAllToppings(): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.topping}/`
    const response = await GET(url)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Toppings data')
    }
  }
}

export async function createToppings(data: ToppingDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.topping}/`
    const response = await POST(url, data)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating Toppings')
    }
  }
}

export async function deleteToppings(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.topping}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting Toppings')
    }
  }
}
export async function getToppingSizeByBusinessId(params: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.toppingsize}`
    const response = await SEARCHBYIDPARAMS(url, params)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching toppings size data')
    }
  }
}

export async function getToppingsByBusinessId(params: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.toppings}`
    const response = await SEARCHBYIDPARAMS(url, params)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching toppings size data')
    }
  }
}

export async function getTopping(params: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.toppings}`
    const response = await SEARCHBYIDPARAMS(url, params)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching toppings data')
    }
  }
}

export async function getToppingsById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.topping}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching  Topping details data')
    }
  }
}

export async function updateTopping(id: number, data: ToppingDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.topping}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating toppings data')
    }
  }
}
