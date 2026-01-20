import { ENDPOINTS } from './vars/vars'
import { GET, POST, PATCH, DELETE, SEARCHBYIDPARAMS } from './api'

import { ToppingDataType } from './interface/toppingInterface'

export async function getAllFoodTypes(): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.types}/`
    const response = await GET(url)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Food Types data')
    }
  }
}
//
export async function getAllFoodTypesOfSpecificBusiness(params: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.foodTypesByBusiness}`
    const response = await SEARCHBYIDPARAMS(url, params)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Food Types data')
    }
  }
}

//

export async function createFoodType(data: ToppingDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.types}/`
    const response = await POST(url, data)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating Types')
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
export async function getToppingSize(params: any): Promise<any> {
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
