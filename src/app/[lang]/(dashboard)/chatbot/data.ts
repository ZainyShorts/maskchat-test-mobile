import { Globe, Monitor, Smartphone } from "lucide-react"

export const integrationOptions = [
{
  name: "JavaScript",
  icon: Globe,
  description: "Raw JavaScript for any website",
  code: `
<script>
(function () {
  let isChatOpen = false
  let isLoading = false

  // Inject CSS
  const style = document.createElement("style")
  style.textContent = \`
    /* Floating button */
    .chatbot-floating-btn {
      position: fixed; bottom: 24px; right: 24px;
      z-index: 30; width: 80px; height: 80px;
      background: transparent; border: none; cursor: pointer;
    }
    .chatbot-btn-container { position: relative; width: 100%; height: 100%; animation: bounce-interval 2s infinite; }
    .chatbot-glow-bg { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(168,85,247,0.3), rgba(124,58,237,0.3)); border-radius: 50%; filter: blur(12px); animation: glow-pulse 2s ease-in-out infinite alternate; }
    .chatbot-icon-container { position: relative; width: 100%; height: 100%; transition: all 0.3s ease; }
    .chatbot-icon-container:hover { transform: scale(1.1); animation: wiggle 0.5s ease-in-out; }
    .chatbot-icon { width: 100%; height: 100%; object-fit: contain; cursor: pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); }
    .chatbot-btn-container .sparkle1 { position: absolute; top: -4px; right: -4px; width: 8px; height: 8px; background: #facc15; border-radius: 50%; animation: ping 1s infinite; }
    .chatbot-btn-container .sparkle2 { position: absolute; bottom: -4px; left: -4px; width: 6px; height: 6px; background: #22d3ee; border-radius: 50%; animation: pulse 2s infinite; }
    .chatbot-btn-container .shadow { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 64px; height: 12px; background: rgba(88,28,135,0.2); border-radius: 50%; filter: blur(4px); animation: bounce-soft 2s infinite; }

    /* Loader overlay */
    .chatbot-loader-overlay { position: fixed; inset: 0; background: white; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; animation: fadeIn 0.3s ease; }
    .loader-svg { width: 15rem; height: 15rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1)); }
    .chatbot-loader-overlay h3 { font-size: 1.5rem; font-weight: bold; margin-top: 1rem; color: #1f2937; animation: pulse 2s infinite; }
    .chatbot-loader-overlay p { color: #555; font-size: 1.125rem; }
    .chatbot-loader-overlay span { display: inline-block; animation: bounce 1s infinite; }

    /* Iframe */
    .chatbot-iframe { position: fixed; right: 0; top: 64px; width: 100%; height: calc(100vh - 64px); z-index: 9998; border: none; opacity: 0; transition: opacity 0.5s ease; }
    .chatbot-iframe.visible { opacity: 1; }

    /* Close button */
    .chatbot-close-btn { position: fixed; top: 76px; right: 16px; z-index: 10000; background: #ef4444; color: white; padding: 6px 12px; border-radius: 9999px; border: none; cursor: pointer; }
    .chatbot-close-btn:hover { background: #dc2626; }

    /* Animations */
    @keyframes bounce-interval { 0%,20%,53%,80%,100% { transform: translateY(0);} 40%,43% { transform: translateY(-10px);} }
    @keyframes glow-pulse { 0% { opacity: 0.3;} 100% { opacity: 0.6;} }
    @keyframes wiggle { 0%,100% { transform: rotate(0deg);} 25% { transform: rotate(-3deg);} 75% { transform: rotate(3deg);} }
    @keyframes ping { 0% { transform: scale(1); opacity: 1;} 75%,100% { transform: scale(2); opacity: 0;} }
    @keyframes pulse { 0%,100% { opacity: 1;} 50% { opacity: 0.5;} }
    @keyframes bounce-soft { 0%,100% { transform: translateX(-50%) scale(1);} 50% { transform: translateX(-50%) scale(0.9);} }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }

    /* Loader rings */
    .loader-ring { animation: ringA 2s linear infinite; }
    .loader-ring--a { stroke: #f42f25; }
    .loader-ring--b { animation-name: ringB; stroke: #f49725; }
    .loader-ring--c { animation-name: ringC; stroke: #255ff4; }
    .loader-ring--d { animation-name: ringD; stroke: #f42582; }

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
  \`
  document.head.appendChild(style)

  function createFloatingButton() {
    const btn = document.createElement("button")
    btn.className = "chatbot-floating-btn"
    btn.innerHTML = \`
      <div class="chatbot-btn-container">
        <div class="chatbot-glow-bg"></div>
        <div class="chatbot-icon-container">
          <img src="https://res.cloudinary.com/diml90c1y/image/upload/v1758075156/chat-bot-3d-icon_235528-2179-removebg-preview_epyyls.png" class="chatbot-icon" />
          <div class="sparkle1"></div>
          <div class="sparkle2"></div>
          <div class="shadow"></div>
        </div>
      </div>\`
    btn.addEventListener("click", openChat)
    document.body.appendChild(btn)
  }

  function createLoader() {
    const overlay = document.createElement("div")
    overlay.className = "chatbot-loader-overlay"
    overlay.innerHTML = \`
      <svg class="loader-svg" viewBox="0 0 240 240">
        <circle class="loader-ring loader-ring--a" cx="120" cy="120" r="105" fill="none" stroke="#f42f25" stroke-width="20"/>
        <circle class="loader-ring loader-ring--b" cx="120" cy="120" r="35" fill="none" stroke="#f49725" stroke-width="20"/>
        <circle class="loader-ring loader-ring--c" cx="85" cy="120" r="70" fill="none" stroke="#255ff4" stroke-width="20"/>
        <circle class="loader-ring loader-ring--d" cx="155" cy="120" r="70" fill="none" stroke="#f42582" stroke-width="20"/>
      </svg>
      <h3>Loading Chat Assistant</h3>
      <p>Preparing your personalized chat experience<span>...</span></p>\`
    return overlay
  }

  function createIframe() {
    const iframe = document.createElement("iframe")
    iframe.className = "chatbot-iframe"
    iframe.src = "https://kosmos.themaskchat.com/chat-bot/1005255797441315" // change to your chatbot URL
    iframe.addEventListener("load", () => {
      isLoading = false
      const loader = document.querySelector(".chatbot-loader-overlay")
      if (loader) loader.remove()
      iframe.classList.add("visible")
    })
    return iframe
  }

  function createCloseButton() {
    const btn = document.createElement("button")
    btn.className = "chatbot-close-btn"
    btn.textContent = "✕"
    btn.addEventListener("click", closeChat)
    return btn
  }

  function openChat() {
    if (isChatOpen) return
    isChatOpen = true
    isLoading = true

    const loader = createLoader()
    document.body.appendChild(loader)

    const iframe = createIframe()
    document.body.appendChild(iframe)

    const closeBtn = createCloseButton()
    document.body.appendChild(closeBtn)
  }

  function closeChat() {
    isChatOpen = false
    isLoading = false
    document.querySelectorAll(".chatbot-iframe, .chatbot-loader-overlay, .chatbot-close-btn").forEach(el => el.remove())
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createFloatingButton)
  } else {
    createFloatingButton()
  }
})()
</script>
`
},

 {
    name: "Next.js",
    icon: Monitor,
    description: "Next.js component with App Router",
    code: `'use client'

import { useState } from "react"

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
          src="https://kosmos.themaskchat.com/chat-bot/1005255797441315"
          className={\`fixed right-0 top-16 w-full h-[calc(100vh-4rem)] z-[9998] shadow-lg border-0 transition-opacity duration-500 \${isLoading ? "opacity-0" : "opacity-100"}\`}
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

      <style jsx>{\`
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
      \`}</style>
    </>
  )
}

export default ChatbotWidget`
  },
  {
    name: "React",
    icon: Smartphone,
    description: "Pure React component",
    // ⚡️ Using same code style as Next.js (not the inline-style version)
    code: `'use client'

import { useState } from "react"

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
          src="https://kosmos.themaskchat.com/chat-bot/1005255797441315"
          className={\`fixed right-0 top-16 w-full h-[calc(100vh-4rem)] z-[9998] shadow-lg border-0 transition-opacity duration-500 \${isLoading ? "opacity-0" : "opacity-100"}\`}
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

      <style jsx>{\`
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
      \`}</style>
    </>
  )
}

export default ChatbotWidget`,
  },
]
