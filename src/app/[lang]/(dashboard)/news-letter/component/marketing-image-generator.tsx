"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Chip,
} from "@mui/material"
import { AutoAwesome, Download, Refresh, Image as ImageIcon, AccountBalanceWallet } from "@mui/icons-material"
import { getBaseUrl } from "@/api/vars/vars"

interface ImageGenerationResponse {
  image_url?: string
  charged_usd?: string
  remaining_balance_usd?: string
  error?: string
  available_usd?: string
  required_usd?: string
}

export function MarketingImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<{ message: string; type: "error" | "warning" } | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${getBaseUrl()}newsletter/generate-newsletter-image/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ prompt }),
      })

      const data: ImageGenerationResponse = await response.json()

      if (data.error) {
        if (data.error === "Insufficient wallet balance") {
          setError({
            message: `Insufficient credits. Available: ${data.available_usd || "0.00"}${data.required_usd ? `. Required: ${data.required_usd}` : ""}`,
            type: "warning",
          })
        } else {
          setError({ message: data.error, type: "error" })
        }
        return
      }

      if (data.image_url) {
        setGeneratedImage(data.image_url)
        if (data.remaining_balance_usd) {
          setBalance(data.remaining_balance_usd)
        }
      }
    } catch (err) {
      setError({ message: "Failed to connect to image generation service.", type: "error" })
    } finally {
      setIsGenerating(false)
    }
  }


  const handleDownload = () => {
    window.location.href = `/api/download?url=${encodeURIComponent(generatedImage!)}`
  }


  const handleReset = () => {
    setGeneratedImage(null)
    setPrompt("")
    setError(null)
  }

  return (
    <Card variant="outlined" sx={{ mb: 4, overflow: "hidden", borderRadius: 3 }}>
      <Box
        sx={{
          p: 2,
          bgcolor: "rgba(0,0,0,0.02)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <AutoAwesome color="primary" fontSize="small" />
          <Typography variant="subtitle2" fontWeight="bold">
            AI Marketing Image Generator
          </Typography>
        </Stack>
        {balance && (
          <Chip
            icon={<AccountBalanceWallet sx={{ fontSize: "14px !important" }} />}
            label={`Credits: ${balance}`}
            size="small"
            variant="outlined"
            color="success"
          />
        )}
      </Box>
      <Divider />
      <CardContent>
        {!generatedImage ? (
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              Generate custom high-quality images for your restaurant marketing. Be specific for better results.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="e.g., Luxury restaurant marketing banner with elegant table setting, soft warm lighting, and gourmet dishes..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            {error && (
              <Alert severity={error.type} variant="outlined" sx={{ borderRadius: 2 }}>
                {error.message}
              </Alert>
            )}
            <Button
              variant="contained"
              disableElevation
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
              sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
            >
              {isGenerating ? "Generating Magic..." : "Generate Image"}
            </Button>
          </Stack>
        ) : (
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                width: "100%",
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                position: "relative",
                aspectRatio: "16/9",
                bgcolor: "#f5f5f5",
              }}
            >
              <img
                src={generatedImage || "/placeholder.svg"}
                alt="Generated marketing asset"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>

            <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleReset}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Generate New
              </Button>
              <Button
                fullWidth
                variant="contained"
                disableElevation
                startIcon={<Download />}
                onClick={()=>{handleDownload()}}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
              >
                Download Image
              </Button>
            </Stack>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <ImageIcon fontSize="inherit" /> Image generated and ready for your newsletter
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
