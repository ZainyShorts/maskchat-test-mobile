"use client"

import type React from "react"
import { useRef, useState } from "react"

interface VideoModalProps {
  src: string
  isOpen: boolean
  onClose: () => void
}

export const VideoModal: React.FC<VideoModalProps> = ({ src, isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5)
    }
  }

  const handleForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration)
  }

  const handleProgressBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed  inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pl-64">
        <div className="bg-[#0e0e0e]/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-[70vw] max-h-[92vh] flex flex-col overflow-hidden relative">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition"
          >
            ✕
          </button>

          {/* VIDEO */}
          <div className="relative group ">
            <video
              ref={videoRef}
              src={src}
              className="w-full max-h-[70vh] py-12 rounded-xl object-contain bg-black"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={handlePlayPause}
            />

            {/* Center Play Button (only when paused) */}
            {!isPlaying && (
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 m-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-[0_0_25px_rgba(0,0,0,0.6)] flex items-center justify-center text-white hover:scale-110 transition transform"
              >
                ▶
              </button>
            )}
          </div>

                {/* Controls Bar */}
<div className="p-4 space-y-4 bg-black/40 backdrop-blur-xl border-t border-white/10">

  {/* PROGRESS BAR */}
  <div className="flex items-center gap-3">
    <input
  type="range"
  min="0"
  max={duration || 0}
  value={currentTime}
  onChange={handleProgressBarChange}
  className="flex-1 h-2 appearance-none rounded-lg cursor-pointer no-thumb"
  style={{
    background: `linear-gradient(to right, #6366f1 0%, #8b5cf6 ${
      (currentTime / duration) * 100
    }%, #444 ${
      (currentTime / duration) * 100
    }%, #444 100%)`,
  }}
/>
    
    <span className="text-white text-xs">
      {formatTime(currentTime)} / {formatTime(duration)}
    </span>
  </div>

  {/* BEAUTIFUL CONTROL BUTTONS */}
  <div className="flex items-center justify-between px-4">

    {/* Close Modal Button */}
    <button
      onClick={onClose}
      className="px-4 py-2 rounded-xl bg-red-600/60 text-white text-sm font-medium 
                 backdrop-blur-md hover:bg-red-600 hover:scale-105 transition duration-200 shadow-lg cursor-pointer"
    >
      Close
    </button>

    {/* Main control buttons */}
    <div className="flex items-center gap-6">

      {/* Rewind */}
      <button
        onClick={handleRewind}
        className="w-12 h-12 flex items-center justify-center rounded-full 
                   bg-white/10 backdrop-blur-md text-white hover:bg-white/20 
                   hover:scale-110 shadow-xl transition cursor-pointer"
      >
        ⏪
      </button>

      {/* Play / Pause */}
      <button
        onClick={handlePlayPause}
        className="w-14 h-14 flex items-center justify-center rounded-full text-3xl
                   bg-gradient-to-br from-indigo-500 to-purple-600 
                   shadow-[0_0_20px_rgba(99,102,241,0.7)] 
                   text-white hover:scale-110 transition cursor-pointer"
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      {/* Forward */}
      <button
        onClick={handleForward}
        className="w-12 h-12 flex items-center justify-center rounded-full 
                   bg-white/10 backdrop-blur-md text-white hover:bg-white/20 
                   hover:scale-110 shadow-xl transition cursor-pointer"
      >
        ⏩
      </button>
    </div>
  </div>
</div>

        </div>
      </div>
    </>
  )
}
