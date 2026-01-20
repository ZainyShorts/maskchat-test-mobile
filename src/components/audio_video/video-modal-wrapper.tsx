// components/audio/video-modal-wrapper.tsx
"use client"

import { useVideoPlayer } from "./contexts/video-player-context"
import { VideoModal } from "./video-modal"

export const VideoModalWrapper = () => {
  const { isModalOpen, currentVideoSrc, closeVideoModal } = useVideoPlayer()

  if (!isModalOpen || !currentVideoSrc) return null

  return <VideoModal src={currentVideoSrc} isOpen={isModalOpen} onClose={closeVideoModal} />
}
