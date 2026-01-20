"use client"
import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  Button,
  Container,
  Stack,
  Divider,
  TextField,
  Avatar,
  Paper,
} from "@mui/material"
import { ShoppingCart, Send, CheckCircle } from "@mui/icons-material"
import { getBaseUrl } from "@/api/vars/vars"

interface Thread {
  id: number
  author: string
  avatar?: string
  timestamp: string
  content: string
  type: "comment" | "system" | "action"
}

interface OrderDetailPageProps {
  params: {
    id: string
  }
}




interface Order {
  id: number
  shopify_order_number?: string
  order_items: any[]
  paid: boolean
  tracking: boolean
  created_at?: string
  customer: {
    name: string
    email: string
    account_id: string
},
  address: string
  order_url: string
  order_domain_url: string
  cart_data: any
  threads: any[]
}

// API
const API_BASE_URL = getBaseUrl()

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token")
  return {
    Authorization: `Token ${token}`,
    "Content-Type": "application/json",
  }
}

const fetchOrderConfirmationData = async (orderID: string): Promise<Order> => {
  try {
    const response = await fetch(`${API_BASE_URL}whatseat/orders/order-confirmation/${orderID}/`, {
      method: "GET",
      headers: getAuthHeaders(),
    })
    return await response.json()
  } catch (error) {
    console.error("Error fetching order confirmation data:", error)
    throw error
  }
}

// Component
export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const orderID = params.id
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddComment = async () => {
  if (!newComment.trim()) return

  setIsSubmitting(true)

  try {
    const response = await fetch(
      `${API_BASE_URL}whatseat/order-thread/create/`,
      {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: orderID,        // <-- order id
          title: newComment,     // <-- comment text
          type: "comment",       // <-- thread type
        }),
      }
    )

    if (!response.ok) {
      throw new Error("Failed to add comment")
    }

    await loadOrderData()
    setNewComment("")
  } catch (error) {
    console.error(error)
  } finally {
    setIsSubmitting(false)
  }
}

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "paid":
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

  const getThreadIcon = (type: Thread["type"]) => {
    switch (type) {
      case "action":
        return <Send sx={{ fontSize: 20, color: "#ff9800" }} />
      case "system":
        return <Send sx={{ fontSize: 20, color: "#2196f3" }} />
      case "comment":
        return <CheckCircle sx={{ fontSize: 20, color: "#4caf50" }} />
      default:
        return 
    }
  }

  function formatDate(isoDate?: string) {
    if (!isoDate) return ""
    const date = new Date(isoDate)
    const options: any = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
    return date.toLocaleString("en-US", options).replace("AM", "am").replace("PM", "pm")
  }

  const loadOrderData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchOrderConfirmationData(orderID)
      console.log('response',response)
      if (response) setOrder(response)
    } catch (err) {
      console.error("Failed to load order data:", err)
      setError("Failed to load order data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [])


  function extractShippingAddresses(shipping: any) {
      if (!shipping) return "";

  const parts = [
    shipping.address1,
    shipping.address2,
    shipping.city,
    shipping.province,
    shipping.zip,
    shipping.country
  ];

  return parts
    .filter(part => part && part.toString().trim() !== "")
    .join(", ");
}

function extractBillingAddresses(billing: any) {
    if (!billing) return "";

  const parts = [
    billing.address1,
    billing.address2,
    billing.city,
    billing.province,
    billing.zip,
    billing.country
  ];

  return parts
    .filter(part => part && part.toString().trim() !== "")
    .join(", ");
}


function capitalizeFirstLetter(str: string) {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}



  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: { xs: 1, sm: 2, md: 3 } }}>
      <Container maxWidth="xl">
        {/* Error Display */}
        {error && (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <Typography variant="body1" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Button variant="contained" color="primary" onClick={loadOrderData}>
              Retry
            </Button>
          </Box>
        )}

        {/* Header */}
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
                <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
                  #{order?.shopify_order_number}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={order?.paid === false ? "Payment pending" : "Paid"}
                    color={getStatusColor(order?.paid === false ? "pending" : "paid")}
                    variant="filled"
                    size="small"
                  />
                  <Chip
                    label={order?.tracking === false ? "Unfulfilled" : "Fulfilled"}
                    color={getStatusColor(order?.paid === false ? "default" : "paid")}
                    variant="filled"
                    size="small"
                  />
                </Stack>
              </Stack>
            }
            subheader={
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {formatDate(order?.created_at)}
              </Typography>
            }
          />
        </Card>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            {/* Order Items */}
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Order Items
                  </Typography>
                }
              />
              <Divider />
              <CardContent>
                {order && order!.order_items.map((item: any) => (
                  <Stack key={item.id} direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
                   
                    <Stack sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight="600">
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Size: {item.size} 
                      </Typography>
                       <Typography variant="caption" color="text.secondary">
                        Sku: {item.product_sku}
                      </Typography>
                        <Typography variant="body2">
                        Price: {item.total_price} × {item.quantity}
                        </Typography>
                        <br/>
                    </Stack>
                  </Stack>
                ))}
              </CardContent>
            </Card>

            {/* Timeline/Threads */}
            <Card>
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Timeline
                  </Typography>
                }
              />
              <Divider />
              <CardContent>
                {/* Add Comment Section */}
                <Paper sx={{ p: 2, mb: 3, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: "#7c3aed" }}>KM</Avatar>
                    <TextField
                      fullWidth
                      placeholder="Leave a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      multiline
                      minRows={3}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>
                  <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={<Send />}
                      onClick={handleAddComment}
                      disabled={isSubmitting || !newComment.trim()}
                    >
                      {isSubmitting ? "Posting..." : "Post"}
                    </Button>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    Only you and other staff can see comments
                  </Typography>
                </Paper>

                {/* Threads List */}
                <Stack spacing={2}>
                  {order && order.threads.map((thread: any) => (
                    <Box key={thread.id}>
                      <Stack direction="row" spacing={2}>
                        <Box sx={{ display: "flex", justifyContent: "center", pt: 0.5 }}>
                          {getThreadIcon(thread.type)}
                        </Box>
                        <Stack sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" fontWeight="600">
                             {thread.type == 'comment' ? "Business": "System"} 
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {thread.title}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Divider sx={{ my: 2 }} />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Customer Info */}
            <Card sx={{ mb: 3 }}>
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Customer
                  </Typography>
                }
              />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <Stack>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      {capitalizeFirstLetter(order?.customer?.name || "")}
                    </Typography>
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Contact information
                    </Typography>
                    <Typography
                      variant="body2"
                      component="a"
                      href={`mailto:${order?.cart_data?.email ?? order?.cart_data?.customer?.email }`}
                      sx={{ color: "primary.main", textDecoration: "none" }}
                    >
                      {order?.cart_data?.email ?? order?.cart_data?.customer?.email }
                    </Typography>
                    <Typography variant="body2">{order?.customer?.account_id}</Typography>
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Shipping address
                    </Typography>
                    <Typography variant="body2">{extractShippingAddresses(order?.cart_data?.shipping_address)}</Typography>
                     <Typography variant="body2">{order?.customer?.account_id}</Typography>
                    <Button variant="text" size="small" color="primary" sx={{ justifyContent: "flex-start", pl: 0 }} onClick={() => {
                              if (order?.order_url && order?.order_domain_url) {
                                window.open(`${order?.order_domain_url}${order?.order_url}`, "_blank")
                              }
                            }}>
                      View Order On Shopify
                    </Button>
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Billing address
                    </Typography>
                    <Typography variant="body2">{extractBillingAddresses(order?.cart_data?.billing_address)}</Typography>
                    
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Conversion Summary */}
            <Card>
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Conversion summary
                  </Typography>
                }
              />
              <Divider />
              {/* <CardContent>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1}>
                    <ShoppingCart sx={{ fontSize: 20, color: "text.secondary" }} />
                    <Typography variant="body2">{mockOrder.conversionSummary.orderNumber}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Send sx={{ fontSize: 20, color: "text.secondary" }} />
                    <Typography variant="body2">{mockOrder.conversionSummary.session}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Send sx={{ fontSize: 20, color: "text.secondary" }} />
                    <Typography variant="body2">{mockOrder.conversionSummary.duration}</Typography>
                  </Stack>
                </Stack>
              </CardContent> */}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
