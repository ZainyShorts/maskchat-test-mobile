'use client'

import { getAllBusiness } from "@/api/business"
import { iframeURL } from "@/api/vars/vars"
import { useEffect, useState } from "react"

const ChatbotWidget = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleOpenChat = () => {
    setIsChatOpen(true)
    setIsLoading(true)
  }
  
  const handleIframeLoad = () => {
    setIsLoading(false)
  }
  
  const [business,setUserBusinessData] = useState<any>([])
  useEffect(() => {
      const fetchBusiness = async () => {
        try {
          const response = await getAllBusiness()
          setUserBusinessData(response?.data?.results[0] || [])
        } catch (err: any) {
          // setError(err.message || 'Failed to fetch business')
        } finally {
          // setLoading(false)
        }
      }
      fetchBusiness()
    }, [])

  return (
    <>
      {/* Floating Button */}
      {!isChatOpen && (
        <button onClick={handleOpenChat} className="fixed bottom-6 bg-transparent right-6 z-30 w-20 h-20 group">
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
      )}

      {/* Loading Screen */}
      {isChatOpen && isLoading && (
        <div className="fixed inset-0 bg-white z-[9999] pt-16 mt-16 flex items-center justify-center animate-fadeIn">
          <div className="flex flex-col items-center space-y-6">
            {/* Beautiful SVG Loader */}
            <div className="relative">
              <svg className="loader-svg" width="240" height="240" viewBox="0 0 240 240">
                <circle className="loader-ring loader-ring--a" cx="120" cy="120" r="105" fill="none" stroke="#f42f25" strokeWidth="20" strokeDasharray="0 660" strokeDashoffset="-330" strokeLinecap="round" />
                <circle className="loader-ring loader-ring--b" cx="120" cy="120" r="35" fill="none" stroke="#f49725" strokeWidth="20" strokeDasharray="0 220" strokeDashoffset="-110" strokeLinecap="round" />
                <circle className="loader-ring loader-ring--c" cx="85" cy="120" r="70" fill="none" stroke="#255ff4" strokeWidth="20" strokeDasharray="0 440" strokeLinecap="round" />
                <circle className="loader-ring loader-ring--d" cx="155" cy="120" r="70" fill="none" stroke="#f42582" strokeWidth="20" strokeDasharray="0 440" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-blue-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-3 animate-pulse">Loading Chat Assistant</h3>
              <p className="text-gray-600 text-lg">Preparing your personalized chat experience<span className="animate-bounce inline-block ml-1">...</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot iframe */}
      {isChatOpen && (
        <iframe
          src={`${iframeURL()}/chat-bot/${business.business_id}`}
          className={`fixed right-0 top-16 w-full h-[calc(100vh-4rem)] z-[9998] shadow-lg border-0 transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={handleIframeLoad}
        />
      )}

      {/* Close Button */}
      {isChatOpen && (
        <button
          onClick={() => {
            setIsChatOpen(false)
            setIsLoading(false)
          }}
          className="fixed top-4 mt-[60px] right-4 z-[10000] bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-full shadow-md transition-colors duration-200"
        >
          ✕
        </button>
      )}

      <style jsx>{`
        .loader-svg {
          width: 15rem;
          height: 15rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .loader-ring {
          animation: ringA 2s linear infinite;
        }

        .loader-ring--a {
          stroke: #f42f25;
        }

        .loader-ring--b {
          animation-name: ringB;
          stroke: #f49725;
        }

        .loader-ring--c {
          animation-name: ringC;
          stroke: #255ff4;
        }

        .loader-ring--d {
          animation-name: ringD;
          stroke: #f42582;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes ringA {
          from, 4% { stroke-dasharray: 0 660; stroke-width: 20; stroke-dashoffset: -330; }
          12% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -335; }
          32% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -595; }
          40%, 54% { stroke-dasharray: 0 660; stroke-width: 20; stroke-dashoffset: -660; }
          62% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -665; }
          82% { stroke-dasharray: 60 600; stroke-width: 30; stroke-dashoffset: -925; }
          90%, to { stroke-dasharray: 0 660; stroke-width: 20; stroke-dashoffset: -990; }
        }

        @keyframes ringB {
          from, 12% { stroke-dasharray: 0 220; stroke-width: 20; stroke-dashoffset: -110; }
          20% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -115; }
          40% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -195; }
          48%, 62% { stroke-dasharray: 0 220; stroke-width: 20; stroke-dashoffset: -220; }
          70% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -225; }
          90% { stroke-dasharray: 20 200; stroke-width: 30; stroke-dashoffset: -305; }
          98%, to { stroke-dasharray: 0 220; stroke-width: 20; stroke-dashoffset: -330; }
        }

        @keyframes ringC {
          from { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: 0; }
          8% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -5; }
          28% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -175; }
          36%, 58% { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -220; }
          66% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -225; }
          86% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -395; }
          94%, to { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -440; }
        }

        @keyframes ringD {
          from, 8% { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: 0; }
          16% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -5; }
          36% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -175; }
          44%, 50% { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -220; }
          58% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -225; }
          78% { stroke-dasharray: 40 400; stroke-width: 30; stroke-dashoffset: -395; }
          86%, to { stroke-dasharray: 0 440; stroke-width: 20; stroke-dashoffset: -440; }
        }
      `}</style>
    </>
  )
}

export default ChatbotWidget
