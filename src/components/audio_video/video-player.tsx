
"use client"

import type React from "react"
import { Box } from "@mui/material"
import { VideoModal } from "./video-modal"
import { useVideoPlayer } from "./contexts/video-player-context"

interface VideoPlayerProps {
  src: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const { openVideoModal } = useVideoPlayer()

  return (
    <>
      <Box
        className="flex flex-col gap-2 bg-transparent rounded-lg p-2 max-w-[300px] cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => openVideoModal(src)}
      >
        <video
          src={src}
          className="w-full rounded-md bg-black max-h-[200px] pointer-events-none"
          preload="metadata"
        />

      
      </Box>
    </>
  )
}
