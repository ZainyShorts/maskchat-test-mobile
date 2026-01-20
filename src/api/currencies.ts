import { GET } from './api'
import { ENDPOINTS } from './vars/vars'

export async function getAllCurrencies(): Promise<any> {
  try {
    const url = `whatseat/${ENDPOINTS.currencies}/`
    const response = await GET(url)
    console.log('currencies res', response)
    return response
  } catch (error: any) {
    if (error.response) {
      throw error.response
    } else {
      throw new Error('Error in fetching currencies data')
    }
  }
}
