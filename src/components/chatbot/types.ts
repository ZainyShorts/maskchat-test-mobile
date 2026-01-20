export interface Message {
  id: string
  content: string | ProductCard[]
  sender: "user" | "ai"
  timestamp: string
  selectedCard?: SelectedCard | null
}

export interface ProductCard {
  img: string
  title: string
  body: string
}

export interface AttractionCard {
  id: string
  title: string
  category: string
  location: string
  image: string
}

export interface EventCard {
  id: string
  title: string
  category: string
  location: string
  date: string
  month: string
  year: string
  image: string
}

export interface Chatbot {
  id: string
  name: string
  avatar: string
  description: string
}

export interface ChatInterfaceProps {
  currentChatbot: Chatbot
  onNewChat?: () => void
  sidebarWidth?: number
  sidebarOpen?: boolean
  businessId: string
}

export interface SelectedCard {
  id: string
  title: string
  category: string
  image: string
  type: "attraction" | "event"
}
