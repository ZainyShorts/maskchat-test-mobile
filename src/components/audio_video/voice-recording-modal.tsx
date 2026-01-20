"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import CircularProgress from "@mui/material/CircularProgress"

interface VoiceRecordingModalProps {
  open: boolean
  onClose: () => void
  onSend: (audioFile: File) => void
  isLoading?: boolean
}

export const VoiceRecordingModal: React.FC<VoiceRecordingModalProps> = ({
  open,
  onClose,
  onSend,
  isLoading = false,
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Start recording
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setRecordedAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start recording timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Could not access microphone. Please check permissions.")
    }
  }

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }

  // Play recorded audio
  const handlePlayAudio = () => {
  if (!audioRef.current) return
  audioRef.current.play()
  setIsPlaying(true)
}

  // Pause audio
  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  // Stop audio playback and restart
  const handleStopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      setPlaybackTime(0)
    }
  }

  // Restart recording
  const handleRestartRecording = () => {
    setRecordedAudio(null)
    setIsPlaying(false)
    setRecordingTime(0)
    setPlaybackTime(0)
    setDuration(0)

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  // Handle send
  const handleSend = () => {
    if (!recordedAudio) return

    const file = new File([recordedAudio], `voice-message-${Date.now()}.wav`, {
      type: "audio/wav",
    })

    onSend(file)
    handleRestartRecording()
  }

 
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      handleStopRecording()
      handleStopPlayback()
      handleRestartRecording()
    }
  }, [open])

 
useEffect(() => {
  if (!recordedAudio || !audioRef.current) return

  const audio = audioRef.current
  const url = URL.createObjectURL(recordedAudio)
  audio.src = url

  const updatePlaybackTime = () => {
    setPlaybackTime(Math.floor(audio.currentTime))
  }

  const handleLoadedMetadata = () => {
    setDuration(Math.floor(audio.duration))
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setPlaybackTime(0)
  }

  audio.addEventListener("timeupdate", updatePlaybackTime)
  audio.addEventListener("loadedmetadata", handleLoadedMetadata)
  audio.addEventListener("ended", handleEnded)

  return () => {
    audio.removeEventListener("timeupdate", updatePlaybackTime)
    audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
    audio.removeEventListener("ended", handleEnded)
  }
}, [recordedAudio])

  const hasRecording = recordedAudio !== null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Record Voice Message</DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Recording Controls */}
          {!hasRecording ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Typography variant="body2" color="textSecondary">
                {isRecording ? "Recording in progress..." : "Ready to record"}
              </Typography>

              {recordingTime > 0 && (
                <Typography variant="h5" sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                    {formatTime(recordingTime)}
                </Typography>
                )}

              <Box sx={{ display: "flex", gap: 1 }}>
                {!isRecording ? (
                  <IconButton
                    onClick={handleStartRecording}
                    sx={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      width: 56,
                      height: 56,
                      "&:hover": { backgroundColor: "#dc2626" },
                    }}
                  >
                    <i className="tabler-microphone text-xl" />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={handleStopRecording}
                    sx={{
                      backgroundColor: "#6366f1",
                      color: "white",
                      width: 56,
                      height: 56,
                      "&:hover": { backgroundColor: "#4f46e5" },
                    }}
                  >
                    <i className="tabler-square-filled text-xl" />
                  </IconButton>
                )}
              </Box>
            </Box>
          ) : (
            <>
              {/* Playback Controls */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Playback
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {!isPlaying ? (
                    <IconButton
                      onClick={handlePlayAudio}
                      size="small"
                      sx={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        width: 44,
                        height: 44,
                        "&:hover": { backgroundColor: "#2563eb" },
                      }}
                    >
                      <i className="tabler-player-play text-lg" />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={handlePauseAudio}
                      size="small"
                      sx={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        width: 44,
                        height: 44,
                        "&:hover": { backgroundColor: "#2563eb" },
                      }}
                    >
                      <i className="tabler-player-pause text-lg" />
                    </IconButton>
                  )}

                  <IconButton
                    onClick={handleStopPlayback}
                    size="small"
                    sx={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      width: 44,
                      height: 44,
                      "&:hover": { backgroundColor: "#4b5563" },
                    }}
                  >
                    <i className="tabler-player-stop text-lg" />
                  </IconButton>

                  <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                    {formatTime(playbackTime)} / {formatTime(duration)}
                  </Typography>
                </Box>

                {/* Audio element for playback */}
                <audio ref={audioRef} />

                {/* Progress bar */}
                <Box
                  sx={{
                    width: "100%",
                    height: 4,
                    backgroundColor: "#e5e7eb",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      backgroundColor: "#3b82f6",
                      width: `${duration > 0 ? (playbackTime / duration) * 100 : 0}%`,
                      transition: "width 0.1s linear",
                    }}
                  />
                </Box>
              </Box>

              {/* Restart button */}
              <Button
                variant="outlined"
                onClick={handleRestartRecording}
                fullWidth
                sx={{ color: "#ef4444", borderColor: "#ef4444" }}
              >
                <i className="tabler-redo mr-2" />
                Restart Recording
              </Button>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSend} variant="contained" disabled={!hasRecording || isLoading} sx={{ minWidth: 100 }}>
          {isLoading ? <CircularProgress size={20} color="inherit" /> : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

