"use client"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { AppSidebar } from "./sidebar"
import { ChatInterface } from "./chat-interface"
import { Box, Typography, Avatar, useTheme, IconButton, useMediaQuery } from "@mui/material"
import { getAllBusiness } from "@/api/business"

interface Chatbot {
  id: string
  name: string
  avatar: string
  description: string
}

const chatbots: Chatbot[] = [
  {
    id: "1",
    name: "Travel Assistant",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    description: "Your Saudi travel companion",
  },
  {
    id: "2",
    name: "Event Planner",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    description: "Discover amazing events",
  },
  {
    id: "3",
    name: "Culture Guide",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80",
    description: "Explore Saudi culture",
  },
  {
    id: "4",
    name: "Adventure Bot",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
    description: "Find thrilling adventures",
  },
]

export default function Home() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentChatbot, setCurrentChatbot] = useState<Chatbot>(chatbots[0])

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleChatbotSelect = (chatbotId: string) => {
    const selectedChatbot = chatbots.find((bot) => bot.id === chatbotId)
    if (selectedChatbot) {
      setCurrentChatbot(selectedChatbot)
    }
    setSidebarOpen(false) // close sidebar on mobile
  }

  const handleNewChat = () => {
    setSidebarOpen(false)
  }

  const [business,setUserBusinessData] = useState<any>([])
    useEffect(() => {
        const fetchBusiness = async () => {
          try {
            const response = await getAllBusiness()
            setUserBusinessData(response?.data?.results || [])
          } catch (err: any) {
            // setError(err.message || 'Failed to fetch business')
          } finally {
            // setLoading(false)
          }
        }
        fetchBusiness()
      }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Main Header */}


      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-[1001] h-full md:h-auto transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ marginTop: "80px", height: "calc(100vh - 80px)" }}
      >
        <AppSidebar
          open={sidebarOpen}
          onToggle={handleToggleSidebar}
          onChatbotSelect={handleChatbotSelect}
          onNewChat={handleNewChat}
          chatbots={chatbots}
          currentChatbot={currentChatbot}
        />
      </div>

      {/* Chat Interface */}
      <div
        className="flex-1 flex flex-col"
        style={{ marginTop: "80px", height: "calc(100vh - 80px)" }}
      >
        <ChatInterface
          currentChatbot={currentChatbot}
          onNewChat={handleNewChat}
          sidebarWidth={280}
          sidebarOpen={sidebarOpen}
          businessId={business.business_id} 
        />
      </div>
    </div>
  )
}
