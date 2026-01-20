import axios from 'axios'

export async function getUserById(id: number): Promise<any> {
  try {
    const response = await axios.get(`/api/get-users/get-userById/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': ''
      }
    })

    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.error || 'Error in fetching user data')
    } else {
      throw new Error('Network error in fetching user data')
    }
  }
}
