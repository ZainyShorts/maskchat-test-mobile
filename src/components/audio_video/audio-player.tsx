// "use client"

// import { useRef, useState } from "react"
// import { Box, IconButton } from "@mui/material"

// export const AudioPlayer = ({ src }: { src: string }) => {
//   const audioRef = useRef<HTMLAudioElement>(null)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [currentTime, setCurrentTime] = useState(0)
//   const [duration, setDuration] = useState(0)

//   const handlePlayPause = () => {
//     if (audioRef.current) {
//       if (isPlaying) audioRef.current.pause()
//       else audioRef.current.play()
//       setIsPlaying(!isPlaying)
//     }
//   }
//   const formatTime = (time: number) => {
//     if (!time || isNaN(time)) return "0:00"
//     const minutes = Math.floor(time / 60)
//     const seconds = Math.floor(time % 60)
//     return `${minutes}:${seconds.toString().padStart(2, "0")}`
//   }

//   return (
    
//     <Box
//   className="
//     flex items-center gap-4 
//     p-4 rounded-2xl 
//     bg-gradient-to-br from-[#6C63FF] to-[#9F8CFF] 
//     text-white shadow-xl
//     backdrop-blur-xl
//     w-[260px]          /* 🚀 Increase width */
//     sm:w-[300px]       /* optional larger on big screens */
//   "
// >
//       <audio
//         ref={audioRef}
//         src={src}
//         onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
//         onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
//         onEnded={() => setIsPlaying(false)}
//       />


//       {/* PLAY / PAUSE */}
//       <IconButton
//         size="small"
//         onClick={handlePlayPause}
//         className="
//           !p-3 rounded-full 
//           bg-white 
//           shadow-[0_0_15px_rgba(255,255,255,0.6)]
//           hover:scale-110 transition
//           h-8
//           w-12
//         "
//       >
//         {isPlaying ? (
//           <i className="tabler-player-pause text-[22px] text-indigo-600" />
//         ) : (
//           <i className="tabler-player-play text-[22px] text-indigo-600" />
//         )}
//       </IconButton>

      

//       {/* TIMELINE */}
//       <Box className="flex-1 flex flex-col gap-1">
//         <Box className="flex justify-between text-[10px] opacity-80">
//           <span>{formatTime(currentTime)}</span>
//           <span>{formatTime(duration)}</span>
//         </Box>

//         <Box className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
//           <Box
//             className="h-full bg-white/80 transition-all"
//             style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
//           />
//         </Box>
//       </Box>
//     </Box>
   
//   )
// }


"use client"

import { useRef, useState, useEffect } from "react"
import { Box, IconButton, Slider, Typography } from "@mui/material"

export const AudioPlayer = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream
      const isAndroid = /android/i.test(userAgent)
      setIsMobile(isIOS || isAndroid)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize audio with mobile compatibility
  useEffect(() => {
    if (!src) {
      setError("No audio source provided")
      return
    }

    const audio = new Audio()
    audioRef.current = audio
    audio.src = src
    
    // iOS requires this for autoplay to work later
    audio.preload = "metadata"
    audio.volume = volume

    const handleLoadedData = () => {
      setDuration(audio.duration || 0)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      // Reset playback for iOS
      if (isMobile) {
        audio.currentTime = 0
      }
    }

    const handleError = (e: any) => {
      console.error("Audio error:", e)
      setIsLoading(false)
      
      // Handle specific errors
      if (audio.error) {
        switch(audio.error.code) {
          case audio.error.MEDIA_ERR_ABORTED:
            setError("Audio playback was aborted")
            break
          case audio.error.MEDIA_ERR_NETWORK:
            setError("Network error loading audio")
            break
          case audio.error.MEDIA_ERR_DECODE:
            setError("Audio format not supported")
            break
          case audio.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            setError("Audio format not supported on this device")
            break
          default:
            setError("Failed to load audio")
        }
      }
    }

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    // For iOS, we need to detect when audio is ready
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener('loadeddata', handleLoadedData)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)

    // iOS specific: preload metadata and allow inline playback
    if (isMobile) {
      audio.setAttribute('playsinline', '')
      audio.setAttribute('webkit-playsinline', '')
    }

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [src, isMobile, volume])

  const handlePlayPause = async () => {
    if (!audioRef.current || isLoading) return

    // On mobile, we need to ensure user has interacted first
    if (!hasUserInteracted) {
      setHasUserInteracted(true)
    }

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        // For iOS/Safari, we need to play from user gesture
        await audioRef.current.play()
        setIsPlaying(true)
        
        // On iOS, sometimes volume needs to be set after play
        if (isMobile) {
          audioRef.current.volume = volume
        }
      }
    } catch (err) {
      console.error("Playback error:", err)
      setError("Cannot play audio. Tap again or check device volume.")
    }
  }

  const handleSeek = (event: Event, newValue: number | number[]) => {
    if (!audioRef.current) return
    const seekTime = newValue as number
    audioRef.current.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = newValue as number
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Mobile-friendly touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation()
    handlePlayPause()
  }

  if (error) {
    return (
      <Box className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 text-white shadow-xl backdrop-blur-xl w-[260px] sm:w-[300px]">
        <IconButton disabled className="!p-3">
          <i className="tabler-alert-circle text-[22px] text-red-300" />
        </IconButton>
        <Typography variant="caption" className="flex-1 text-red-300">
          {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      className="
        flex items-center gap-4 
        p-4 rounded-2xl 
        bg-gradient-to-br from-[#6C63FF] to-[#9F8CFF] 
        text-white shadow-xl
        backdrop-blur-xl
        w-[260px] sm:w-[300px]
        select-none
      "
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <audio
        ref={audioRef}
        src={src}
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={{ display: 'none' }}
      />

      {/* PLAY / PAUSE BUTTON - Mobile optimized */}
      <IconButton
        size="small"
        onClick={handlePlayPause}
        onTouchEnd={(e) => {
          e.preventDefault()
          handlePlayPause()
        }}
        disabled={isLoading}
        className="
          !p-3 rounded-full 
          bg-white 
          shadow-[0_0_15px_rgba(255,255,255,0.6)]
          hover:scale-110 transition-transform
          active:scale-95
          h-12 w-12
          min-h-[48px] min-w-[48px]
          touch-manipulation
        "
        sx={{
          // iOS Safari hover fix
          '@media (hover: none)': {
            '&:hover': {
              transform: 'none'
            }
          }
        }}
      >
        {isLoading ? (
          <i className="tabler-loader-2 text-[22px] text-indigo-600 animate-spin" />
        ) : isPlaying ? (
          <i className="tabler-player-pause text-[22px] text-indigo-600" />
        ) : (
          <i className="tabler-player-play text-[22px] text-indigo-600" />
        )}
      </IconButton>

      {/* TIME AND PROGRESS */}
      <Box className="flex-1 flex flex-col gap-1 min-w-0">
        <Box className="flex justify-between text-[10px] opacity-80">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </Box>

        {/* Progress Slider - Mobile optimized */}
        <Slider
          value={currentTime}
          onChange={handleSeek}
          min={0}
          max={duration || 100}
          size="small"
          disabled={isLoading || !duration}
          sx={{
            color: 'rgba(255,255,255,0.9)',
            height: 4,
            padding: '8px 0',
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
              backgroundColor: '#fff',
              boxShadow: '0 0 8px rgba(255,255,255,0.8)',
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 12px rgba(255,255,255,1)',
              },
              '&.Mui-active': {
                width: 16,
                height: 16,
              },
            },
            '& .MuiSlider-track': {
              backgroundColor: 'rgba(255,255,255,0.9)',
              border: 'none',
            },
            '& .MuiSlider-rail': {
              backgroundColor: 'rgba(255,255,255,0.2)',
            },
            // iOS Safari fixes
            '@media (pointer: coarse)': {
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
              }
            }
          }}
        />

        {/* Volume Control - Hidden on mobile to save space */}
        {/* {!isMobile && (
          <Box className="flex items-center gap-1 mt-1">
            <i className="tabler-volume text-[12px] opacity-70" />
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              min={0}
              max={1}
              step={0.1}
              size="small"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                height: 2,
                '& .MuiSlider-thumb': {
                  width: 10,
                  height: 10,
                  backgroundColor: '#fff',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 4px rgba(255,255,255,0.2)',
                  },
                },
              }}
            />
          </Box>
        )} */}

        {/* Loading indicator */}
        {isLoading && (
          <Typography variant="caption" className="text-xs opacity-70 mt-1">
            Loading audio...
          </Typography>
        )}

        {/* Mobile hint for first interaction */}
        {isMobile && !hasUserInteracted && !isPlaying && (
          <Typography variant="caption" className="text-xs opacity-60 mt-1">
            Tap to play
          </Typography>
        )}
      </Box>
    </Box>
  )
}
