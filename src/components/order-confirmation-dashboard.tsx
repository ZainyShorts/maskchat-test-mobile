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
  Collapse,
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
  ArrowDropDown,
  ArrowDropUp,
} from "@mui/icons-material"

// Use environment variable for API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/"
const STORAGE_KEY = "order_confirmation_state_v1"

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

const mockBusinessSettings = {
  sms: true,
  whatsapp: true,
  invoice: true,
  call: true,
  available_calls: true,
}

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  return {
    Authorization: `Token ${token || ""}`,
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

function OrderRowItem({ 
  order, 
  businessCategory, 
  businessData, 
  onViewDetails, 
  onSendFeedback, 
  onPaymentUpdate,
  onCancelOrder,
  onViewOrder 
}: any) {
  const [expanded, setExpanded] = useState(false)

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

  return (
    <>
      <TableRow hover sx={{ cursor: "pointer" }}>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
            </IconButton>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                {order.order_number}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(order.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="body2" fontWeight="600">
            {order.customer?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {order.customer?.account_id}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">
            {businessData[0]?.currency?.symbol || "$"} {Number(order.total_price)}
          </Typography>
          {Number(order.remaining_amount) > 0 && (
            <Typography variant="caption" color="error.main" display="block">
              Remaining: {businessData[0]?.currency?.symbol || "$"} {Number(order.remaining_amount)}
            </Typography>
          )}
        </TableCell>

        <TableCell>
          <Chip
            label={order.status.replace("_", " ").toUpperCase()}
            color={getStatusColor(order.status) as any}
            size="small"
          />
        </TableCell>

        <TableCell>
          <Stack direction="row" spacing={1}>
            <Tooltip title="View Details">
              <IconButton size="small" onClick={() => onViewDetails(order)}>
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send Feedback">
              <Button
                size="small"
                variant="text"
                color="success"
                onClick={() => onSendFeedback(order)}
              >
                Feedback
              </Button>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={5} sx={{ p: 0, borderBottom: "none" }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ p: 3, bgcolor: "background.paper" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    📦 Order Items
                  </Typography>
                  <Stack spacing={1}>
                    {order.order_items.slice(0, 3).map((item: any) => (
                      <Typography key={item.id} variant="body2">
                        • {item.name} (Qty: {item.quantity})
                      </Typography>
                    ))}
                    {order.order_items.length > 3 && (
                      <Typography variant="caption" color="text.secondary">
                        +{order.order_items.length - 3} more items
                      </Typography>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    📨 Communication Status
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      Invoice: <strong>{order.invoice_sent ? "✓ Sent" : "✗ Pending"}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Message: <strong>{order.msg_status?.toUpperCase() || "Not Sent"}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Feedback: <strong>{order.feedback_msg_status?.toUpperCase() || "Not Sent"}</strong>
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} sx={{ pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onViewOrder(order)}
                    >
                      View Full Order
                    </Button>
                    {Number(order.remaining_amount) > 0 && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => onPaymentUpdate(order)}
                        startIcon={<Payment fontSize="small" />}
                      >
                        Update Payment
                      </Button>
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      disabled={order.status === "confirmed"}
                      onClick={() => onCancelOrder(order)}
                    >
                      Cancel Order
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function OrderConfirmationDashboard() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : ""

  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [businessSettings, setBusinessSettings] = useState(mockBusinessSettings)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderAnalytics, setOrderAnalytics] = useState<OrderAnalytics>({
    total_orders: 0,
    pending_orders: 0,
    confirmed_orders: 0,
    cancelled_orders: 0,
  })
  const [businessData, setBusinessData] = useState<any[]>([{ currency: { symbol: "$" } }])
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    ordering: "-created_at",
    page: 1,
  })
  const [businessCategory, setBusinessCategory] = useState<string>("")
  const [paymentUpdateModal, setPaymentUpdateModal] = useState<any>({
    order: null,
    receiveAmount: "",
    loading: false,
  })
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [feedbackOrder, setFeedbackOrder] = useState<any>(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)

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
      try {
        const analytics = await fetchOrderAnalytics()
        setOrderAnalytics(analytics)
      } catch (err) {
        console.error("Failed to load order analytics:", err)
      }
    }
    loadSettings()
  }, [])

  const loadOrderData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchOrderConfirmationData(filters, businessCategory)
      setApiResponse(response)
      setOrders(response.results)
    } catch (err) {
      setError("Failed to load orders. Please check your API connection.")
      console.error(err)
    } finally {
      setLoading(false)
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
    setPaymentUpdateModal((prev: any) => ({ ...prev, loading: true }))
    try {
      const response = await fetch(`${API_BASE_URL}order-confirmations/send_whatsapp_payment_update/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          order_id: paymentUpdateModal.order.id,
          phone_number: paymentUpdateModal.order.customer.account_id,
          customer_name: paymentUpdateModal.order.customer.name,
          receive_amount: paymentUpdateModal.receiveAmount,
        }),
      })

      if (response.ok) {
        handleClosePaymentUpdate()
        loadOrderData()
      } else {
        setError("Failed to send payment update")
      }
    } catch (err: any) {
      setError("Error sending payment update")
    } finally {
      setPaymentUpdateModal((prev: any) => ({ ...prev, loading: false }))
    }
  }

  const handleOpenFeedbackModal = (order: any) => {
    setFeedbackOrder(order)
    setFeedbackModalOpen(true)
  }

  const handleSendFeedback = async () => {
    if (!feedbackOrder || !token) return
    setFeedbackLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}feedback/send_whatsapp_order_feedback/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          order_id: feedbackOrder.id,
          phone_number: feedbackOrder.customer?.account_id,
          customer_name: feedbackOrder.customer?.name,
        }),
      })
      if (response.ok) {
        setFeedbackModalOpen(false)
        loadOrderData()
      }
    } catch (err) {
      setError("Failed to send feedback")
    } finally {
      setFeedbackLoading(false)
    }
  }

  const handleCancelOrder = async (order: Order) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const response = await fetch(`${API_BASE_URL}orders/${order.id}/`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: "cancelled" }),
        })
        if (response.ok) {
          loadOrderData()
        } else {
          setError("Failed to cancel order")
        }
      } catch (err) {
        setError("Failed to cancel order")
      }
    }
  }

  const totalPages = apiResponse ? Math.ceil(apiResponse.count / 10) : 1

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Orders
            </Typography>
            <Button variant="contained" startIcon={<Refresh />} onClick={loadOrderData} disabled={loading}>
              Refresh
            </Button>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage all order confirmations
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {orderAnalytics.total_orders}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: "warning.main" }}>
                    {orderAnalytics.pending_orders}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Confirmed
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: "success.main" }}>
                    {orderAnalytics.confirmed_orders}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Cancelled
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: "error.main" }}>
                    {orderAnalytics.cancelled_orders}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
              <TextField
                select
                label="Filter by Status"
                value={filters.status}
                onChange={(e) => handleStatusFilter(e.target.value)}
                size="small"
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="all">All Orders</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>

              <TextField
                select
                label="Sort by"
                value={filters.ordering}
                onChange={(e) => handleOrderingChange(e.target.value)}
                size="small"
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="-created_at">Newest First</MenuItem>
                <MenuItem value="created_at">Oldest First</MenuItem>
                <MenuItem value="-updated_at">Recently Updated</MenuItem>
              </TextField>

              <Box sx={{ flex: 1 }} />

              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                {apiResponse?.count || 0} orders found
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : orders.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <ShoppingCart sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No orders found
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "background.paper", borderBottom: "2px solid", borderColor: "divider" }}>
                        <TableCell>Order</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <OrderRowItem
                          key={order.id}
                          order={order}
                          businessCategory={businessCategory}
                          businessData={businessData}
                          onViewDetails={() => setSelectedOrder(order)}
                          onSendFeedback={() => handleOpenFeedbackModal(order)}
                          onPaymentUpdate={() => handleOpenPaymentUpdate(order)}
                          onCancelOrder={() => handleCancelOrder(order)}
                          onViewOrder={() => setSelectedOrder(order)}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {totalPages > 1 && (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <Pagination
                      count={totalPages}
                      page={filters.page}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="md" fullWidth>
          {selectedOrder && (
            <>
              <DialogTitle>
                <Typography variant="h6" fontWeight="bold">
                  Order #{selectedOrder.order_number}
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3} sx={{ mt: 0.5 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Customer Info
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        <strong>Name:</strong> {selectedOrder.customer?.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Phone:</strong> {selectedOrder.customer?.account_id}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Address:</strong> {selectedOrder.address}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Order Info
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        <strong>Status:</strong> {selectedOrder.status}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Total:</strong> {businessData[0]?.currency?.symbol || "$"} {Number(selectedOrder.total_price)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Items
                    </Typography>
                    <Stack spacing={1}>
                      {selectedOrder.order_items.map((item) => (
                        <Typography key={item.id} variant="body2">
                          • {item.name} (Qty: {item.quantity}) - {businessData[0]?.currency?.symbol || "$"} {Number(item.total_price)}
                        </Typography>
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedOrder(null)}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        <Dialog open={!!paymentUpdateModal.order} onClose={handleClosePaymentUpdate} maxWidth="sm" fullWidth>
          <DialogTitle>Send Payment Update</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {paymentUpdateModal.order && (
                <>
                  <Box sx={{ p: 2, bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Order #{paymentUpdateModal.order.order_number}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {paymentUpdateModal.order.customer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Remaining: {businessData[0]?.currency?.symbol || "$"} {Number(paymentUpdateModal.order.remaining_amount)}
                    </Typography>
                  </Box>

                  <TextField
                    label="Amount Received"
                    type="number"
                    inputProps={{ step: "0.01", min: "0" }}
                    value={paymentUpdateModal.receiveAmount}
                    onChange={(e) =>
                      setPaymentUpdateModal((prev: any) => ({
                        ...prev,
                        receiveAmount: e.target.value,
                      }))
                    }
                    fullWidth
                    placeholder="e.g., 500.50"
                  />

                  <Alert severity="info">
                    A WhatsApp message will be sent to the customer with this payment update.
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
              {paymentUpdateModal.loading ? "Sending..." : "Send"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Send Feedback Message</DialogTitle>
          <DialogContent>
            {feedbackOrder && (
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box sx={{ p: 2, bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Order #{feedbackOrder.order_number}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {feedbackOrder.customer?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feedbackOrder.customer?.account_id}
                  </Typography>
                </Box>
                <Alert severity="info">
                  Send a feedback message via WhatsApp to this customer?
                </Alert>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
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
