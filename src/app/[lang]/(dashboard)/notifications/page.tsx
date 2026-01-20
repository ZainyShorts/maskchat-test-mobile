


"use client"

import React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Container,
  useTheme,
  useMediaQuery,
  MenuItem,
  Select,
  FormControl,
  Pagination,
  Paper,
  Tooltip,
  IconButton,
  Collapse,
} from "@mui/material"
import {
  Notifications as NotificationsIcon,
  Error as ErrorIcon,
  Refresh,
  Done,
  DoneAll,
  Schedule,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material"
import { getBaseUrl } from "@/api/vars/vars"
import { useRouter } from "next/navigation"
import { getAllBusiness } from "@/api/business"

interface Message {
  step: string
  status: string
  sent_at: number
}

interface CheckoutDetail {
  checkout_id: number
  checkout_created_at: string
  customer_name: string
  country: string
  phone: string
  checkout_url: string
  messages: Message[]
}

interface Notification {
  id?: number
  business_id?: string
  title?: string
  type?: string
  created_at?: number
  status?: string | null
  checkout_id?: number
  checkout_created_at?: string
  customer_name?: string
  country?: string
  phone?: string
  checkout_url?: string
  messages?: Message[]
}

interface NotificationApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: CheckoutDetail[]
}

interface NotificationFilters {
  page: number
  limit: number
}

// API Helper Functions
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token")
  return {
    Authorization: `Token ${token}`,
    "Content-Type": "application/json",
  }
}

const fetchNotifications = async (
  businessId: string,
  filters: NotificationFilters,
): Promise<NotificationApiResponse> => {
  try {
    const token = localStorage.getItem("auth_token")

    if (!token) {
      window.location.href = "/en/login"
      throw new Error("No authentication token. Redirecting to login.")
    }

    const params = new URLSearchParams()
    params.append("limit", filters.limit.toString())
    params.append("page", filters.page.toString())

    const response = await fetch(
      `${getBaseUrl()}abandoned-checkouts/get_business_abandoned_checks/${businessId}/?${params}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    )

    if (response.status === 401) {
      localStorage.removeItem("auth_token")
      window.location.href = "/en/login"
      throw new Error("Session ended. Please login again.")
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching notifications:", error)
    throw error
  }
}

const getMessageStatusDetails = (status: string | null | undefined) => {
  if (!status) {
    return {
      icon: <Schedule />,
      color: "default" as const,
      label: "Pending",
      tooltip: "Message sent from server, awaiting Meta delivery",
    }
  }

  switch (status.toLowerCase()) {
    case "sent":
      return {
        icon: <Done />,
        color: "info" as const,
        label: "Sent",
        tooltip: "Sent to user, phone may be off or no internet",
      }
    case "delivered":
      return {
        icon: <DoneAll />,
        color: "primary" as const,
        label: "Delivered",
        tooltip: "Message delivered, not yet read",
      }
    case "read":
      return {
        icon: <DoneAll />,
        color: "success" as const,
        label: "Read",
        tooltip: "Message read by customer",
      }
    case "failed":
      return {
        icon: <ErrorIcon />,
        color: "error" as const,
        label: "Failed",
        tooltip: "Customer doesn't exist on WhatsApp",
      }
    default:
      return {
        icon: <NotificationsIcon />,
        color: "default" as const,
        label: status,
        tooltip: "Unknown status",
      }
  }
}

// Format timestamp
const formatTime = (unixTimestamp: number) => {
  const date = new Date(unixTimestamp * 1000)
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

const formatDateString = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

export default function NotificationsPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const router = useRouter()

  // State Management
  const [notifications, setNotifications] = useState<CheckoutDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiResponse, setApiResponse] = useState<NotificationApiResponse | null>(null)
  const [businessId, setBusinessId] = useState<string>("")
  const [timeZone, setTimeZone] = useState<string>("Asia/Karachi")
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const [filters, setFilters] = useState<NotificationFilters>({
    page: 1,
    limit: 10,
  })

  async function getAllBusinessFunc() {
    try {
      const data: any = await getAllBusiness()
      if (data.data.results[0]) {
        setBusinessId(data.data.results[0].business_id)
        setTimeZone(data.data.results[0].timezone)
      }
    } catch (err: any) {
      console.error("Error fetching business data:", err)
    }
  }

  // Effect: Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/en/login")
      return
    }

    // Get business ID
    getAllBusinessFunc()
  }, [router])

  // Effect: Load notifications when businessId or filters change
  useEffect(() => {
    if (businessId) {
      loadNotifications()
    }
  }, [businessId, filters])

  const loadNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchNotifications(businessId, filters)
      console.log("response---", response)
      setApiResponse(response)
      setNotifications(response.results)
      setExpandedRows(new Set())
    } catch (err: any) {
      setError(err.message || "Failed to load notifications. Please try again.")
      console.error("Error loading notifications:", err)
    } finally {
      setLoading(false)
    }
  }

  // Handlers
  const handleLimitChange = (event: any) => {
    const newLimit = event.target.value
    setFilters((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1,
    }))
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setFilters((prev) => ({
      ...prev,
      page: value,
    }))
  }

  const handleRefresh = () => {
    loadNotifications()
  }

  const toggleRowExpanded = (checkoutId: number) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(checkoutId)) {
      newExpandedRows.delete(checkoutId)
    } else {
      newExpandedRows.add(checkoutId)
    }
    setExpandedRows(newExpandedRows)
  }

  // Calculate total pages
  const totalPages = apiResponse ? Math.ceil(apiResponse.count / filters.limit) : 1

  if (!businessId) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant={isMobile ? "h5" : "h4"} component="h1" color="primary" fontWeight="bold">
                Abandoned Checkouts
              </Typography>
            }
            subheader={
              <Typography variant="h6" color="text.secondary">
                View all abandoned checkout notifications for your business
              </Typography>
            }
            action={
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                {/* Records Per Page Selector */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select value={filters.limit} onChange={handleLimitChange} label="Records per page">
                    <MenuItem value={10}>10 per page</MenuItem>
                    <MenuItem value={20}>20 per page</MenuItem>
                    <MenuItem value={30}>30 per page</MenuItem>
                  </Select>
                </FormControl>

                {/* Refresh Button */}
                <Box
                  component="button"
                  onClick={handleRefresh}
                  disabled={loading}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    "&:disabled": {
                      opacity: 0.5,
                      cursor: "not-allowed",
                    },
                  }}
                >
                  <Refresh
                    sx={{
                      animation: loading ? "spin 1s linear infinite" : "none",
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                </Box>
              </Box>
            }
          />
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Notifications Table */}
        {!loading && notifications && notifications.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    <TableCell width={50}></TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">Customer Name</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">Phone</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">Country</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">Messages</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">Checkout Date</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notifications.map((checkout) => {
                    const isExpanded = expandedRows.has(checkout.checkout_id)
                    const messageCount = checkout.messages?.length || 0
                    const displayMessages = checkout.messages?.slice(0, 3) || []

                    return (
                      <React.Fragment key={checkout.checkout_id}>
                        {/* Main Row */}
                        <TableRow
                          sx={{
                            "&:hover": {
                              bgcolor: "action.hover",
                            },
                            cursor: "pointer",
                          }}
                        >
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => toggleRowExpanded(checkout.checkout_id)}
                              sx={{
                                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease",
                              }}
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500">
                              {checkout.customer_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{checkout.phone}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={checkout.country} variant="outlined" size="small" />
                          </TableCell>
                          <TableCell>
                            <Tooltip
                              title={
                                <Box sx={{ p: 1 }}>
                                  <Typography variant="caption" fontWeight="bold" sx={{ display: "block", mb: 1 }}>
                                    Messages ({messageCount} total)
                                  </Typography>
                                  {displayMessages.map((msg, idx) => {
                                    const statusDetails = getMessageStatusDetails(msg.status)
                                    return (
                                      <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                        {statusDetails.icon}
                                        <Typography variant="caption">
                                          {msg.step} - {statusDetails.label}
                                        </Typography>
                                      </Box>
                                    )
                                  })}
                                  {messageCount > 3 && (
                                    <Typography
                                      variant="caption"
                                      sx={{ display: "block", mt: 0.5, fontStyle: "italic" }}
                                    >
                                      +{messageCount - 3} more
                                    </Typography>
                                  )}
                                </Box>
                              }
                            >
                              <Chip
                                label={`${messageCount} message${messageCount !== 1 ? "s" : ""}`}
                                color={messageCount > 0 ? "primary" : "default"}
                                variant="outlined"
                                size="small"
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatDateString(checkout.checkout_created_at)}
                            </Typography>
                          </TableCell>
                        </TableRow>

                        {/* Expanded Row - Full Details */}
                        <TableRow>
                          <TableCell colSpan={6} sx={{ py: 0 }}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 3, bgcolor: "action.hover" }}>
                                <Box
                                  sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}
                                >
                                  {/* Checkout Details */}
                                  <Box>
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                      Checkout Details
                                    </Typography>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                      <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                          Checkout ID
                                        </Typography>
                                        <Typography variant="body2">{checkout.checkout_id}</Typography>
                                      </Box>
                                      <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                          Checkout URL
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            wordBreak: "break-all",
                                            color: "primary.main",
                                            cursor: "pointer",
                                            "&:hover": { textDecoration: "underline" },
                                          }}
                                          onClick={() => window.open(checkout.checkout_url, "_blank")}
                                        >
                                          {checkout.checkout_url.slice(0,50)}...
                                        </Typography>
                                      </Box>
                                      <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                          Created At
                                        </Typography>
                                        <Typography variant="body2">
                                          {formatDateString(checkout.checkout_created_at)}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>

                                  {/* Customer Details */}
                                  <Box>
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                      Customer Details
                                    </Typography>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                      <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                          Name
                                        </Typography>
                                        <Typography variant="body2">{checkout.customer_name}</Typography>
                                      </Box>
                                      <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                          Phone
                                        </Typography>
                                        <Typography variant="body2">{checkout.phone}</Typography>
                                      </Box>
                                      <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                          Country
                                        </Typography>
                                        <Typography variant="body2">{checkout.country}</Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>

                                {/* Messages Section */}
                                <Box sx={{ mt: 3 }}>
                                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                    All Messages ({messageCount})
                                  </Typography>
                                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                    {checkout.messages && checkout.messages.length > 0 ? (
                                      checkout.messages.map((msg, idx) => {
                                        const statusDetails = getMessageStatusDetails(msg.status)
                                        return (
                                          <Box
                                            key={idx}
                                            sx={{
                                              p: 2,
                                              border: "1px solid",
                                              borderColor: "divider",
                                              borderRadius: 1,
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Box>
                                              <Typography variant="body2" fontWeight="500">
                                                {msg.step}
                                              </Typography>
                                              <Typography variant="caption" color="text.secondary">
                                                Sent: {formatTime(msg.sent_at)}
                                              </Typography>
                                            </Box>
                                            <Tooltip title={statusDetails.tooltip}>
                                              <Chip
                                                icon={statusDetails.icon}
                                                label={statusDetails.label}
                                                color={statusDetails.color}
                                                variant="filled"
                                                size="small"
                                              />
                                            </Tooltip>
                                          </Box>
                                        )
                                      })
                                    ) : (
                                      <Typography variant="body2" color="text.secondary">
                                        No messages sent yet
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        {/* Empty State */}
        {!loading && notifications && notifications.length === 0 && !error && (
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <NotificationsIcon sx={{ fontSize: 64, color: "text.secondary" }} />
                  <Typography variant="h6" color="text.secondary">
                    No abandoned checkouts found
                  </Typography>
                </Box>
              }
            />
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination
              count={totalPages}
              page={filters.page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              disabled={loading}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}
