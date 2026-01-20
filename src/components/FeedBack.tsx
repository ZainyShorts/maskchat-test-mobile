"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  Box,
  Container,
  Typography,
  TextField,
  Rating,
  Button,
  Paper,
  Avatar,
  Stack,
  Snackbar,
  Alert,
  Fade,
  Slide,
  Zoom,
  CircularProgress,
  Chip,
  Skeleton,
} from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { keyframes } from "@mui/system"
import CssBaseline from "@mui/material/CssBaseline"
import StarIcon from "@mui/icons-material/Star"
import SendIcon from "@mui/icons-material/Send"
import FavoriteIcon from "@mui/icons-material/Favorite"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"
import BusinessIcon from "@mui/icons-material/Business"
import { getAllBusiness } from "@/api/business"
import { getBaseUrl } from "@/api/vars/vars"

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1", // Indigo
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#06b6d4", // Cyan
      light: "#22d3ee",
      dark: "#0891b2",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#dc2626",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "0 4px 14px rgba(99, 102, 241, 0.15)",
          "&:hover": {
            boxShadow: "0 8px 25px rgba(99, 102, 241, 0.25)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 16,
            backgroundColor: "#f8fafc",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#f1f5f9",
              boxShadow: "0 4px 20px rgba(99, 102, 241, 0.08)",
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
              boxShadow: "0 8px 32px rgba(99, 102, 241, 0.12)",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
})

const floatingAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
`

const pulseAnimation = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`

const sparkleAnimation = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const shimmerAnimation = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const labels: { [index: string]: string } = {
  1: "Very Poor",
  2: "Poor",
  3: "Average",
  4: "Good",
  5: "Excellent",
}

const ratingColors: { [index: string]: string } = {
  1: "#ef4444", // Red
  2: "#f97316", // Orange
  3: "#eab308", // Yellow
  4: "#22c55e", // Green
  5: "#10b981", // Emerald
}

const ratingGradients: { [index: string]: string } = {
  1: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
  2: "linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)",
  3: "linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)",
  4: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
  5: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
}

interface BusinessData {
  id: string
  business_id: string
  contact_number: string
  name: string
  meta_template_url?: string
}

interface FeedbackPayload {
  feedback_message: string
  star: number
  business_id: string
}

interface ApiResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
}

// API function to submit feedback
const submitFeedbackAPI = async (feedbackData: FeedbackPayload): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${getBaseUrl()}feedback/feedback/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(feedbackData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data: data,
      message: "Feedback submitted successfully!",
    }
  } catch (error: any) {
    console.error("API Error:", error)
    return {
      success: false,
      error: error.message || "Failed to submit feedback",
    }
  }
}

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`
}

export default function FeedbackPage() {
  const searchParams = useSearchParams()
  const [rating, setRating] = useState<number | null>(0)
  const [hover, setHover] = useState(-1)
  const [message, setMessage] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showElements, setShowElements] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Get URL parameters
  const urlBusinessId = searchParams.get("business_id")
  // const urlPhoneNumber = searchParams.get("phone_number")

  useEffect(() => {
    fetchBusiness()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      setShowElements(true)
    }
  }, [isLoading])

  const fetchBusiness = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("URL Parameters:", {
        business_id: urlBusinessId,
        // phone_number: urlPhoneNumber,
      })

      const response = await getAllBusiness()
      const businesses = response?.data?.results || []

      if (businesses.length > 0) {
        // Find business by business_id if provided, otherwise use first business
        let selectedBusiness = businesses[0]
        if (urlBusinessId) {
          const foundBusiness = businesses.find((b: any) => b.business_id === urlBusinessId)
          if (foundBusiness) {
            selectedBusiness = foundBusiness
          }
        }

        setBusinessData({
          id: selectedBusiness.id,
          business_id: selectedBusiness.business_id,
          contact_number: selectedBusiness.contact_number,
          name: selectedBusiness.name,
          meta_template_url: selectedBusiness.marketing_template_url,
        })
      } else {
        setError("Business not found")
      }
    } catch (err: any) {
      console.error("Failed to fetch business:", err.message)
      setError("Failed to load business information")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!rating || !message.trim() || !businessData) {
      setSnackbarMessage("Please provide both rating and feedback message")
      setSnackbarSeverity("error")
      setOpenSnackbar(true)
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare feedback payload
      const feedbackPayload: FeedbackPayload = {
        feedback_message: message.trim(),
        star: rating,
        // customer_phone_number: urlPhoneNumber || businessData.contact_number,
        business_id: businessData.business_id,
      }

      console.log("Submitting feedback:", feedbackPayload)

      // Submit feedback to API
      const result = await submitFeedbackAPI(feedbackPayload)

      if (result.success) {
        // Success
        setSnackbarMessage(result.message || "Thank you for your feedback!")
        setSnackbarSeverity("success")
        setOpenSnackbar(true)

        // Reset form
        setRating(0)
        setMessage("")

        console.log("Feedback submitted successfully:", result.data)
      } else {
        // API returned error
        setSnackbarMessage(result.error || "Failed to submit feedback")
        setSnackbarSeverity("error")
        setOpenSnackbar(true)
      }
    } catch (err: any) {
      console.error("Failed to submit feedback:", err)
      setSnackbarMessage("Network error. Please check your connection and try again.")
      setSnackbarSeverity("error")
      setOpenSnackbar(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          }}
        >
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: "center",
              maxWidth: 400,
            }}
          >
            <Typography variant="h5" color="error" mb={2}>
              Error Loading Business
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              {error}
            </Typography>
            <Button variant="contained" onClick={fetchBusiness}>
              Try Again
            </Button>
          </Paper>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: `
            radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 60% 70%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
            linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)
          `,
          backgroundSize: "400% 400%",
          animation: `${gradientAnimation} 20s ease infinite`,
          py: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Enhanced Floating Elements */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "10%",
            animation: `${floatingAnimation} 6s ease-in-out infinite`,
            opacity: 0.1,
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 60, color: "#6366f1" }} />
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            right: "15%",
            animation: `${floatingAnimation} 8s ease-in-out infinite`,
            animationDelay: "2s",
            opacity: 0.1,
          }}
        >
          <FavoriteIcon sx={{ fontSize: 40, color: "#06b6d4" }} />
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: "15%",
            left: "20%",
            animation: `${floatingAnimation} 10s ease-in-out infinite`,
            animationDelay: "4s",
            opacity: 0.08,
          }}
        >
          <StarIcon sx={{ fontSize: 50, color: "#ec4899" }} />
        </Box>

        <Container maxWidth="md">
          <Fade in={showElements} timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 6 },
                borderRadius: 6,
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(99, 102, 241, 0.1)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.8)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, #6366f1, #06b6d4, #ec4899, transparent)",
                  animation: `${shimmerAnimation} 3s ease-in-out infinite`,
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.02) 0%, transparent 50%),
                    radial-gradient(circle at 70% 80%, rgba(6, 182, 212, 0.02) 0%, transparent 50%)
                  `,
                  pointerEvents: "none",
                },
              }}
            >
              {/* Business Header */}
              <Slide direction="down" in={showElements} timeout={800}>
                <Stack direction="row" alignItems="center" spacing={3} mb={6} sx={{ position: "relative", zIndex: 1 }}>
                  <Box sx={{ position: "relative" }}>
                    {isLoading ? (
                      <Skeleton variant="circular" width={90} height={90} />
                    ) : (
                      <>
                        {businessData?.meta_template_url ? (
                          <Avatar
                            src={businessData.meta_template_url}
                            sx={{
                              width: 90,
                              height: 90,
                              boxShadow: "0 12px 40px rgba(99, 102, 241, 0.2)",
                              animation: `${pulseAnimation} 4s ease-in-out infinite`,
                              border: "3px solid rgba(255, 255, 255, 0.8)",
                            }}
                          >
                            <BusinessIcon sx={{ fontSize: 40 }} />
                          </Avatar>
                        ) : (
                          <Avatar
                            sx={{
                              width: 90,
                              height: 90,
                              background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 50%, #ec4899 100%)",
                              fontSize: "2.2rem",
                              fontWeight: "bold",
                              boxShadow: "0 12px 40px rgba(99, 102, 241, 0.2)",
                              animation: `${pulseAnimation} 4s ease-in-out infinite`,
                              border: "3px solid rgba(255, 255, 255, 0.8)",
                            }}
                          >
                            {businessData?.name ? businessData.name.charAt(0).toUpperCase() : <BusinessIcon />}
                          </Avatar>
                        )}
                        <Box
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            animation: `${sparkleAnimation} 2s ease-in-out infinite`,
                          }}
                        >
                          <AutoAwesomeIcon sx={{ fontSize: 24, color: "#f59e0b" }} />
                        </Box>
                      </>
                    )}
                  </Box>
                  <Box>
                    {isLoading ? (
                      <>
                        <Skeleton variant="text" width={200} height={40} />
                        <Skeleton variant="text" width={150} height={24} />
                      </>
                    ) : (
                      <>
                        <Typography
                          variant="h4"
                          component="h1"
                          sx={{
                            background: "linear-gradient(135deg, #1f2937 0%, #6366f1 50%, #06b6d4 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 1,
                          }}
                        >
                          {businessData?.name || "Business Name"}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: "#6b7280",
                          }}
                        >
                          Your feedback shapes our future ✨
                        </Typography>
                      </>
                    )}
                  </Box>
                </Stack>
              </Slide>

              {/* Feedback Form */}
              <Box component="form" onSubmit={handleSubmit} sx={{ position: "relative", zIndex: 1 }}>
                <Zoom in={showElements} timeout={1200}>
                  <Typography
                    variant="h5"
                    component="h2"
                    mb={5}
                    textAlign="center"
                    sx={{
                      background: "linear-gradient(135deg, #1f2937 0%, #6366f1 50%, #06b6d4 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Share Your Amazing Experience
                  </Typography>
                </Zoom>

                {/* Star Rating */}
                <Slide direction="up" in={showElements} timeout={1000}>
                  <Box mb={6}>
                    <Typography
                      variant="h6"
                      component="legend"
                      mb={3}
                      sx={{
                        color: "#1f2937",
                        fontWeight: 600,
                      }}
                    >
                      Rate your experience
                    </Typography>
                    <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                      <Rating
                        name="feedback-rating"
                        value={rating}
                        precision={1}
                        getLabelText={getLabelText}
                        onChange={(event, newValue) => {
                          setRating(newValue)
                        }}
                        onChangeActive={(event, newHover) => {
                          setHover(newHover)
                        }}
                        emptyIcon={<StarIcon style={{ opacity: 0.2, color: "#d1d5db" }} fontSize="inherit" />}
                        size="large"
                        disabled={isLoading}
                        sx={{
                          "& .MuiRating-iconFilled": {
                            color: ratingColors[hover !== -1 ? hover : rating || 1],
                            transform: "scale(1.1)",
                            filter: `drop-shadow(0 2px 8px ${ratingColors[hover !== -1 ? hover : rating || 1]}40)`,
                          },
                          "& .MuiRating-iconHover": {
                            transform: "scale(1.3)",
                            transition: "transform 0.2s ease",
                          },
                          "& .MuiRating-icon": {
                            fontSize: "2.5rem",
                          },
                        }}
                      />
                      {rating !== null && rating > 0 && (
                        <Fade in timeout={300}>
                          <Chip
                            label={labels[hover !== -1 ? hover : rating]}
                            sx={{
                              background: ratingGradients[hover !== -1 ? hover : rating],
                              color: ratingColors[hover !== -1 ? hover : rating],
                              fontWeight: 700,
                              fontSize: "0.9rem",
                              px: 2,
                              py: 1,
                              boxShadow: `0 4px 16px ${ratingColors[hover !== -1 ? hover : rating]}20`,
                              animation: `${pulseAnimation} 2s ease-in-out infinite`,
                              border: `2px solid ${ratingColors[hover !== -1 ? hover : rating]}40`,
                            }}
                          />
                        </Fade>
                      )}
                    </Box>
                  </Box>
                </Slide>

                {/* Message Text Area */}
                <Slide direction="up" in={showElements} timeout={1200}>
                  <Box mb={6}>
                    <Typography
                      variant="h6"
                      component="label"
                      mb={3}
                      display="block"
                      sx={{
                        color: "#1f2937",
                        fontWeight: 600,
                      }}
                    >
                      Tell us more about your experience
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      variant="outlined"
                      placeholder="Share your thoughts, suggestions, or any feedback you'd like us to know... ✍️"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isLoading}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "#1f2937",
                          "& fieldset": {
                            borderColor: "#e5e7eb",
                            borderWidth: "2px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#6366f1",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#6366f1",
                          },
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "#9ca3af",
                        },
                      }}
                    />
                  </Box>
                </Slide>

                {/* Submit Button */}
                <Slide direction="up" in={showElements} timeout={1400}>
                  <Box textAlign="center">
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={!rating || !message.trim() || isSubmitting || isLoading}
                      sx={{
                        px: 6,
                        py: 2.5,
                        fontSize: "1.2rem",
                        background:
                          isSubmitting || isLoading
                            ? "#9ca3af"
                            : "linear-gradient(135deg, #6366f1 0%, #06b6d4 50%, #ec4899 100%)",
                        color: "white",
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                          background: "linear-gradient(135deg, #4f46e5 0%, #0891b2 50%, #db2777 100%)",
                          transform: "translateY(-2px)",
                        },
                        "&:active": {
                          transform: "translateY(0px)",
                        },
                        transition: "all 0.3s ease",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: "-100%",
                          width: "100%",
                          height: "100%",
                          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                          transition: "left 0.5s",
                        },
                        "&:hover::before": {
                          left: "100%",
                        },
                      }}
                    >
                      {isSubmitting ? (
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <CircularProgress size={24} sx={{ color: "white" }} />
                          <span>Submitting...</span>
                        </Stack>
                      ) : (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <span>Submit Feedback</span>
                          <SendIcon />
                        </Stack>
                      )}
                    </Button>
                  </Box>
                </Slide>

                {/* Thank You Message */}
                <Fade in={showElements} timeout={1600}>
                  <Box mt={5} textAlign="center">
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6b7280",
                      }}
                    >
                      Thank you for taking the time to share your feedback with us! 🙏
                    </Typography>
                  </Box>
                </Fade>
              </Box>
            </Paper>
          </Fade>
        </Container>

        {/* Enhanced Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={Slide}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            variant="filled"
            sx={{
              width: "100%",
              background:
                snackbarSeverity === "success"
                  ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              boxShadow:
                snackbarSeverity === "success"
                  ? "0 8px 32px rgba(16, 185, 129, 0.3)"
                  : "0 8px 32px rgba(239, 68, 68, 0.3)",
              "& .MuiAlert-icon": {
                color: "white",
              },
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}
