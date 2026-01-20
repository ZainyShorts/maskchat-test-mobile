"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  Container,
  useTheme,
  useMediaQuery,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  TextField,
  MenuItem,
  Pagination,
  CircularProgress,
  
} from "@mui/material"

import {
  ShoppingCart,
  WhatsApp,
  Phone,
  Receipt,
  LocalShipping,
  CheckCircle,
  Cancel,
  Warning,
  Error as ErrorIcon,
  Send,
  Visibility,
  CreditCard,
  Refresh,
  Settings,
  Sms,
  Payment,
  Info as InfoIcon,
} from "@mui/icons-material"
import { getBaseUrl } from "@/api/vars/vars"
import { useAuthStore } from "@/store/authStore"
import { getAllBusiness } from "@/api/business"
import { GetWhatsApp } from "@/api/whatsapp"
import { updateOrder } from "@/api/order"
import { useRouter } from "next/navigation"
interface OrderItem {
  id: number
  name: string
  quantity: number
  status: string
  product_sku: string
  description: string
  size: string
  total_price: string
  customer?: Customer
  order_number?: string
  phone_number?: string
}

interface Customer {
  id: number
  name: string
  email: string
  account_id: string
  address: string
  is_whatsapp_account: boolean
}

interface Order {
  id: number
  order_number: string
  shopify_order_id: string
  shopify_order_number: string
  customer: Customer
  order_items: OrderItem[]
  status: string
  delivery_type: string
  paid: boolean
  address: string
  feedback_msg: boolean
  feedback_msg_status?: string | null
  ivr: boolean
  invoice_sent: boolean
  tracking: boolean
  tracking_msg_id: string | null
  tracking_msg_status: string | null
  total_price: string
  updated_at: string
  invoice_path: string
  created_at: string
  ivr_call_attempt: number
  msg_id: string
  msg_status: string
  ivr_provider: string
  processing_job: boolean
  business: number
  form_email: string
  order_url?: string
  order_domain_url?: string
  remaining_amount?: string
}

interface ApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Order[]
}

interface OrderAnalytics {
  total_orders: number
  pending_orders: number
  confirmed_orders: number
  cancelled_orders: number
}

interface FilterState {
  status: string
  ordering: string
  page: number
}

interface WhatsAppData {
  category: "Shopify-Ecommerce" | "Food"
  business_id: string
  name?: string
}

interface PaymentUpdateState {
  order: Order | null
  receiveAmount: string
  loading: boolean
}

const mockBusinessSettings = {
  sms: true,
  whatsapp: true,
  invoice: true,
  call: true,
  available_calls: true,
}

const API_BASE_URL = getBaseUrl()
const STORAGE_KEY = "order_confirmation_state_v1"

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token")
  return {
    Authorization: `Token ${token}`,
    "Content-Type": "application/json",
  }
}


const messageStatusTooltips = {
  sent: "Message was successfully sent but not yet delivered. The customer's phone may be off or disconnected from internet.",
  delivered: "Message has been delivered to customer's phone but they haven't opened or read it yet.",
  read: "Customer has read the message. This is the highest engagement status.",
  failed:
    "Message failed to send. Reasons: Invalid phone number, no WhatsApp account on this number, or customer blocked you.",
}

const fetchOrderConfirmationData = async (filters: FilterState, businessCategory?: string): Promise<ApiResponse> => {
  try {
    const params = new URLSearchParams()
    if (filters.status && filters.status !== "all") {
      params.append("status", filters.status)
    }
    if (filters.ordering) {
      params.append("ordering", filters.ordering)
    }
    if (businessCategory) {
      params.append("category", businessCategory)
    }
    params.append("page", filters.page.toString())

    const response = await fetch(`${API_BASE_URL}whatseat/orders/order-cofirmation/details/?${params}`, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    return await response.json()
  } catch (error) {
    console.error("Error fetching order confirmation data:", error)
    throw error
  }
}

const fetchOrderAnalytics = async (): Promise<OrderAnalytics> => {
  try {
    const response = await fetch(`${API_BASE_URL}whatseat/order-analytics/`, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    return await response.json()
  } catch (error) {
    console.error("Error fetching order analytics:", error)
    throw error
  }
}

// API functions for order confirmation settings
const fetchOrderConfirmationSettings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}order-confirmations/settings/`, {
      method: "GET",
      headers: getAuthHeaders(),
    })

    return await response.json()
  } catch (error) {
    console.error("Error fetching order confirmation settings:", error)
    throw error
  }
}

const updateOrderConfirmationSettings = async (settingsId: number, updates: Partial<typeof mockBusinessSettings>) => {
  try {
    const response = await fetch(`${API_BASE_URL}order-confirmations/${settingsId}/update/`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    })

    return await response.json()
  } catch (error) {
    console.error("Error updating order confirmation settings:", error)
    throw error
  }
}

const sendWhatsAppPaymentUpdate = async (paymentData: {
  order_id: number
  phone_number: string
  customer_name: string
  receive_amount: string
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}order-confirmations/send_whatsapp_payment_update/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    })

    const data = await response.json()

    if (!response.ok) {
      // 🔴 Backend returned an error code (like 400 or 500)
      throw new Error(data.error || "Failed to send payment update")
    }

    return data
  } catch (error) {
    console.error("Error sending WhatsApp payment update:", error)
    throw error
  }
}

// Feedback API function
const sendFeedbackToCustomer = async (order: OrderItem, token: string) => {
  try {
    const baseUrl = getBaseUrl()
    const response = await fetch(`${baseUrl}feedback/send_whatsapp_order_feedback/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        order_id: order.id,
        phone_number: order.customer?.account_id, // Assuming account_id is the phone number
        customer_name: order.customer?.name,
      }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      return { success: true, message: data.message || "Feedback message sent successfully!" }
    } else {
      return { success: false, error: data.error || "Failed to send feedback" }
    }
  } catch (error: any) {
    console.error("Feedback send error:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

export default function OrderConfirmationDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { user } = useAuthStore()
  const token = localStorage.getItem("auth_token") || "" // Get token for feedback function
  const router = useRouter()
  console.log("user", user)

  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [businessSettings, setBusinessSettings] = useState(mockBusinessSettings)
  const [settingsDialog, setSettingsDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settingsId, setSettingsId] = useState<number | null>(null)
  const [orderAnalytics, setOrderAnalytics] = useState<OrderAnalytics>({
    total_orders: 0,
    pending_orders: 0,
    confirmed_orders: 0,
    cancelled_orders: 0,
  })

  const [businessData, setBusinessData] = useState<any[]>([])
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    ordering: "created_at",
    page: 1,
  })

  const [businessCategory, setBusinessCategory] = useState<"Shopify-Ecommerce" | "Food" | "">("")
  const [accounts, setAccounts] = useState<WhatsAppData[]>([])

  const [remainingCalls, setRemainingCalls] = useState(250) // Mock data - replace with actual API call
  const [purchaseLoading, setPurchaseLoading] = useState(false)

  const [paymentUpdateModal, setPaymentUpdateModal] = useState<PaymentUpdateState>({
    order: null,
    receiveAmount: "",
    loading: false,
  })

  // Feedback modal states
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [feedbackOrder, setFeedbackOrder] = useState<OrderItem | null>(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [customerOrderCount, setCustomerOrderCount] = useState<number | null>(null)
  const [loadingOrderCount, setLoadingOrderCount] = useState(false)

  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY)
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        setFilters(parsedState)
      } catch (error) {
        console.error("Error parsing saved state:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
  }, [filters])

  useEffect(() => {
    loadOrderData()
  }, [filters, businessCategory])

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true)
      setError(null)
      try {
        const settings = await fetchOrderConfirmationSettings()
        setBusinessSettings({
          sms: settings.sms,
          whatsapp: settings.whatsapp,
          invoice: settings.invoice,
          call: settings.call,
          available_calls: settings.available_calls,
        })
        setSettingsId(settings.id)
      } catch (err) {
        setError("Failed to load settings")
        console.error("Failed to load settings:", err)
      } finally {
        setLoading(false)
      }
    }

    const loadOrderAnalytics = async () => {
      try {
        const analytics = await fetchOrderAnalytics()
        setOrderAnalytics(analytics)
      } catch (err) {
        console.error("Failed to load order analytics:", err)
        setError("Failed to load order analytics")
      }
    }

    loadSettings()
    loadOrderAnalytics()
  }, [])

  const fetchBusiness = useCallback(
    async (search?: string) => {
      try {
        setLoading(true)

        // Modify your API call to include search parameter
        const response: any = await getAllBusiness(search ? { search } : undefined)

        const newData = response?.data?.results || []
        setBusinessData(newData)
      } catch (err: any) {
        // toast.error(err.message || "Failed to fetch businesses")
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    },
    [], // Remove businessAction from dependencies to prevent infinite loops
  )

  // Initial fetch - only run once on mount
  useEffect(() => {
    fetchBusiness()
  }, []) // Empty dependency array

  const loadOrderData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchOrderConfirmationData(filters, businessCategory)
      console.log("test", response)
      setApiResponse(response)
      setOrders(response.results)
    } catch (err) {
      setError("Failed to load order data")
      console.error("Failed to load order data:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "delivered":
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "cancelled":
      case "failed":
        return "error"
      default:
        return "default"
    }
  }

  const getMessageStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "read":
        return <CheckCircle color="success" />
      case "delivered":
        return <CheckCircle color="info" />
      case "sent":
        return <Send color="primary" />
      case "failed":
        return <ErrorIcon color="error" />
      default:
        return <Warning color="warning" />
    }
  }

  const getProviderIcon = (ivrProvider: string) => {
    switch (ivrProvider?.toLowerCase()) {
      case "whatsapp":
        return <WhatsApp color="success" />
      case "ivr":
        return <Phone color="primary" />
      default:
        return null
    }
  }

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }

  const handleOrderingChange = (ordering: string) => {
    setFilters((prev) => ({ ...prev, ordering, page: 1 }))
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setFilters((prev) => ({ ...prev, page: value }))
  }

  const handleSettingToggle = async (setting: keyof typeof businessSettings) => {
    if (!settingsId) {
      setError("Settings ID not available")
      return
    }

    const newValue = !businessSettings[setting]
    const updates = { [setting]: newValue }

    // Optimistically update UI
    setBusinessSettings((prev) => ({
      ...prev,
      [setting]: newValue,
    }))

    try {
      await updateOrderConfirmationSettings(settingsId, updates)
    } catch (err) {
      // Revert on error
      setBusinessSettings((prev) => ({
        ...prev,
        [setting]: !newValue,
      }))
      setError(`Failed to update ${setting} setting`)
    }
  }

  const handleConfirmOrder = (orderId: number, method: "whatsapp" | "ivr") => {
    console.log(`Confirming order ${orderId} via ${method}`)
    // Implementation for order confirmation
  }

  const handlePurchaseCalls = async () => {
    setPurchaseLoading(true)
    try {
      const response = await fetch(`${getBaseUrl()}payment/create-stripe-checkout-session/`, {
        method: "POST",
        headers: getAuthHeaders(),
      })

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = await import("@stripe/stripe-js").then((m) =>
        m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY!),
      )
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: sessionId })
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      setError("Failed to initiate payment. Please try again.")
    } finally {
      setPurchaseLoading(false)
    }
  }

  const handleCategoryChange = (e: any) => {
    const value = e.target.value
    setBusinessCategory(value)
  }

  const fetchWhatsAppFeed = useCallback(async () => {
    try {
      const response = await GetWhatsApp()
      const data = response?.data?.results || []

      // ✅ Filter businesses with category Food or Shopify-Ecommerce
      const filteredData = data.filter((item: any) => item.category === "Food" || item.category === "Shopify-Ecommerce")

      // ✅ Auto-select first business if available
      if (filteredData.length > 0) {
        setAccounts(filteredData)
        console.log("GetWhatsApp Filtered:", filteredData)
        setBusinessCategory(filteredData[0].category)
      }
    } catch (error: any) {
      console.log(error)
      setError("Failed to fetch WhatsApp phone numbers.")
    }
  }, [])

  useEffect(() => {
    fetchWhatsAppFeed()
  }, [])

  const handleOpenPaymentUpdate = (order: Order) => {
    setPaymentUpdateModal({
      order,
      receiveAmount: "",
      loading: false,
    })
  }

  const handleClosePaymentUpdate = () => {
    setPaymentUpdateModal({
      order: null,
      receiveAmount: "",
      loading: false,
    })
  }

  const handleSendPaymentUpdate = async () => {
    if (!paymentUpdateModal.order || !paymentUpdateModal.receiveAmount) {
      setError("Please fill in all payment fields")
      return
    }

    setPaymentUpdateModal((prev) => ({ ...prev, loading: true }))

    try {
      const response = await sendWhatsAppPaymentUpdate({
        order_id: paymentUpdateModal.order.id,
        phone_number: paymentUpdateModal.order.customer.account_id,
        customer_name: paymentUpdateModal.order.customer.name,
        receive_amount: paymentUpdateModal.receiveAmount
      })

      // ✅ success response
      console.log("Payment update sent:", response)
      // showSnackbar(response.message || "Payment update sent successfully", "success")

      handleClosePaymentUpdate()
      setError(null)
    } catch (err: any) {
      console.error("Error sending payment update:", err)
      // showSnackbar(err.message || "Failed to send payment update", "error")
      setError("Failed to send payment update. Please try again.")
    } finally {
      setPaymentUpdateModal((prev) => ({ ...prev, loading: false }))
    }
  }

  // Feedback modal handlers
  const handleOpenFeedbackModal = async (order: any) => {
    setFeedbackOrder(order)
    setFeedbackModalOpen(true)
    setFeedbackMessage("")
    setCustomerOrderCount(null)

    setLoadingOrderCount(true)
    try {
      const baseUrl = getBaseUrl()
      const response = await fetch(`${baseUrl}feedback/send_whatsapp_order_feedback/?order_id=${order.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })

      const data = await response.json()
      if (response.ok && data.success) {
        setCustomerOrderCount(data.total_orders)
      } else {
        console.error("Failed to fetch customer order count:", data.error)
      }
    } catch (error) {
      console.error("Error fetching customer order count:", error)
    } finally {
      setLoadingOrderCount(false)
    }
  }

  const handleSendFeedback = async () => {
    if (!feedbackOrder || !token) {
      setFeedbackMessage("❌ Missing order information or authentication token.")
      return
    }

    setFeedbackLoading(true)
    const result = await sendFeedbackToCustomer(feedbackOrder, token)

    if (result.success) {
      setFeedbackMessage(`✅ ${result.message}`)
      setTimeout(() => {
        setFeedbackModalOpen(false)
        setFeedbackOrder(null)
        setFeedbackMessage("")
        loadOrderData()
      }, 1000)
      loadOrderData() // Refresh data after successful feedback
    } else {
      setFeedbackMessage(`❌ ${result.error}`)
    }
    setFeedbackLoading(false)
  }

  const totalPages = apiResponse ? Math.ceil(apiResponse.count / 10) : 1

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
                Orders Dashboard
              </Typography>
            }
            subheader={
              <Typography variant="h6" color="text.secondary">
                Monitor order confirmations, WhatsApp messages, and IVR calls
              </Typography>
            }
            action={
              <Stack direction="row" spacing={1}>
                <select
                  value={businessCategory || ""}
                  onChange={handleCategoryChange}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "0.9rem",
                    background: "#fff",
                    color: "#333",
                  }}
                >
                  {accounts &&
                    accounts.map((cat, index) => (
                      <option key={index} value={cat.category}>
                        {cat.category}
                      </option>
                    ))}
                </select>

                <Button variant="outlined" startIcon={<Settings />} onClick={() => setSettingsDialog(true)}>
                  Settings
                </Button>
                <Button variant="contained" startIcon={<Refresh />} onClick={loadOrderData} disabled={loading}>
                  Refresh
                </Button>
              </Stack>
            }
          />
        </Card>

        {/* Business Configuration */}
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold">
                Business Configuration
              </Typography>
            }
            subheader="Configure your order confirmation and communication settings"
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: businessSettings.sms ? "success.main" : "grey.400" }}>
                        <Sms />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          SMS Service
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          Coming soon - SMS notifications for order confirmations
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: businessSettings.whatsapp ? "success.main" : "grey.400" }}>
                        <WhatsApp />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          WhatsApp
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {businessSettings.whatsapp ? "Active" : "Inactive"}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: businessSettings.call ? "success.main" : "grey.400" }}>
                        <Phone />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          IVR Calls
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {businessSettings.call ? "Active" : "Inactive"}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: businessSettings.invoice ? "success.main" : "grey.400" }}>
                        <Receipt />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Auto Invoice
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {businessSettings.invoice ? "Active" : "Inactive"}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Analytics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <ShoppingCart />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {orderAnalytics.total_orders}
                    </Typography>
                    <Typography color="text.secondary">Total Orders</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: "warning.main" }}>
                    <Warning />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {orderAnalytics.pending_orders}
                    </Typography>
                    <Typography color="text.secondary">Pending Orders</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: "success.main" }}>
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {orderAnalytics.confirmed_orders}
                    </Typography>
                    <Typography color="text.secondary">Confirmed Orders</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: "error.main" }}>
                    <Cancel />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {orderAnalytics.cancelled_orders}
                    </Typography>
                    <Typography color="text.secondary">Cancelled Orders</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Status Filter"
                  value={filters.status}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  size="small"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="no_answer">No Answer</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Sort Order"
                  value={filters.ordering}
                  onChange={(e) => handleOrderingChange(e.target.value)}
                  size="small"
                >
                  <MenuItem value="created_at">Oldest First</MenuItem>
                  <MenuItem value="-created_at">Newest First</MenuItem>
                  <MenuItem value="-updated_at">Recently Updated</MenuItem>
                  <MenuItem value="status">Status A-Z</MenuItem>
                  <MenuItem value="-status">Status Z-A</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Total: {apiResponse?.count || 0} orders
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                {loading && <CircularProgress size={24} />}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}


        <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <CardHeader
                    title="Recent Orders"
                    subheader={`Showing ${orders.length} of ${apiResponse?.count || 0} orders`}
                  />
                  <TableContainer>
                    {loading ? (
                      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : orders.length > 0 ? (
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#f3f4f6" }}>
                            <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Message Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>FeedBack</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Order Thread</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id} sx={{ "&:hover": { bgcolor: "#f9fafb" } }}>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {order.order_number}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{order.customer?.name}</Typography>
                                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                  {order.customer?.email}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip label={order.status} color={getStatusColor(order.status) as any} size="small" />
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  {getMessageStatusIcon(order.msg_status)}
                                  <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                                    {order.msg_status}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {businessData[0]?.currency?.symbol}
                                  <span className="px-1">
                                  {order.total_price && parseInt(order.total_price)}
                                  </span>
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1}>
                                  <Tooltip title="Send Payment Update">
                                    <IconButton size="small" onClick={() => handleOpenPaymentUpdate(order)} color="primary">
                                      <Payment sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="View Order Details">
                                    <IconButton size="small" onClick={() => setSelectedOrder(order)} color="primary">
                                      <Visibility sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                              <TableCell>
                          <Tooltip title="Send WhatsApp Feedback">
                            <Button
                              variant="outlined"
                              size="small"
                              color="success"
                              onClick={() => handleOpenFeedbackModal(order)}
                              startIcon={<WhatsApp />}
                            >
                              Send
                            </Button>
                          </Tooltip>
                        </TableCell>
                           <TableCell>

                         <IconButton size="small" onClick={() => window.open(`/en/activity/${order.id}`, "_blank")}>
                              <Visibility />
                            </IconButton>
                           </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <Box sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          No orders found
                        </Typography>
                      </Box>
                    )}
                  </TableContainer>
                  {totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                      <Pagination count={totalPages} page={filters.page} onChange={handlePageChange} />
                    </Box>
                  )}
                </Card>


        {/* Settings Dialog */}
        <Dialog open={settingsDialog} onClose={() => setSettingsDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              Business Configuration Settings
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <Alert severity="info">
                Configure which services are enabled for your business. Disabled services will not be available for
                order confirmations.
              </Alert>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Communication Services
                </Typography>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={<Switch checked={false} onChange={() => {}} color="primary" disabled={true} />}
                    label={
                      <Box>
                        <Typography variant="body1">SMS Service</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Coming soon - SMS notifications for order confirmations
                        </Typography>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={businessSettings.whatsapp}
                        onChange={() => handleSettingToggle("whatsapp")}
                        color="primary"
                        disabled={loading}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">WhatsApp Order Confirmation</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Send order confirmations via WhatsApp Business
                        </Typography>
                      </Box>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={businessSettings.call}
                        onChange={() => handleSettingToggle("call")}
                        color="primary"
                        disabled={loading}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">IVR Call Confirmations</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Enable automated voice call confirmations for orders
                        </Typography>
                      </Box>
                    }
                  />
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Document Services
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={businessSettings.invoice}
                      onChange={() => handleSettingToggle("invoice")}
                      color="primary"
                      disabled={loading}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">Automatic Invoice Generation</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Automatically generate and send invoices for confirmed orders
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Divider />

              {/* API Calls Management */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  API Calls Management
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ p: 2, bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          Remaining Calls
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Available phone calls for order confirmations
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {businessSettings.available_calls}
                      </Typography>
                    </Stack>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Get 90 additional phone calls for order confirmations and communication services.
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSettingsDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => setSettingsDialog(false)}>
              Save Settings
            </Button>
          </DialogActions>
        </Dialog>

         <Dialog open={selectedOrder !== null} onClose={() => setSelectedOrder(null)} maxWidth="md" fullWidth>
                  {selectedOrder && (
                    <>
                      <DialogTitle sx={{ bgcolor: "#f3f4f6", borderBottom: "1px solid #e5e7eb" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              Order Details
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#6b7280" }}>
                              Order #{selectedOrder.order_number}
                            </Typography>
                          </Stack>
                          <Chip label={selectedOrder.status} color={getStatusColor(selectedOrder.status) as any} size="small" />
                        </Stack>
                      </DialogTitle>
        
                      <DialogContent sx={{ bgcolor: "#ffffff", pt: 3 }}>
                        <Stack spacing={3}>
                          {/* Customer Information Section */}
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Customer Information
                              </Typography>
                              <Tooltip title="Customer contact and shipping details">
                                <InfoIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                              </Tooltip>
                            </Stack>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                    Name
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                                    {selectedOrder.customer?.name}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                    Phone (WhatsApp)
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                                    {selectedOrder.customer?.account_id}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                    Email
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                                    {selectedOrder.customer?.email || selectedOrder.form_email}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                      WhatsApp Account
                                    </Typography>
                                    <Tooltip title="Is this customer's phone registered with WhatsApp">
                                      <InfoIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                                    </Tooltip>
                                  </Stack>
                                  <Chip
                                    label={selectedOrder.customer?.is_whatsapp_account ? "Yes" : "No"}
                                    color={selectedOrder.customer?.is_whatsapp_account ? "success" : "error"}
                                    size="small"
                                    sx={{ mt: 0.5 }}
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                    Address
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                                    {selectedOrder.address}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
        
                          {/* Order Status & Communication Section */}
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Order Status & Communication
                              </Typography>
                              <Tooltip title="Order Placement Confirmation">
                                <InfoIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                              </Tooltip>
                            </Stack>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                      Message Status
                                    </Typography>
                                    <Tooltip
                                      title={
                                        messageStatusTooltips[
                                          selectedOrder.msg_status?.toLowerCase() as keyof typeof messageStatusTooltips
                                        ] || "Unknown status"
                                      }
                                    >
                                      <InfoIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                                    </Tooltip>
                                  </Stack>
                                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                    {getMessageStatusIcon(selectedOrder.msg_status)}
                                    <Typography variant="body2" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                                      {selectedOrder.msg_status || "Not Sent"}
                                    </Typography>
                                  </Stack>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                      Communication Method
                                    </Typography>
                                    <Tooltip title="How the order confirmation was sent (WhatsApp or IVR Phone Call)">
                                      <InfoIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                                    </Tooltip>
                                  </Stack>
                                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                    {getProviderIcon(selectedOrder.ivr_provider)}
                                    <Typography variant="body2" sx={{ fontWeight: 600, textTransform: "uppercase" }}>
                                      {selectedOrder.ivr_provider || "None"}
                                      {selectedOrder.ivr_provider === "ivr" && ` (${selectedOrder.ivr_call_attempt} attempts)`}
                                    </Typography>
                                  </Stack>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                      Invoice Status
                                    </Typography>
                                    <Tooltip title="Invoice sent to the customer">
                                      <InfoIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                                    </Tooltip>
                                  </Stack>
                                  <Chip
                                    label={selectedOrder.invoice_sent ? "Sent" : "Pending"}
                                    color={selectedOrder.invoice_sent ? "success" : "warning"}
                                    size="small"
                                    sx={{ mt: 0.5 }}
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                      Tracking Status
                                    </Typography>
                                    <Tooltip title="Tracking number sent to the customer">
                                      <InfoIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                                    </Tooltip>
                                  </Stack>
                                  <Chip
                                    label={selectedOrder.tracking ? "Sent" : "Pending"}
                                    color={selectedOrder.tracking ? "success" : "default"}
                                    size="small"
                                    sx={{ mt: 0.5 }}
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                      Feedback Status
                                    </Typography>
                                    <Tooltip title="Customer feedback request status">
                                      <InfoIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                                    </Tooltip>
                                  </Stack>
                                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5, textTransform: "capitalize" }}>
                                    {/* {selectedOrder.feedback_msg_status || (selectedOrder.feedback_msg ? "Pending" : "Not Sent")} */}
                                    <Chip
                                    label={selectedOrder.feedback_msg ? "Sent" : "Pending"}
                                    color={selectedOrder.feedback_msg ? "success" : "warning"}
                                    size="small"
                                    sx={{ mt: 0.5 }}
                                  />
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
        
                          {/* Payment Information Section */}
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Payment Information
                              </Typography>
                              <Tooltip title="Payment status and amounts">
                                <InfoIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                              </Tooltip>
                            </Stack>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                    Total Amount
                                  </Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, color: "#111827" }}>
                                    {businessData[0].currency.symbol} {parseInt(selectedOrder.total_price)}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                      Payment Status
                                    </Typography>
                                    <Tooltip title="Whether payment has been received">
                                      <InfoIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                                    </Tooltip>
                                  </Stack>
                                  <Chip
                                    label={selectedOrder.paid ? "Paid" : "Unpaid"}
                                    color={selectedOrder.paid ? "success" : "error"}
                                    size="small"
                                    sx={{ mt: 0.5 }}
                                  />
                                </Box>
                              </Grid>
                              {selectedOrder.remaining_amount && Number(selectedOrder.remaining_amount) > 0 && (
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ p: 1.5, bgcolor: "#fef3c7", borderRadius: 1, border: "1px solid #fcd34d" }}>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                        Remaining Amount
                                      </Typography>
                                      <Tooltip title="Amount still owed by the customer">
                                        <InfoIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                                      </Tooltip>
                                    </Stack>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, color: "#b45309" }}>
                                      {businessData[0].currency.symbol}{Number(selectedOrder.remaining_amount).toFixed(2)}
                                    </Typography>
                                  </Box>
                                </Grid>
                              )}
                            </Grid>
                          </Box>
        
                          {/* Order Items Section */}
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Order Items
                              </Typography>
                              <Tooltip title={`${selectedOrder.order_items.length} item(s) in this order`}>
                                <InfoIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                              </Tooltip>
                            </Stack>
                            <Stack spacing={1}>
                              {selectedOrder.order_items.map((item, index) => (
                                <Box
                                  key={item.id}
                                  sx={{
                                    p: 1.5,
                                    bgcolor: "#f9fafb",
                                    borderRadius: 1,
                                    border: "1px solid #e5e7eb",
                                  }}
                                >
                                  <Stack spacing={1}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                      <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                          {item.name}
                                        </Typography>
                                        {item.product_sku && (
                                          <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                            SKU: {item.product_sku}
                                          </Typography>
                                        )}
                                      </Box>
                                      <Chip label={`Qty: ${item.quantity}`} size="small" variant="outlined" />
                                    </Stack>
                                   
                                    {item.size && (
                                      <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                        Size: {item.size}
                                      </Typography>
                                    )}
                                    <Divider />
                                    <Stack direction="row" justifyContent="space-between">
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Total
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#3b82f6" }}>
                                        {businessData[0].currency.symbol} {parseInt(item.total_price)}
                                      </Typography>
                                    </Stack>
                                  </Stack>
                                </Box>
                              ))}
                            </Stack>
                          </Box>
        
                          {/* Additional Details Section */}
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Additional Details
                              </Typography>
                              <Tooltip title="Metadata and timestamps">
                                <InfoIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                              </Tooltip>
                            </Stack>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                    Created Date
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                                    {new Date(selectedOrder.created_at).toLocaleDateString()}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                    {new Date(selectedOrder.created_at).toLocaleTimeString()}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                    Last Updated
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                                    {new Date(selectedOrder.updated_at).toLocaleDateString()}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                    {new Date(selectedOrder.updated_at).toLocaleTimeString()}
                                  </Typography>
                                </Box>
                              </Grid>
                              {selectedOrder.shopify_order_number && (
                                <Grid item xs={12} sm={6}>
                                  <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                        Shopify Order
                                      </Typography>
                                      <Tooltip title="The original Shopify order number">
                                        <InfoIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                                      </Tooltip>
                                    </Stack>
                                    <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                                      #{selectedOrder.shopify_order_number}
                                    </Typography>
                                  </Box>
                                </Grid>
                              )}
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 1.5, bgcolor: "#f9fafb", borderRadius: 1 }}>
                                  <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                      Delivery Type
                                    </Typography>
                                    <Tooltip title="How the order is being delivered">
                                      <InfoIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                                    </Tooltip>
                                  </Stack>
                                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5, textTransform: "capitalize" }}>
                                    {selectedOrder.delivery_type}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Stack>
                      </DialogContent>
        
                      <DialogActions sx={{ bgcolor: "#f3f4f6", p: 2 }}>
                        <Button onClick={() => setSelectedOrder(null)} variant="contained">
                          Close
                        </Button>
                      </DialogActions>
                    </>
                  )}
                </Dialog>

     
        <Dialog open={!!paymentUpdateModal.order} onClose={handleClosePaymentUpdate} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              Send Payment Update via WhatsApp
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {paymentUpdateModal.order && (
                <>
                  <Box sx={{ p: 2, bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Order #{paymentUpdateModal.order.order_number}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {paymentUpdateModal.order.customer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Amount: {businessData[0]?.currency?.symbol} {parseInt(paymentUpdateModal?.order?.total_price ?? "0")}
                    </Typography>
                     <Typography variant="body2" color="text.secondary">
                        Remaining Amount: {businessData[0]?.currency?.symbol}{" "}
                        {parseInt(paymentUpdateModal?.order?.remaining_amount ?? "0")}
                      </Typography>
                  </Box>

                  <TextField
                    label="Amount Received"
                    type="number"
                    inputProps={{ step: "0.01", min: "0" }}
                    value={paymentUpdateModal.receiveAmount}
                    onChange={(e) =>
                      setPaymentUpdateModal((prev) => ({
                        ...prev,
                        receiveAmount: e.target.value,
                      }))
                    }
                    fullWidth
                    placeholder="e.g., 500.50"
                    helperText="Amount received in this payment"
                  />

                  

                  <Alert severity="info">
                    This will send a WhatsApp message to {paymentUpdateModal.order.customer.account_id} with the payment
                    update details.
                  </Alert>
                </>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePaymentUpdate} disabled={paymentUpdateModal.loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSendPaymentUpdate}
              disabled={paymentUpdateModal.loading}
              startIcon={paymentUpdateModal.loading ? <CircularProgress size={20} /> : <Send />}
            >
              {paymentUpdateModal.loading ? "Sending..." : "Send Update"}
            </Button>
          </DialogActions>
        </Dialog>

        

        {/* Feedback Modal Dialog */}
        <Dialog open={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>Send Feedback Message</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            {feedbackOrder && (
              <Stack spacing={2}>
                {loadingOrderCount ? (
                  <Box sx={{ p: 2, bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        Loading customer order history...
                      </Typography>
                    </Stack>
                  </Box>
                ) : customerOrderCount !== null ? (
                  <Box sx={{ p: 2, bgcolor: "primary.50", border: 1, borderColor: "primary.main", borderRadius: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Customer Order History
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                          Total Orders: {customerOrderCount}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                        <ShoppingCart />
                      </Avatar>
                    </Stack>
                  </Box>
                ) : null}

                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Customer: {feedbackOrder.customer?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order: {feedbackOrder.order_number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phone: {feedbackOrder.customer?.account_id}
                  </Typography>
                </Box>
                <Alert severity="info">
                  Are you sure you want to send a WhatsApp feedback message to this customer?
                </Alert>
                {feedbackMessage && (
                  <Alert severity={feedbackMessage.includes("✅") ? "success" : "error"}>{feedbackMessage}</Alert>
                )}
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setFeedbackModalOpen(false)} disabled={feedbackLoading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleSendFeedback}
              disabled={feedbackLoading}
              startIcon={feedbackLoading ? <CircularProgress size={20} /> : <WhatsApp />}
            >
              {feedbackLoading ? "Sending..." : "Send"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

