// Utility functions for the chat interface

import { getBaseUrl } from "@/api/vars/vars"

export interface PhoneValidationResult {
  isValid: boolean
  normalizedNumber: string | null
  error?: string
}

export function validateAndNormalizePhoneNumber(input: string): PhoneValidationResult {
  // Remove all non-digit characters
  const digitsOnly = input.replace(/\D/g, "")

  // Check if it's empty
  if (!digitsOnly) {
    return {
      isValid: false,
      normalizedNumber: null,
      error: "Phone number cannot be empty",
    }
  }

  // Check for valid length (between 10 and 15 digits)
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return {
      isValid: false,
      normalizedNumber: null,
      error: "Phone number must be between 10 and 15 digits",
    }
  }

  // Normalize the number (add + prefix if not present)
  let normalizedNumber = digitsOnly
  if (!input.startsWith("+")) {
    normalizedNumber = "+" + digitsOnly
  }

  return {
    isValid: true,
    normalizedNumber: normalizedNumber,
  }
}

export function formatPhoneNumber(phoneNumber: string): string {
  const digitsOnly = phoneNumber.replace(/\D/g, "")

  if (digitsOnly.length === 10) {
    // Format as (XXX) XXX-XXXX
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`
  } else if (digitsOnly.length === 11) {
    // Format as +X (XXX) XXX-XXXX
    return `+${digitsOnly[0]} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`
  }

  return phoneNumber
}

export interface ChatAPIResponse {
  reply: string
}

export interface ChatAPIRequest {
  business_id: string
  phoneId: string 
  name : string
  query: string
}


export async function sendChatMessage(
  phoneId: string,
  name: string,
  query: string,
  businessId: string
): Promise<ChatAPIResponse> {
  const API_ENDPOINT = `${getBaseUrl()}agents/chatbots/web-sales-agent/`

  try {
    const requestBody: ChatAPIRequest = {
      business_id: businessId,
      phoneId: phoneId,
      name: name,
      query: query,
    }
    console.log("request body", requestBody)

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data: ChatAPIResponse = await response.json()
    console.log("Response", data)
    return data
  } catch (error) {
    console.error("[v0] Error calling chat API:", error)
    throw error
  }
}
