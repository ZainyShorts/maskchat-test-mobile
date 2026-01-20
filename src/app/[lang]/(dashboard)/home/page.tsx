"use client"

import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Clock, TrendingUp } from "lucide-react"
import { useTheme } from "@mui/material/styles"
import { getBaseUrl } from "@/api/vars/vars"
import { useEffect, useState } from "react"
import CampaignCostDashboard from "./Campaign-cost/campaign-cost"
import OrdersChart from "./OrderChart/order-chart"
import QRCodeDisplay from "./TemplateActions/TemplateActionsCards"

// Mock data - replace with your API calls
const timeSeriesData = [
  { day: 5, value: 25 },
  { day: 6, value: 28 },
  { day: 7, value: 32 },
  { day: 7.5, value: 33 },
  { day: 8, value: 35 },
  { day: 9, value: 37 },
  { day: 10, value: 38 },
  { day: 11, value: 38 },
]

const leadsData = [
  { day: 1, value: 80 },
  { day: 2, value: 85 },
  { day: 3, value: 95 },
  { day: 4, value: 110 },
  { day: 5, value: 125 },
]

const channelData = [
  { name: "Web", value: 64, color: "#6366f1" },
  { name: "Mobile", value: 30, color: "#8b5cf6" },
  { name: "Other", value: 6, color: "#d1d5db" },
]

const conversionData = [
  { name: "WhatsApp", value: 45, color: "#10b981" },
  { name: "Web", value: 35, color: "#6366f1" },
  { name: "Instagram", value: 20, color: "#ec4899" },
]

export default function HomePage() {
  const theme = useTheme()
  const PAKISTAN_TIMEZONE = "Asia/Karachi"

  const [selectedDays, setSelectedDays] = useState("7")
  const [ordersChartData, setOrdersChartData] = useState([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [peakHour, setPeakHour] = useState({ hour: 0, count: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [periodInfo, setPeriodInfo] = useState("")
  const [hourlyOrders, setHourlyOrders] = useState([])

  // Format date in Pakistan timezone
  const formatDateInPakTimezone = (dateString: string, days: string) => {
    try {
      const date = new Date(dateString)

      // Convert to Pakistan timezone
      const options: Intl.DateTimeFormatOptions = {
        timeZone: PAKISTAN_TIMEZONE,
        hour12: true,
      }

      if (days === "7") {
        // For 7 days: Show day name and date (e.g., "Mon, Jan 5")
        options.weekday = "short"
        options.month = "short"
        options.day = "numeric"
        return date.toLocaleDateString("en-PK", options)
      } else if (days === "30") {
        // For 30 days: Show date only (e.g., "Jan 5")
        options.month = "short"
        options.day = "numeric"
        return date.toLocaleDateString("en-PK", options)
      } else {
        // For 90 days: Show month and week (e.g., "Jan Week 1")
        const monthName = date.toLocaleDateString("en-PK", {
          timeZone: PAKISTAN_TIMEZONE,
          month: "short",
        })
        const pakDate = new Date(date.toLocaleString("en-US", { timeZone: PAKISTAN_TIMEZONE }))
        const weekNum = Math.ceil(pakDate.getDate() / 7)
        return `${monthName} Week ${weekNum}`
      }
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  // Format hour for display (e.g., "2 PM", "10 AM")
  const formatHour = (hour: number) => {
    const date = new Date()
    date.setHours(hour, 0, 0, 0)
    return date.toLocaleTimeString("en-PK", {
      timeZone: PAKISTAN_TIMEZONE,
      hour: "numeric",
      hour12: true,
    })
  }

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("auth_token")

        if (!token) {
          console.warn("No auth token found")
          return
        }

        const endpoint = `${getBaseUrl()}whatseat/analytics/time-save-graph/?days=${selectedDays}`

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()

        // Format chart data with Pakistan timezone
        const formatChartData = (chartDataArray: any, days: string) => {
          return chartDataArray.map((item: any) => {
            const label = formatDateInPakTimezone(item.date, days)

            return {
              label: label,
              orders: item.order_count || 0,
              date: item.date,
              rawDate: item.date, // Keep original for sorting if needed
            }
          })
        }

        // Generate mock hourly data for demonstration
        // In production, you should get this from your API
        const generateHourlyData = () => {
          const hours = []
          for (let hour = 0; hour < 24; hour++) {
            // Simulate peak hours (10 AM - 2 PM, 6 PM - 9 PM)
            let orderCount = 0
            if (hour >= 10 && hour <= 14) {
              orderCount = Math.floor(Math.random() * 20) + 15 // 15-35 orders
            } else if (hour >= 18 && hour <= 21) {
              orderCount = Math.floor(Math.random() * 15) + 10 // 10-25 orders
            } else {
              orderCount = Math.floor(Math.random() * 8) // 0-8 orders
            }

            hours.push({
              hour: hour,
              hourDisplay: formatHour(hour),
              orders: orderCount,
              isPeak: (hour >= 10 && hour <= 14) || (hour >= 18 && hour <= 21),
            })
          }
          return hours
        }

        const chartData = formatChartData(data.chart_data, selectedDays)
        const periodText = `${data.summary.start_date} to ${data.summary.end_date} (PKT)`
        const hourlyData: any = generateHourlyData()

        // Find peak hour
        const peak: any = hourlyData.reduce((max: any, item: any) => (item.orders > max.orders ? item : max), {
          orders: 0,
        })

        setOrdersChartData(chartData)
        setTotalOrders(data.summary.total_orders)
        setPeakHour({ hour: peak.hour, count: peak.orders })
        setPeriodInfo(periodText)
        setHourlyOrders(hourlyData)
      } catch (error) {
        console.error("Error fetching orders data:", error)
        // Keep existing data on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrdersData()
  }, [selectedDays])

  const handleDaysChange = (event: any) => {
    const daysValue = event.target.value
    const daysMap: Record<string, string> = {
      "7days": "7",
      "30days": "30",
      "90days": "90",
    }
    setSelectedDays(daysMap[daysValue] || "7")
  }

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "text.primary" }}>
          Mask Chat
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Select onChange={handleDaysChange} defaultValue="7days" size="small" sx={{ minWidth: 150 }}>
            <MenuItem value="7days">Last 7 days</MenuItem>
            <MenuItem value="30days">Last 30 days</MenuItem>
            <MenuItem value="90days">Last 90 days</MenuItem>
          </Select>
          <IconButton size="small">
            <Clock size={20} />
          </IconButton>
          <IconButton size="small">
            <TrendingUp size={20} />
          </IconButton>
        </Box>
      </Box>

      {/* Business Label */}
      <Typography variant="subtitle2" sx={{ mb: 3, color: "text.secondary", textTransform: "uppercase" }}>
        Analytics
      </Typography>

      {/* Campaign Cost Dashboard */}
      <Box sx={{ mb: 4 }}>
        <CampaignCostDashboard selectedDays={selectedDays} />
      </Box>

      {/* Orders Chart - Full Width */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <OrdersChart
                selectedDays={selectedDays}
                onTotalOrdersChange={setTotalOrders}
                onPeakHourChange={setPeakHour}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Metrics Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Human Handovers & Response Time */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Human Handovers
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, my: 2 }}>
                58
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Escalations
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Avg Response-Time
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  1m
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  %% %%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI vs Human Response Time */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Avg Response-Time
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  AI
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1 }}>
                  <Box sx={{ flex: 1, height: 8, bgcolor: "action.disabledBackground", borderRadius: 1 }}>
                    <Box sx={{ width: "20%", height: "100%", bgcolor: "primary.main", borderRadius: 1 }} />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Human
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, my: 1 }}>
                  1m 8s
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ flex: 1, height: 8, bgcolor: "action.disabledBackground", borderRadius: 1 }}>
                    <Box sx={{ width: "60%", height: "100%", bgcolor: "success.main", borderRadius: 1 }} />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Messages by Channel */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Messages by Channel
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 180,
                  position: "relative",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Web", value: 64, color: theme.palette.primary.main },
                        { name: "Mobile", value: 30, color: theme.palette.secondary.main },
                        { name: "Other", value: 6, color: theme.palette.action.disabled },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {[
                        { color: theme.palette.primary.main },
                        { color: theme.palette.secondary.main },
                        { color: theme.palette.action.disabled },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    84%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  64% Web
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  30% Mobile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  0% Other
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Performance */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Performance
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">AI Accuracy Score</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    92 %
                  </Typography>
                </Box>
                <Box sx={{ height: 8, bgcolor: "action.disabledBackground", borderRadius: 1 }}>
                  <Box sx={{ width: "92%", height: "100%", bgcolor: "success.main", borderRadius: 1 }} />
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Processing Speed</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    98 %
                  </Typography>
                </Box>
                <Box sx={{ height: 8, bgcolor: "action.disabledBackground", borderRadius: 1 }}>
                  <Box sx={{ width: "98%", height: "100%", bgcolor: "info.main", borderRadius: 1 }} />
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Customer Satisfaction</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    89 %
                  </Typography>
                </Box>
                <Box sx={{ height: 8, bgcolor: "action.disabledBackground", borderRadius: 1 }}>
                  <Box sx={{ width: "89%", height: "100%", bgcolor: "warning.main", borderRadius: 1 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Metrics Row 2 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Messages by Type */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Messages Distribution
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 250,
                  position: "relative",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "WhatsApp", value: 45, color: theme.palette.success.main },
                        { name: "Web", value: 35, color: theme.palette.primary.main },
                        { name: "Instagram", value: 20, color: theme.palette.secondary.main },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {[
                        { color: theme.palette.success.main },
                        { color: theme.palette.primary.main },
                        { color: theme.palette.secondary.main },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  45% WhatsApp
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  35% Web
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  20% Instagram
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* QR Code Display */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <QRCodeDisplay />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
