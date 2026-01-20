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
  TextField,
  MenuItem,
  Pagination,
  CircularProgress,
  Divider,
} from "@mui/material"
import {
  ShoppingCart,
  WhatsApp,
  Phone,
  CheckCircle,
  Cancel,
  Warning,
  Error as ErrorIcon,
  Send,
  Visibility,
  Refresh,
  Settings,
  Payment,
  Info as InfoIcon,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material"
import { getBaseUrl } from "@/api/vars/vars"
import { useAuthStore } from "@/store/authStore"
import { getAllBusiness } from "@/api/business"
import { GetWhatsApp } from "@/api/whatsapp"
import { useRouter } from "next/navigation"

const messageStatusTooltips = {
  sent: "Message was successfully sent but not yet delivered. The customer's phone may be off or disconnected from internet.",
  delivered: "Message has been delivered to customer's phone but they haven't opened or read it yet.",
  read: "Customer has read the message. This is the highest engagement status.",
  failed:
    "Message failed to send. Reasons: Invalid phone number, no WhatsApp account on this number, or customer blocked you.",
}

const orderStatusTooltips = {
  pending: "Order is waiting for confirmation. Action required.",
  confirmed: "Order has been confirmed by customer. Ready for processing.",
  cancelled: "Order was cancelled. Check details for cancellation reason.",
  completed: "Order has been completed and delivered to customer.",
}

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
      throw new Error(data.error || "Failed to send payment update")
    }

    return data
  } catch (error) {
    console.error("Error sending WhatsApp payment update:", error)
    throw error
  }
}

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
        phone_number: order.customer?.account_id,
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

const MetricCard = ({
  title,
  value,
  icon: Icon,
  tooltip,
  trend,
  color = "#3b82f6",
}: {
  title: string
  value: number | string
  icon: React.ComponentType<any>
  tooltip: string
  trend?: "up" | "down"
  color?: string
}) => (
  <Card sx={{ height: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
              {title}
            </Typography>
            <Tooltip title={tooltip} arrow placement="right">
              <InfoIcon sx={{ fontSize: 18, color: "#9ca3af", cursor: "help" }} />
            </Tooltip>
          </Stack>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: color }}>
            {value}
          </Typography>
        </Stack>
        <Icon sx={{ fontSize: 32, color: color, opacity: 0.3 }} />
      </Stack>
      {trend && (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 2 }}>
          {trend === "up" ? (
            <TrendingUp sx={{ fontSize: 16, color: "#10b981" }} />
          ) : (
            <TrendingDown sx={{ fontSize: 16, color: "#ef4444" }} />
          )}
          <Typography variant="caption" sx={{ color: trend === "up" ? "#10b981" : "#ef4444" }}>
            {trend === "up" ? "Increasing" : "Decreasing"}
          </Typography>
        </Stack>
      )}
    </CardContent>
  </Card>
)

export default function OrderConfirmationDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { user } = useAuthStore()
  const token = localStorage.getItem("auth_token") || ""
  const router = useRouter()

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
  const [remainingCalls, setRemainingCalls] = useState(250)
  const [purchaseLoading, setPurchaseLoading] = useState(false)

  const [paymentUpdateModal, setPaymentUpdateModal] = useState<PaymentUpdateState>({
    order: null,
    receiveAmount: "",
    loading: false,
  })

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
      } finally {
        setLoading(false)
      }
    }

    const loadOrderAnalytics = async () => {
      try {
        const analytics = await fetchOrderAnalytics()
        setOrderAnalytics(analytics)
      } catch (err) {
        setError("Failed to load order analytics")
      }
    }

    loadSettings()
    loadOrderAnalytics()
  }, [])

  const fetchBusiness = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      const response: any = await getAllBusiness(search ? { search } : undefined)
      const newData = response?.data?.results || []
      setBusinessData(newData)
    } catch (err: any) {
      console.log(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBusiness()
  }, [])

  const loadOrderData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchOrderConfirmationData(filters, businessCategory)
      setApiResponse(response)
      setOrders(response.results)
    } catch (err) {
      setError("Failed to load order data")
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

    setBusinessSettings((prev) => ({
      ...prev,
      [setting]: newValue,
    }))

    try {
      await updateOrderConfirmationSettings(settingsId, updates)
    } catch (err) {
      setBusinessSettings((prev) => ({
        ...prev,
        [setting]: !newValue,
      }))
      setError(`Failed to update ${setting} setting`)
    }
  }

  const handleConfirmOrder = (orderId: number, method: "whatsapp" | "ivr") => {
    console.log(`Confirming order ${orderId} via ${method}`)
  }

  const handlePurchaseCalls = async () => {
    setPurchaseLoading(true)
    try {
      const response = await fetch(`${getBaseUrl()}payment/create-stripe-checkout-session/`, {
        method: "POST",
        headers: getAuthHeaders(),
      })

      const { sessionId } = await response.json()

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

      const filteredData = data.filter((item: any) => item.category === "Food" || item.category === "Shopify-Ecommerce")

      if (filteredData.length > 0) {
        setAccounts(filteredData)
        setBusinessCategory(filteredData[0].category)
      }
    } catch (error: any) {
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
        receive_amount: paymentUpdateModal.receiveAmount,
      })

      handleClosePaymentUpdate()
      setError(null)
    } catch (err: any) {
      setError("Failed to send payment update. Please try again.")
    } finally {
      setPaymentUpdateModal((prev) => ({ ...prev, loading: false }))
    }
  }

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
      }
    } catch (error) {
      console.error("Error fetching customer order count:", error)
    } finally {
      setLoadingOrderCount(false)
    }
  }

  const handleSendFeedback = async () => {
    if (!feedbackOrder || !token) {
      setFeedbackMessage("Missing order information or authentication token.")
      return
    }

    setFeedbackLoading(true)
    const result = await sendFeedbackToCustomer(feedbackOrder, token)

    if (result.success) {
      setFeedbackMessage(result.message)
      setTimeout(() => {
        setFeedbackModalOpen(false)
        setFeedbackOrder(null)
        setFeedbackMessage("")
        loadOrderData()
      }, 1000)
      loadOrderData()
    } else {
      setFeedbackMessage(result.error)
    }
    setFeedbackLoading(false)
  }

  const totalPages = apiResponse ? Math.ceil(apiResponse.count / 10) : 1

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f9fafb",
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827" }}>
                Order Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
                Manage order confirmations, messages, and customer communications
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <select
                value={businessCategory || ""}
                onChange={handleCategoryChange}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
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
              <Button variant="contained" startIcon={<Settings />} onClick={() => setSettingsDialog(true)}>
                Settings
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Analytics Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827", mb: 2 }}>
            Order Analytics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Total Orders"
                value={orderAnalytics.total_orders}
                icon={ShoppingCart}
                tooltip="Total number of orders received in the system"
                color="#3b82f6"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Pending Orders"
                value={orderAnalytics.pending_orders}
                icon={Warning}
                tooltip="Orders awaiting confirmation from customer. Action required."
                color="#f59e0b"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Confirmed Orders"
                value={orderAnalytics.confirmed_orders}
                icon={CheckCircle}
                tooltip="Orders that have been confirmed and are ready for processing"
                color="#10b981"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Cancelled Orders"
                value={orderAnalytics.cancelled_orders}
                icon={Cancel}
                tooltip="Orders that have been cancelled or failed"
                color="#ef4444"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Message Status Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827", mb: 2 }}>
            Message Status Distribution
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
                      Sent
                    </Typography>
                    <Tooltip title={messageStatusTooltips.sent} arrow placement="right">
                      <InfoIcon sx={{ fontSize: 18, color: "#9ca3af", cursor: "help" }} />
                    </Tooltip>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Send sx={{ color: "#3b82f6", fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#3b82f6" }}>
                      245
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
                      Delivered
                    </Typography>
                    <Tooltip title={messageStatusTooltips.delivered} arrow placement="right">
                      <InfoIcon sx={{ fontSize: 18, color: "#9ca3af", cursor: "help" }} />
                    </Tooltip>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircle sx={{ color: "#06b6d4", fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#06b6d4" }}>
                      189
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
                      Read
                    </Typography>
                    <Tooltip title={messageStatusTooltips.read} arrow placement="right">
                      <InfoIcon sx={{ fontSize: 18, color: "#9ca3af", cursor: "help" }} />
                    </Tooltip>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircle sx={{ color: "#10b981", fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#10b981" }}>
                      156
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
                      Failed
                    </Typography>
                    <Tooltip title={messageStatusTooltips.failed} arrow placement="right">
                      <InfoIcon sx={{ fontSize: 18, color: "#9ca3af", cursor: "help" }} />
                    </Tooltip>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ErrorIcon sx={{ color: "#ef4444", fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#ef4444" }}>
                      12
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Filters and Controls */}
        <Card sx={{ mb: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Stack direction="row" spacing={1} flex={1}>
                <TextField
                  select
                  label="Status"
                  value={filters.status}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="all">All Orders</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Sort By"
                  value={filters.ordering}
                  onChange={(e) => handleOrderingChange(e.target.value)}
                  size="small"
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="created_at">Newest First</MenuItem>
                  <MenuItem value="-created_at">Oldest First</MenuItem>
                  <MenuItem value="total_price">Price: Low to High</MenuItem>
                  <MenuItem value="-total_price">Price: High to Low</MenuItem>
                </TextField>
              </Stack>
              <Button variant="outlined" startIcon={<Refresh />} onClick={loadOrderData} disabled={loading}>
                Refresh
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Orders Table */}
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
                          ${order.total_price}
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

        {/* Payment Update Dialog */}
        <Dialog open={paymentUpdateModal.order !== null} onClose={handleClosePaymentUpdate} maxWidth="sm" fullWidth>
          <DialogTitle>Send Payment Update</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            {paymentUpdateModal.order && (
              <Stack spacing={2}>
                <Typography variant="body2">
                  <strong>Order:</strong> {paymentUpdateModal.order.order_number}
                </Typography>
                <Typography variant="body2">
                  <strong>Customer:</strong> {paymentUpdateModal.order.customer?.name}
                </Typography>
                <TextField
                  label="Amount Received"
                  type="number"
                  fullWidth
                  value={paymentUpdateModal.receiveAmount}
                  onChange={(e) =>
                    setPaymentUpdateModal((prev) => ({
                      ...prev,
                      receiveAmount: e.target.value,
                    }))
                  }
                />
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePaymentUpdate}>Cancel</Button>
            <Button onClick={handleSendPaymentUpdate} variant="contained" disabled={paymentUpdateModal.loading}>
              {paymentUpdateModal.loading ? "Sending..." : "Send via WhatsApp"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Order Details Dialog - COMPLETE INFO */}
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
                      <Tooltip title="How the order was communicated to the customer">
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
                            <Tooltip title="Whether the invoice has been sent to the customer">
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
                            <Tooltip title="Whether shipping tracking has been sent to the customer">
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
                            {selectedOrder.feedback_msg_status || (selectedOrder.feedback_msg ? "Pending" : "Not Sent")}
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
                            ${Number(selectedOrder.total_price).toFixed(2)}
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
                              ${Number(selectedOrder.remaining_amount).toFixed(2)}
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
                            {item.description && (
                              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                {item.description}
                              </Typography>
                            )}
                            {item.size && (
                              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                Size: {item.size}
                              </Typography>
                            )}
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                Unit Price
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                ${(Number(item.total_price) / item.quantity).toFixed(2)}
                              </Typography>
                            </Stack>
                            <Divider />
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Total
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: "#3b82f6" }}>
                                ${Number(item.total_price).toFixed(2)}
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
                                Shopify Order #
                              </Typography>
                              <Tooltip title="The original Shopify order number">
                                <InfoIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                              </Tooltip>
                            </Stack>
                            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                              {selectedOrder.shopify_order_number}
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

        {/* Error Alert */}
        {error && (
          <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Box>
        )}
      </Container>
    </Box>
  )
}
