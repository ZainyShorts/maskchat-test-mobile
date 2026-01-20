import { ENDPOINTS } from './vars/vars'
import { GET, SEARCHBYIDPARAMS } from './api'

export async function getAllFaceBookTemplates(): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.facebookTemplates}/`
    const response = await GET(url)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Facebook Templates data')
    }
  }
}

export async function getAllFaceBookFlows(): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.facebookFlows}/`
    const response = await GET(url)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Facebook flows data')
    }
  }
}

export async function getFaceBookTemplatesByBusinessId(params: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.facebookTemplates}`
    const response = await SEARCHBYIDPARAMS(url, params)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Facebook Templates data')
    }
  }
}

export async function getFaceBookFlowsByBusinessId(params: any): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.facebookFlows}`
    const response = await SEARCHBYIDPARAMS(url, params)

    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching Facebook flows data')
    }
  }
}
