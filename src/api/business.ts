import type { BusinessDataTypeForAddBusiness } from './interface/businessInterface'
import { DELETE, GET, GETBYID, POSTFILE,PATCHFILE, SEARCHBYPARAMSPAGINATION } from './api'
import { ENDPOINTS } from './vars/vars'
import toast from "react-hot-toast"

export const getAllBusiness = async (params?: { search?: string }) =>{
  try {
    let url = `whatseat/${ENDPOINTS.userbusinesses}/`

    if (params?.search) {
      const searchParams = new URLSearchParams({ search: params.search })
      url += `?${searchParams.toString()}`
    }

    const response = await GET(url)
    console.log('edit--', response)
    return response
  } catch (error: any) {
    console.log('fetch business error',error)
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching business data')
    }
  }
}

export async function getPaginatedBusiness(params: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}`
    const response = await SEARCHBYPARAMSPAGINATION(url, params)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching business data')
    }
  }
}

export async function createBusiness(data: BusinessDataTypeForAddBusiness): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}/`
    const response = await POSTFILE(url, data)
    if (response){
      toast.success("Business created successfully")
    }
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in creating business')
    }
  }
}

export async function deleteBusiness(id: string): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}`
    const response = await DELETE(url, id)

    if (response){
      toast.success("Business deleted successfully")
    }

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in deleting userbusinesses')
    }
  }
}
export async function getBusinessById(id: number): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}`
    const response = await GETBYID(url, id)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching userbusinesses data')
    }
  }
}

export async function updateBusiness(id: number, data: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.userbusinesses}/${id}/`
    const response = await PATCHFILE(url, data)
    if (response){
      toast.success("Business updated successfully")
    }
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in updating userbusinesses data')
    }
  }
}
