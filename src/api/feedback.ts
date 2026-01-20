import { getBaseUrl } from "./vars/vars"

// New file for feedback API calls
interface FeedbackItem {
  id: number
  feedback_message: string
  star: number
  customer_phone_number: string
  business_id: string
  created_at: string
}

interface ApiResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
}

export const getFeedbackByBusinessId = async (businessId: string, page = 1, pageSize = 10): Promise<ApiResponse> => {
  try {
    const authToken = localStorage.getItem("auth_token")
    if (!authToken) {
      throw new Error("Authentication token not found. Please login again.")
    }

    const response = await fetch(
      `${getBaseUrl()}feedback/feedback/by-business/${businessId}/?page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${authToken}`,
        },
      },
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data: data,
      message: "Feedback fetched successfully!",
    }
  } catch (error: any) {
    console.error("API Error (getFeedbackByBusinessId):", error)
    return {
      success: false,
      error: error.message || "Failed to fetch feedback",
    }
  }
}
// export const getFeedbackByBusinessId = async (businessId: string): Promise<ApiResponse> => {
//   try {
//     const authToken = localStorage.getItem("auth_token")
//     if (!authToken) {
//       throw new Error("Authentication token not found. Please login again.")
//     }

//     const response = await fetch(`${getBaseUrl()}feedback/feedback/by-business/${businessId}/`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `Token ${authToken}`,
//       },
//     })

//     const data = await response.json()

//     if (!response.ok) {
//       throw new Error(data.message || `HTTP error! status: ${response.status}`)
//     }

//     return {
//       success: true,
//       data: data,
//       message: "Feedback fetched successfully!",
//     }
//   } catch (error: any) {
//     console.error("API Error (getFeedbackByBusinessId):", error)
//     return {
//       success: false,
//       error: error.message || "Failed to fetch feedback",
//     }
//   }
// }

export const deleteFeedback = async (feedbackId: number): Promise<ApiResponse> => {
  try {
    const authToken = localStorage.getItem("auth_token")
    if (!authToken) {
      throw new Error("Authentication token not found. Please login again.")
    }

    const response = await fetch(`${getBaseUrl()}feedback/feedback/${feedbackId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${authToken}`,
      },
    })

    if (response.status === 204) {
      return {
        success: true,
        message: "Feedback deleted successfully!",
      }
    } else {
      const data = await response.json()
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }
  } catch (error: any) {
    console.error("API Error (deleteFeedback):", error)
    return {
      success: false,
      error: error.message || "Failed to delete feedback",
    }
  }
}
