"use client"

import { useState } from "react"
import { X } from "lucide-react" // install lucide-react if not already: npm i lucide-react
import { iframeURL } from "@/api/vars/vars";

function FloatingChatbotIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 bg-transparent right-6 z-0 w-20 h-20 group"
    >
      <div className="relative w-full h-full animate-bounce-interval">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-violet-600/30 rounded-full blur-xl animate-glow-pulse" />

        {/* Main icon container */}
        <div className="relative w-full h-full transition-all duration-300 hover:scale-110 group-hover:animate-wiggle">
          <img
            src="https://res.cloudinary.com/diml90c1y/image/upload/v1758075156/chat-bot-3d-icon_235528-2179-removebg-preview_epyyls.png"
            alt="3D Chatbot Icon"
            className="w-full h-full object-contain cursor-pointer drop-shadow-lg"
          />

          {/* Floating sparkles effect */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75" />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />

          {/* Subtle shadow beneath */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-purple-900/20 rounded-full blur-md animate-bounce-soft" />
        </div>
      </div>
    </button>
  )
}

function ChatbotIframe({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed left-0 top-0 right-0 bottom-0 bg-white overflow-hidden z-50">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute cursor-pointer top-2 right-1 z-50 p-2 rounded-[100px] bg-gray-200
                   backdrop-blur-md shadow-md  hover:bg-red-500 hover:text-white
                   transition-all duration-300 ease-in-out">
        <X size={12} strokeWidth={2.5} />
      </button>

      <iframe
        src={`${iframeURL()}/chat-bot`}
        className="w-full h-full border-0"
      />
    </div>
  )
}

export default function Home() {
  const [isIframeOpen, setIsIframeOpen] = useState(false)

  return (
    <>
      <FloatingChatbotIcon onClick={() => setIsIframeOpen(true)} />
      <ChatbotIframe isOpen={isIframeOpen} onClose={() => setIsIframeOpen(false)} />
    </>
  )
}
