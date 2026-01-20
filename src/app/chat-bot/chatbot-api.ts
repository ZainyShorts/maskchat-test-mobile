import { getBaseUrl } from "@/api/vars/vars"

interface ChatbotResponse {
  id: number
  name: string
  status: boolean
  conversations: number
  vector_store_id: string
  description: string
  created_at: string
  files: any[]
}

export interface Chatbot {
  id: string
  name: string
  avatar: string
  description: string
}

const DEFAULT_AVATAR = "https://png.pngtree.com/png-clipart/20230418/original/pngtree-photorealistic-ai-generated-futuristic-cyborg-or-robot-avatar-png-image_9066102.png"

export async function fetchChatbots(userId: string): Promise<Chatbot[]> {
  try {
    console.log('userId',userId)
    const response = await fetch(`${getBaseUrl()}agents/chatbots/${userId}/`)

    if (!response.ok) {
      throw new Error(`Failed to fetch chatbots: ${response.statusText}`)
    }

    const data: ChatbotResponse[] = await response.json()
    

    return data.map(chatbot => ({
      id: String(chatbot.id),
      name: chatbot.name,
      avatar: DEFAULT_AVATAR,
      description: chatbot.description || `${chatbot.name} assistant`,
    }))
  } catch (error) {
    console.error('Error fetching chatbots:', error)
    throw error
  }
}
