// contexts/video-player-context.tsx
"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface VideoPlayerContextType {
  isModalOpen: boolean
  currentVideoSrc: string | null
  openVideoModal: (src: string) => void
  closeVideoModal: () => void
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined)

export const VideoPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string | null>(null)

  const openVideoModal = useCallback((src: string) => {
    setCurrentVideoSrc(src)
    setIsModalOpen(true)
  }, [])

  const closeVideoModal = useCallback(() => {
    setIsModalOpen(false)
    setCurrentVideoSrc(null)
  }, [])

  return (
    <VideoPlayerContext.Provider value={{ isModalOpen, currentVideoSrc, openVideoModal, closeVideoModal }}>
      {children}
    </VideoPlayerContext.Provider>
  )
}

export const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext)
  if (!context) {
    throw new Error("useVideoPlayer must be used within VideoPlayerProvider")
  }
  return context
}
