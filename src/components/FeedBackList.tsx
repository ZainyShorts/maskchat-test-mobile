
// "use client"
// import { useState, useEffect, useCallback } from "react"
// import {
//   Box,
//   Container,
//   Typography,
//   Rating,
//   Button,
//   Paper,
//   Avatar,
//   Stack,
//   Snackbar,
//   Alert,
//   Skeleton,
//   CircularProgress,
//   IconButton,
//   Grid,
// } from "@mui/material"
// import { useTheme } from "@mui/material/styles" // Changed: Import useTheme
// import StarIcon from "@mui/icons-material/Star"
// import BusinessIcon from "@mui/icons-material/Business"
// import DeleteIcon from "@mui/icons-material/Delete"
// import { getAllBusiness } from "@/api/business"
// import { getFeedbackByBusinessId, deleteFeedback } from "@/api/feedback"
// import ConfirmationModal from "./dialogs/confirm-modal"

// // Interfaces for data
// interface BusinessData {
//   id: string
//   business_id: string
//   contact_number: string
//   name: string
//   marketing_template_url?: string
// }

// interface FeedbackItem {
//   id: number
//   feedback_message: string
//   star: number
//   customer_phone_number: string
//   business_id: string
//   created_at: string
// }


// // Rating colors for card borders/accents based on screenshot
// const ratingAccentColors: { [index: number]: string } = {
//   1: "#ef4444", // Red
//   2: "#f97316", // Orange
//   3: "#eab308", // Yellow
//   4: "#ef4444", // Red, as per screenshot for 4 stars
//   5: "#10b981", // Emerald, as per screenshot for 5 stars
// }

// export default function FeedbackListPage() {
//   const [businessData, setBusinessData] = useState<BusinessData | null>(null)
//   const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([])
//   const [isLoadingBusiness, setIsLoadingBusiness] = useState(true)
//   const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [openSnackbar, setOpenSnackbar] = useState(false)
//   const [snackbarMessage, setSnackbarMessage] = useState("")
//   const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")
//   const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
//   const [feedbackToDeleteId, setFeedbackToDeleteId] = useState<number | null>(null)

//   const theme = useTheme() // Changed: Use useTheme hook

//   const fetchInitialData = useCallback(async () => {
//     try {
//       setIsLoadingBusiness(true)
//       setError(null)
//       const businessResponse = await getAllBusiness()
//       const firstBusiness = businessResponse.data.results[0]
//       setBusinessData({
//         id: firstBusiness.id,
//         business_id: firstBusiness.business_id,
//         contact_number: firstBusiness.contact_number,
//         name: firstBusiness.name,
//         marketing_template_url: firstBusiness.marketing_template_url,
//       })
//       await fetchFeedback(firstBusiness.business_id)
//     } catch (err: any) {
//       console.error("Failed to fetch initial data:", err)
//       setError(err.message || "Failed to load business and feedback information.")
//       setSnackbarMessage(err.message || "Failed to load data.")
//       setSnackbarSeverity("error")
//       setOpenSnackbar(true)
//     } finally {
//       setIsLoadingBusiness(false)
//     }
//   }, [])

//   const fetchFeedback = useCallback(async (businessId: string) => {
//     setIsLoadingFeedback(true)
//     try {
//       const feedbackResponse = await getFeedbackByBusinessId(businessId)
//       if (!feedbackResponse.success) {
//         throw new Error(feedbackResponse.error || "Failed to fetch feedback.")
//       }
//       setFeedbackData(feedbackResponse.data || [])
//     } catch (err: any) {
//       console.error("Failed to fetch feedback:", err)
//       setError(err.message || "Failed to load feedback.")
//       setSnackbarMessage(err.message || "Failed to load feedback.")
//       setSnackbarSeverity("error")
//       setOpenSnackbar(true)
//     } finally {
//       setIsLoadingFeedback(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchInitialData()
//   }, [fetchInitialData])

//   const handleDeleteClick = (id: number) => {
//     setFeedbackToDeleteId(id)
//     setOpenConfirmDelete(true)
//   }

//   const handleConfirmDelete = async () => {
//     if (feedbackToDeleteId === null) return
//     setOpenConfirmDelete(false)
//     setIsLoadingFeedback(true)
//     try {
//       const result = await deleteFeedback(feedbackToDeleteId)
//       if (result.success) {
//         setSnackbarMessage(result.message || "Feedback deleted successfully!")
//         setSnackbarSeverity("success")
//         setOpenSnackbar(true)
//         if (businessData?.business_id) {
//           await fetchFeedback(businessData.business_id)
//         }
//       } else {
//         throw new Error(result.error || "Failed to delete feedback.")
//       }
//     } catch (err: any) {
//       console.error("Error deleting feedback:", err)
//       setSnackbarMessage(err.message || "Failed to delete feedback.")
//       setSnackbarSeverity("error")
//       setOpenSnackbar(true)
//     } finally {
//       setIsLoadingFeedback(false)
//       setFeedbackToDeleteId(null)
//     }
//   }

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false)
//   }

//   if (isLoadingBusiness) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           background: theme.palette.background.default, // Changed: Use theme.palette
//           p: 4,
//         }}
//       >
//         <CircularProgress sx={{ mb: 3 }} />
//         <Typography variant="h6" color="text.secondary">
//           Loading business data...
//         </Typography>
//         <Skeleton variant="rectangular" width="80%" height={200} sx={{ mt: 4, borderRadius: 2 }} />
//       </Box>
//     )
//   }

//   if (error) {
//     return (
//       // Removed ThemeProvider and CssBaseline
//       <Box
//         sx={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           background: theme.palette.background.default, // Changed: Use theme.palette
//           p: 4,
//         }}
//       >
//         <Paper
//           sx={{
//             p: 4,
//             borderRadius: 4,
//             textAlign: "center",
//             maxWidth: 400,
//             boxShadow:
//               theme.palette.mode === "dark" ? "0 8px 24px rgba(255,255,255,0.1)" : "0 8px 24px rgba(0,0,0,0.1)", // Changed: Theme-aware shadow
//             backgroundColor: theme.palette.background.paper, // Changed: Use theme.palette
//           }}
//         >
//           <Typography variant="h5" color="error" mb={2}>
//             Error
//           </Typography>
//           <Typography variant="body1" color="text.secondary" mb={3}>
//             {error}
//           </Typography>
//           <Button variant="contained" onClick={fetchInitialData}>
//             Try Again
//           </Button>
//         </Paper>
//       </Box>
//     )
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: theme.palette.background.default, // Changed: Use theme.palette
//         py: 4, // Reduced vertical padding
//         px: { xs: 2, md: 4 },
//       }}
//     >
//       <Container maxWidth="md">
//         <Paper
//           elevation={0}
//           sx={{
//             p: { xs: 3, md: 6 },
//             borderRadius: 4, // Slightly less rounded than before to match screenshot
//             background: theme.palette.background.paper, // Changed: Use theme.palette
//             border: `1px solid ${theme.palette.divider}`, // Changed: Use theme.palette
//             boxShadow:
//               theme.palette.mode === "dark" ? "0 4px 12px rgba(255,255,255,0.05)" : "0 4px 12px rgba(0, 0, 0, 0.05)", // Changed: Theme-aware shadow
//             mb: 6,
//             position: "relative", // For the gear icon positioning
//           }}
//         >
//           {/* Gear Icon */}
//           <IconButton
//             sx={{
//               position: "absolute",
//               top: 16,
//               right: 16,
//               color: theme.palette.text.secondary, // Changed: Use theme.palette
//             }}
//             aria-label="settings"
//           ></IconButton>
//           {/* Business Header */}
//           <Stack direction="row" alignItems="center" spacing={3} mb={6}>
//             <Box sx={{ position: "relative" }}>
//               {businessData?.marketing_template_url ? (
//                 <Avatar
//                   src={businessData.marketing_template_url}
//                   sx={{
//                     width: 90,
//                     height: 90,
//                     boxShadow: `0 12px 40px ${theme.palette.primary.main}33`, // Changed: Theme-aware shadow
//                     border: `3px solid ${theme.palette.background.paper}`, // Changed: Use theme.palette
//                   }}
//                 >
//                   <BusinessIcon sx={{ fontSize: 40 }} />
//                 </Avatar>
//               ) : (
//                 <Avatar
//                   sx={{
//                     width: 90,
//                     height: 90,
//                     background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.error.main} 100%)`, // Changed: Use theme.palette for gradient
//                     fontSize: "2.2rem",
//                     fontWeight: "bold",
//                     boxShadow: `0 12px 40px ${theme.palette.primary.main}33`, // Changed: Theme-aware shadow
//                     border: `3px solid ${theme.palette.background.paper}`, // Changed: Use theme.palette
//                   }}
//                 >
//                   {businessData?.name ? businessData.name.charAt(0).toUpperCase() : <BusinessIcon />}
//                 </Avatar>
//               )}
//             </Box>
//             <Box>
//               <Typography
//                 variant="h4"
//                 component="h1"
//                 sx={{
//                   background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`, // Changed: Use theme.palette
//                   backgroundClip: "text",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   mb: 1,
//                 }}
//               >
//                 {businessData?.name || "Business Name"}
//               </Typography>
//               <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
//                 Feedback Overview
//               </Typography>
//             </Box>
//           </Stack>
//           <Typography
//             variant="h5"
//             component="h2"
//             mb={4}
//             textAlign="center"
//             sx={{ color: theme.palette.text.primary }} // Changed: Use theme.palette
//           >
//             Customer Feedbacks
//           </Typography>
//           {isLoadingFeedback ? (
//             <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6 }}>
//               <CircularProgress sx={{ mb: 3 }} />
//               <Typography variant="h6" color="text.secondary">
//                 Loading feedback...
//               </Typography>
//               <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 4, borderRadius: 2 }} />
//               <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 2, borderRadius: 2 }} />
//             </Box>
//           ) : feedbackData.length === 0 ? (
//             <Box sx={{ textAlign: "center", py: 6 }}>
//               <Typography variant="h6" color="text.secondary">
//                 No feedback available for this business yet.
//               </Typography>
//             </Box>
//           ) : (
//             <Grid container spacing={3}>
//               {feedbackData.map((feedback) => (
//                 <Grid item xs={12} sm={6} md={6} key={feedback.id}>
//                   <Paper
//                     sx={{
//                       p: 3,
//                       borderRadius: 2, // Slightly less rounded for feedback cards
//                       border: `1px solid ${ratingAccentColors[feedback.star] || theme.palette.divider}`, // Changed: Use theme.palette for fallback
//                       boxShadow:
//                         theme.palette.mode === "dark"
//                           ? "0 2px 8px rgba(255,255,255,0.05)"
//                           : "0 2px 8px rgba(0,0,0,0.05)", // Changed: Theme-aware shadow
//                       position: "relative",
//                       backgroundColor: theme.palette.background.paper, // Changed: Use theme.palette
//                       "&:hover": {
//                         boxShadow:
//                           theme.palette.mode === "dark"
//                             ? "0 4px 16px rgba(255,255,255,0.08)"
//                             : "0 4px 16px rgba(0,0,0,0.08)", // Changed: Theme-aware shadow
//                         transform: "translateY(-2px)",
//                         transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
//                       },
//                     }}
//                   >
//                     <IconButton
//                       aria-label="delete feedback"
//                       onClick={() => handleDeleteClick(feedback.id)}
//                       sx={{
//                         position: "absolute",
//                         top: 12,
//                         right: 12,
//                         color: theme.palette.error.main, // Changed: Use theme.palette
//                         "&:hover": {
//                           backgroundColor:
//                             theme.palette.mode === "dark" ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.08)", // Changed: Theme-aware hover background
//                         },
//                       }}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                     <Stack direction="row" alignItems="center" spacing={1} mb={1}>
//                       <Rating
//                         value={feedback.star}
//                         readOnly
//                         precision={1}
//                         emptyIcon={<StarIcon style={{ opacity: 0.2 }} fontSize="inherit" />}
//                         sx={{
//                           "& .MuiRating-iconFilled": {
//                             color: "#10b981", // Always green for filled stars as per screenshot
//                           },
//                         }}
//                       />
//                       <Typography variant="body2" color="text.secondary">
//                         ({feedback.star} Star{feedback.star !== 1 ? "s" : ""})
//                       </Typography>
//                     </Stack>
//                     <Typography variant="body1" mb={2} sx={{ color: theme.palette.text.primary }}>
//                       {feedback.feedback_message}
//                     </Typography>
                    
//                     <Typography variant="caption" color="text.disabled" mt={1}>
//                       Submitted on: {new Date(feedback.created_at).toLocaleDateString()}
//                     </Typography>
//                   </Paper>
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//         </Paper>
//       </Container>
//       {/* Snackbar for messages */}
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled" sx={{ width: "100%" }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//       <ConfirmationModal
//         isOpen={openConfirmDelete}
//         onClose={() => setOpenConfirmDelete(false)}
//         onConfirm={handleConfirmDelete}
//         title="Confirm Deletion"
//         message="Are you sure you want to delete this feedback? This action cannot be undone."
//       />
//     </Box>
//   )
// }


"use client"
import { useState, useEffect, useCallback } from "react"
import type React from "react"

import {
  Box,
  Container,
  Typography,
  Rating,
  Button,
  Paper,
  Avatar,
  Stack,
  Snackbar,
  Alert,
  Skeleton,
  CircularProgress,
  IconButton,
  Grid,
  Pagination,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import StarIcon from "@mui/icons-material/Star"
import BusinessIcon from "@mui/icons-material/Business"
import DeleteIcon from "@mui/icons-material/Delete"
import { getAllBusiness } from "@/api/business"
import { getFeedbackByBusinessId, deleteFeedback } from "@/api/feedback"
import ConfirmationModal from "./dialogs/confirm-modal"

// Interfaces for data
interface PaginationInfo {
  count: number
  next: string | null
  previous: string | null
  results: FeedbackItem[]
}

interface BusinessData {
  id: string
  business_id: string
  contact_number: string
  name: string
  marketing_template_url?: string
}

interface FeedbackItem {
  id: number
  feedback_message: string
  star: number
  customer_phone_number: string
  business_id: string
  created_at: string
}

// Rating colors for card borders/accents based on screenshot
const ratingAccentColors: { [index: number]: string } = {
  1: "#ef4444", // Red
  2: "#f97316", // Orange
  3: "#eab308", // Yellow
  4: "#ef4444", // Red, as per screenshot for 4 stars
  5: "#10b981", // Emerald, as per screenshot for 5 stars
}

const getPageStorageKey = (businessId: string) => `feedback_page_${businessId}`

export default function FeedbackListPage() {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize] = useState(10)

  const [isLoadingBusiness, setIsLoadingBusiness] = useState(true)
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success")
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const [feedbackToDeleteId, setFeedbackToDeleteId] = useState<number | null>(null)

  const theme = useTheme()

  const loadPageFromStorage = useCallback((businessId: string) => {
    const storageKey = getPageStorageKey(businessId)
    const savedPage = localStorage.getItem(storageKey)
    return savedPage ? Number.parseInt(savedPage, 10) : 1
  }, [])

  const savePageToStorage = useCallback((businessId: string, page: number) => {
    const storageKey = getPageStorageKey(businessId)
    localStorage.setItem(storageKey, page.toString())
  }, [])

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoadingBusiness(true)
      setError(null)
      const businessResponse = await getAllBusiness()
      const firstBusiness = businessResponse.data.results[0]
      const businessInfo = {
        id: firstBusiness.id,
        business_id: firstBusiness.business_id,
        contact_number: firstBusiness.contact_number,
        name: firstBusiness.name,
        marketing_template_url: firstBusiness.marketing_template_url,
      }
      setBusinessData(businessInfo)

      const savedPage = loadPageFromStorage(businessInfo.business_id)
      setCurrentPage(savedPage)

      await fetchFeedback(businessInfo.business_id, savedPage)
    } catch (err: any) {
      console.error("Failed to fetch initial data:", err)
      setError(err.message || "Failed to load business and feedback information.")
      setSnackbarMessage(err.message || "Failed to load data.")
      setSnackbarSeverity("error")
      setOpenSnackbar(true)
    } finally {
      setIsLoadingBusiness(false)
    }
  }, [loadPageFromStorage])

  const fetchFeedback = useCallback(
    async (businessId: string, page = 1) => {
      setIsLoadingFeedback(true)
      try {
        const feedbackResponse = await getFeedbackByBusinessId(businessId, page, pageSize)
        console.log(feedbackResponse)
        if (!feedbackResponse.success) {
          throw new Error(feedbackResponse.error || "Failed to fetch feedback.")
        }

        const paginationData = feedbackResponse.data as PaginationInfo
        setFeedbackData(paginationData.results || [])
        setTotalCount(paginationData.count || 0)
        setTotalPages(Math.ceil((paginationData.count || 0) / pageSize))

        savePageToStorage(businessId, page)
      } catch (err: any) {
        console.error("Failed to fetch feedback:", err)
        setError(err.message || "Failed to load feedback.")
        setSnackbarMessage(err.message || "Failed to load feedback.")
        setSnackbarSeverity("error")
        setOpenSnackbar(true)
      } finally {
        setIsLoadingFeedback(false)
      }
    },
    [pageSize, savePageToStorage],
  )

  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
    if (businessData?.business_id) {
      fetchFeedback(businessData.business_id, value)
    }
  }

  const handleDeleteClick = (id: number) => {
    setFeedbackToDeleteId(id)
    setOpenConfirmDelete(true)
  }

  const handleConfirmDelete = async () => {
    if (feedbackToDeleteId === null) return
    setOpenConfirmDelete(false)
    setIsLoadingFeedback(true)
    try {
      const result = await deleteFeedback(feedbackToDeleteId)
      if (result.success) {
        setSnackbarMessage(result.message || "Feedback deleted successfully!")
        setSnackbarSeverity("success")
        setOpenSnackbar(true)

        if (businessData?.business_id) {
          const remainingItemsOnPage = feedbackData.length - 1
          let pageToLoad = currentPage

          // If this was the last item on the page and we're not on page 1, go to previous page
          if (remainingItemsOnPage === 0 && currentPage > 1) {
            pageToLoad = currentPage - 1
            setCurrentPage(pageToLoad)
          }

          await fetchFeedback(businessData.business_id, pageToLoad)
        }
      } else {
        throw new Error(result.error || "Failed to delete feedback.")
      }
    } catch (err: any) {
      console.error("Error deleting feedback:", err)
      setSnackbarMessage(err.message || "Failed to delete feedback.")
      setSnackbarSeverity("error")
      setOpenSnackbar(true)
    } finally {
      setIsLoadingFeedback(false)
      setFeedbackToDeleteId(null)
    }
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  if (isLoadingBusiness) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: theme.palette.background.default,
          p: 4,
        }}
      >
        <CircularProgress sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          Loading business data...
        </Typography>
        <Skeleton variant="rectangular" width="80%" height={200} sx={{ mt: 4, borderRadius: 2 }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: theme.palette.background.default,
          p: 4,
        }}
      >
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            maxWidth: 400,
            boxShadow:
              theme.palette.mode === "dark" ? "0 8px 24px rgba(255,255,255,0.1)" : "0 8px 24px rgba(0,0,0,0.1)",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h5" color="error" mb={2}>
            Error
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            {error}
          </Typography>
          <Button variant="contained" onClick={fetchInitialData}>
            Try Again
          </Button>
        </Paper>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: theme.palette.background.default,
        py: 4,
        px: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
              theme.palette.mode === "dark" ? "0 4px 12px rgba(255,255,255,0.05)" : "0 4px 12px rgba(0, 0, 0, 0.05)",
            mb: 6,
            position: "relative",
          }}
        >
          {/* Gear Icon */}
          <IconButton
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: theme.palette.text.secondary,
            }}
            aria-label="settings"
          ></IconButton>

          {/* Business Header */}
          <Stack direction="row" alignItems="center" spacing={3} mb={6}>
            <Box sx={{ position: "relative" }}>
              {businessData?.marketing_template_url ? (
                <Avatar
                  src={businessData.marketing_template_url}
                  sx={{
                    width: 90,
                    height: 90,
                    boxShadow: `0 12px 40px ${theme.palette.primary.main}33`,
                    border: `3px solid ${theme.palette.background.paper}`,
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 40 }} />
                </Avatar>
              ) : (
                <Avatar
                  sx={{
                    width: 90,
                    height: 90,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.error.main} 100%)`,
                    fontSize: "2.2rem",
                    fontWeight: "bold",
                    boxShadow: `0 12px 40px ${theme.palette.primary.main}33`,
                    border: `3px solid ${theme.palette.background.paper}`,
                  }}
                >
                  {businessData?.name ? businessData.name.charAt(0).toUpperCase() : <BusinessIcon />}
                </Avatar>
              )}
            </Box>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                {businessData?.name || "Business Name"}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
                Feedback Overview
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography variant="h5" component="h2" sx={{ color: theme.palette.text.primary }}>
              Customer Feedbacks
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalCount > 0 && (
                <>
                  Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)} of{" "}
                  {totalCount} feedbacks
                </>
              )}
            </Typography>
          </Box>

          {isLoadingFeedback ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6 }}>
              <CircularProgress sx={{ mb: 3 }} />
              <Typography variant="h6" color="text.secondary">
                Loading feedback...
              </Typography>
              <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 4, borderRadius: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 2, borderRadius: 2 }} />
            </Box>
          ) : feedbackData.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                No feedback available for this business yet.
              </Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {feedbackData.map((feedback) => (
                  <Grid item xs={12} sm={6} md={6} key={feedback.id}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        border: `1px solid ${ratingAccentColors[feedback.star] || theme.palette.divider}`,
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "0 2px 8px rgba(255,255,255,0.05)"
                            : "0 2px 8px rgba(0,0,0,0.05)",
                        position: "relative",
                        backgroundColor: theme.palette.background.paper,
                        "&:hover": {
                          boxShadow:
                            theme.palette.mode === "dark"
                              ? "0 4px 16px rgba(255,255,255,0.08)"
                              : "0 4px 16px rgba(0,0,0,0.08)",
                          transform: "translateY(-2px)",
                          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                        },
                      }}
                    >
                      <IconButton
                        aria-label="delete feedback"
                        onClick={() => handleDeleteClick(feedback.id)}
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          color: theme.palette.error.main,
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark" ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.08)",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                        <Rating
                          value={feedback.star}
                          readOnly
                          precision={1}
                          emptyIcon={<StarIcon style={{ opacity: 0.2 }} fontSize="inherit" />}
                          sx={{
                            "& .MuiRating-iconFilled": {
                              color: "#10b981",
                            },
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          ({feedback.star} Star{feedback.star !== 1 ? "s" : ""})
                        </Typography>
                      </Stack>
                      <Typography variant="body1" mb={2} sx={{ color: theme.palette.text.primary }}>
                        {feedback.feedback_message}
                      </Typography>

                      <Typography variant="caption" color="text.disabled" mt={1}>
                        Submitted on: {new Date(feedback.created_at).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Paper>
      </Container>

      {/* Snackbar for messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <ConfirmationModal
        isOpen={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this feedback? This action cannot be undone."
      />
    </Box>
  )
}
