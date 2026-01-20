// "use client"

// import type React from "react"
// import { useEffect } from "react"
// import { X, AlertTriangle } from "lucide-react"

// interface ConfirmationModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onConfirm: () => void
//   title: string
//   message?: string
// }

// export default function ConfirmationModal({
//   isOpen,
//   onClose,
//   onConfirm,
//   title,
//   message = "Are you sure you want to proceed?",
// }: ConfirmationModalProps) {
//   // Play sound when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       // Create a simple notification sound
//       const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
//       const oscillator = audioContext.createOscillator()
//       const gainNode = audioContext.createGain()

//       oscillator.connect(gainNode)
//       gainNode.connect(audioContext.destination)

//       oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
//       oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)

//       gainNode.gain.setValueAtTime(0, audioContext.currentTime)
//       gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
//       gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

//       oscillator.start(audioContext.currentTime)
//       oscillator.stop(audioContext.currentTime + 0.2)
//     }
//   }, [isOpen])

//   // Prevent scrolling when modal is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden"
//     } else {
//       document.body.style.overflow = "unset"
//     }

//     return () => {
//       document.body.style.overflow = "unset"
//     }
//   }, [isOpen])

//   // Handle escape key press
//   useEffect(() => {
//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         onClose()
//       }
//     }

//     if (isOpen) {
//       document.addEventListener("keydown", handleEscape)
//     }

//     return () => {
//       document.removeEventListener("keydown", handleEscape)
//     }
//   }, [isOpen, onClose])

//   if (!isOpen) return null

//   const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       onClose()
//     }
//   }

//   const handleConfirm = () => {
//     onConfirm()
//     onClose()
//   }

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4  cursor-pointer"
//       onClick={handleBackdropClick}
//     >
//       <div
//         className="relative w-full max-w-md mx-auto bg-gradient-to-br from-[#26293C] to-[#1f2332] rounded-2xl shadow-2xl border border-gray-500/20 animate-in fade-in-0 zoom-in-95 duration-300 cursor-default transform-gpu"
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)",
//         }}
//       >
//         {/* Subtle top border accent */}
//         <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[#7368F0] to-transparent rounded-b-full"></div>

//         {/* Header */}
//         <div className="flex items-center justify-between p-6 pb-4">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#7368F0]/10 border border-[#7368F0]/20">
//               <AlertTriangle className="w-5 h-5 text-[#7368F0]" />
//             </div>
//             <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 h-8 rounded-full hover:bg-white/5 transition-all duration-200 cursor-pointer group"
//           >
//             <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="px-6 pb-6">
//           <p className="text-gray-300 text-base leading-relaxed pl-13">{message}</p>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-white/5 bg-white/[0.02] rounded-b-2xl">
//           <button
//             onClick={onClose}
//             className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-transparent border border-gray-500/30 rounded-lg hover:bg-white/5 hover:text-white hover:border-gray-400/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:ring-offset-2 focus:ring-offset-[#26293C] cursor-pointer"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleConfirm}
//             className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#7368F0] to-[#6159E8] rounded-lg hover:from-[#6159E8] hover:to-[#5a4fd7] hover:shadow-lg hover:shadow-[#7368F0]/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7368F0]/50 focus:ring-offset-2 focus:ring-offset-[#26293C] cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
//           >
//             Confirm
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useEffect } from "react"
import { X, AlertTriangle } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message?: string
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message = "Are you sure you want to proceed?",
}: ConfirmationModalProps) {
  // Play sound when modal opens
  useEffect(() => {
    if (isOpen) {
      // Create a simple notification sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    }
  }, [isOpen])

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4  cursor-pointer"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-md mx-auto bg-gradient-to-br from-[#26293C] to-[#1f2332] rounded-2xl shadow-2xl border border-gray-500/20 animate-in fade-in-0 zoom-in-95 duration-300 cursor-default transform-gpu"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Subtle top border accent */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[#7368F0] to-transparent rounded-b-full"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#7368F0]/10 border border-[#7368F0]/20">
              <AlertTriangle className="w-5 h-5 text-[#7368F0]" />
            </div>
            <h2 className="text-xl font-semibold text-white tracking-tight">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 h-8 rounded-full hover:bg-white/5 transition-all duration-200 cursor-pointer group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-gray-300 text-base leading-relaxed pl-13">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-white/5 bg-white/[0.02] rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-transparent border border-gray-500/30 rounded-lg hover:bg-white/5 hover:text-white hover:border-gray-400/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:ring-offset-2 focus:ring-offset-[#26293C] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#7368F0] to-[#6159E8] rounded-lg hover:from-[#6159E8] hover:to-[#5a4fd7] hover:shadow-lg hover:shadow-[#7368F0]/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7368F0]/50 focus:ring-offset-2 focus:ring-offset-[#26293C] cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
