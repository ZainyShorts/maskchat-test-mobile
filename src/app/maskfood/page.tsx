"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AppSidebar } from "@/components/chatbot/sidebar"
import { ChatInterface } from "@/components/chatbot/chat-interface"
import { ChevronLeft } from "lucide-react"
import { Chatbot, fetchChatbots } from "../chat-bot/chatbot-api"


export default function Home() {
  const params = useParams()
  // const businessId = params?.businessId as string
  const businessId = '1647064002723084'
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [currentChatbot, setCurrentChatbot] = useState<Chatbot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  

  useEffect(() => {
    async function loadChatbots() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchChatbots(businessId)
        setChatbots(data)
        if (data.length > 0) {
          setCurrentChatbot(data[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chatbots')
        console.error('Error loading chatbots:', err)
      } finally {
        setLoading(false)
      }
    }

    loadChatbots()
  }, [])

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleChatbotSelect = (chatbotId: string) => {
    const selectedChatbot = chatbots.find((bot) => bot.id === chatbotId)
    if (selectedChatbot) {
      setCurrentChatbot(selectedChatbot)
    }
    setSidebarOpen(false)
  }

  const handleNewChat = () => {
    setSidebarOpen(false)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>

          {/* Text */}
          <p className="text-gray-700 font-medium text-lg animate-pulse">
            Loading chatbots...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: "#f8f8f8ff" }}>
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (chatbots.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: "#f8f8f8ff" }}>
        <div className="text-center">
          <p className="text-gray-600">No chatbots available</p>
        </div>
      </div>
    )
  }

  if (!currentChatbot) {
    return null
  }

  return (
    <div
      className="flex h-screen rounded-t-3xl"
      style={{ backgroundColor: "#f8f8f8ff" }}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          transition-all duration-300 ease-in-out bg-transparent shadow-lg
          ${sidebarOpen ? "w-[280px]" : "w-[70px]"}
          hidden md:block h-full
        `}
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

      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform  duration-300 ease-in-out z-[9999] md:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
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

      {!sidebarOpen && (
        <button
          onClick={handleToggleSidebar}
          className="fixed left-2 top-1/2 -translate-y-1/2 z-[9999] md:hidden
                     bg-white hover:bg-gray-100 shadow-lg rounded-full
                     w-10 h-10 flex items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      )}

      <div className="flex-1 min-w-0 overflow-hidden h-screen bg-transparent transition-all duration-300">
        <ChatInterface
          currentChatbot={currentChatbot}
          onNewChat={handleNewChat}
          sidebarOpen={sidebarOpen}
          businessId={businessId}
        />
      </div>
    </div>
  )
}
