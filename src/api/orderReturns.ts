import { ENDPOINTS } from './vars/vars'
import { GET, POST, GETBYID, PATCH, DELETE } from './api'
import { OrderReturnDataType } from './interface/orderReturnInterface'

export async function getAllOrderReturns(): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.returnOrders}/`
    const response = await GET(url)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Order Retruns data')
    }
  }
}

export async function getAllReturnOrdersByBusinessId(businessId : string): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.returnOrders}/by-business/${businessId}/`
    const response = await GET(url)

    return response.data
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching menus data')
    }
  }
}

export async function createOrderReturns(data: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.returnOrder}/create/`
    const response = await POST(url, data)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating return Orders')
    }
  }
}

export async function deleteOrderReturns(id: string): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.returnOrders}`
    const response = await DELETE(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting return Orders')
    }
  }
}
export async function getOrderReturnsById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.returnOrders}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching return Orders data')
    }
  }
}

export async function updateOrderReturns(id: number, data: OrderReturnDataType): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.returnOrders}/${id}/`
    const response = await PATCH(url, data)

    return response
  } catch (error: any) {
    if (error.response) {
      // You can customize the error handling based on your API's error structure
      throw error.response
    } else {
      throw new Error('Error in updating return Orders data')
    }
  }
}
