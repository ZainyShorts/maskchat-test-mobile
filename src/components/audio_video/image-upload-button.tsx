"use client"

import type React from "react"
import { useRef, useState } from "react"
import IconButton from "@mui/material/IconButton"
import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"

interface ImageUploadButtonProps {
  onImagesSelected: (files: File[]) => void
  maxImages?: number
  disabled?: boolean
  isLoading?: boolean
}

export const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  onImagesSelected,
  maxImages = 1,
  disabled = false,
  isLoading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_SIZE = {
  image: 5 * 1024 * 1024,       // 5 MB
  video: 16 * 1024 * 1024,      // 16 MB
  audio: 16 * 1024 * 1024,      // 16 MB
  document: 100 * 1024 * 1024,  // 100 MB
}

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(event.target.files || [])

  if (files.length === 0) return

  const finalFiles: File[] = []

  files.forEach((file) => {
    // Images
    if (file.type.startsWith("image/")) {
      if (file.size > MAX_SIZE.image) {
        alert("🖼️ Image is too large. Maximum allowed size is 5MB.")
        return
      }
      finalFiles.push(file)

    // Videos
    } else if (file.type.startsWith("video/")) {
      if (file.size > MAX_SIZE.video) {
        alert("🎥 Video is too large. Maximum allowed size is 16MB.")
        return
      }
      finalFiles.push(file)

    // Audio
    } else if (file.type.startsWith("audio/")) {
      if (file.size > MAX_SIZE.audio) {
        alert("🎧 Audio is too large. Maximum allowed size is 16MB.")
        return
      }
      finalFiles.push(file)

    // Documents
    } else if (
      [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",       // XLSX
        "text/csv",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
        "application/zip"
      ].includes(file.type)
    ) {
      if (file.size > MAX_SIZE.document) {
        alert("📄 Document is too large. Maximum allowed size is 100MB.")
        return
      }
      finalFiles.push(file)

    // Unsupported type
    } else {
      alert(`❌ ${file.name} is not a supported file type.`)
    }
  })

  if (finalFiles.length === 0) return

  // Limit images only if needed
  const limitedFiles = finalFiles.slice(0, maxImages)
  console.log("finalFiles", limitedFiles)
  onImagesSelected(limitedFiles)
}


 

  return (
    <>
      <input
  ref={fileInputRef}
  type="file"
  accept="image/jpeg,image/png,image/jpg,video/mp4,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,audio/mpeg,audio/ogg,audio/wav"
  onChange={handleFileChange}
  style={{ display: "none" }}
  disabled={disabled}
/>


      <Box className="flex items-center gap-2">
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isLoading}
          size="small"
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <i className="tabler-photo-plus text-gray-600 dark:text-gray-300" />
          )}
        </IconButton>

        
      </Box>

      
    </>
  )
}
