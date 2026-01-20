"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@mui/material/styles"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { LineChart, Line, BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { getBaseUrl } from "@/api/vars/vars"

// Pakistan timezone
const PAKISTAN_TIMEZONE = "Asia/Karachi"

interface OrdersChartProps {
  selectedDays: string
  onTotalOrdersChange?: (total: number) => void
  onPeakHourChange?: (peakHour: { hour: number; count: number }) => void
}

interface ChartDataItem {
  label: string
  orders: number
  date: string
  rawDate: string
}

interface HourlyDataItem {
  hour: number
  hourDisplay: string
  orders: number
  isPeak: boolean
}

export default function OrdersChart({ selectedDays, onTotalOrdersChange, onPeakHourChange }: OrdersChartProps) {
  const theme = useTheme()

  const [ordersChartData, setOrdersChartData] = useState<ChartDataItem[]>([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [peakHour, setPeakHour] = useState({ hour: 0, count: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [periodInfo, setPeriodInfo] = useState("")
  const [hourlyOrders, setHourlyOrders] = useState<HourlyDataItem[]>([])

 
  // Format hour for display (e.g., "2 PM", "10 AM")
  const formatHour = (hour: number) => {
    const date = new Date()
    date.setHours(hour, 0, 0, 0)
    return date.toLocaleTimeString("en-PK", { 
      timeZone: PAKISTAN_TIMEZONE,
      hour: "numeric",
      hour12: true
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

        
        const formatChartData = (data: any[]) => {
  if (selectedDays !== "90") {
    // 7 or 30 days → daily
    return data.map(item => ({
      label: new Date(item.date).toLocaleDateString("en-PK", {
        timeZone: PAKISTAN_TIMEZONE,
        weekday: selectedDays === "7" ? "short" : undefined,
        month: "short",
        day: "numeric",
      }),
      orders: item.order_count || 0,
      rawDate: item.date,
    }))
  }

  // 90 days → weekly data, use label as-is
  return data.map(item => ({
    label: item.label || item.date,
    orders: item.order_count || 0,
    rawDate: item.date,
  }))
}




        // Generate mock hourly data for demonstration
        // In production, you should get this from your API
        const generateHourlyData = () => {
          const hours: HourlyDataItem[] = []
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
              isPeak: (hour >= 10 && hour <= 14) || (hour >= 18 && hour <= 21)
            })
          }
          return hours
        }

        const chartData: any = formatChartData(data.chart_data)
        const periodText = `${data.summary.start_date} to ${data.summary.end_date} (PKT)`
        const hourlyData = generateHourlyData()
        
        // Find peak hour
        const peak = hourlyData.reduce((max, item) => 
          item.orders > max.orders ? item : max, 
          { hour: 0, hourDisplay: "", orders: 0, isPeak: false }
        )

        setOrdersChartData(chartData)
        setTotalOrders(data.summary.total_orders)
        setPeakHour({ hour: peak.hour, count: peak.orders })
        setPeriodInfo(periodText)
        setHourlyOrders(hourlyData)

        // Notify parent components if callbacks provided
        if (onTotalOrdersChange) {
          onTotalOrdersChange(data.summary.total_orders)
        }
        if (onPeakHourChange) {
          onPeakHourChange({ hour: peak.hour, count: peak.orders })
        }
      } catch (error) {
        console.error("Error fetching orders data:", error)
        // Keep existing data on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrdersData()
  }, [selectedDays, onTotalOrdersChange, onPeakHourChange])

  // Custom tooltip for orders chart
  const OrdersTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "8px",
            padding: "12px",
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Typography variant="body2" sx={{ color: theme.palette.primary.main }}>
              Orders:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {payload[0].value} orders
            </Typography>
          </Box>
        </Box>
      )
    }
    return null
  }

  // Custom tooltip for hourly chart
  const HourlyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "8px",
            padding: "12px",
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Typography variant="body2" sx={{ color: theme.palette.secondary.main }}>
              Orders:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {payload[0].value} orders
            </Typography>
          </Box>
          {payload[0].payload.isPeak && (
            <Typography variant="caption" sx={{ color: theme.palette.warning.main, mt: 1, display: 'block' }}>
              ⚡ Peak hour
            </Typography>
          )}
        </Box>
      )
    }
    return null
  }

  return (
    <>
      {/* Orders Trend Chart */}
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box>
              <Typography variant="h6">Orders Trend</Typography>
              {periodInfo && (
                <Typography variant="caption" color="text.secondary">
                  {periodInfo}
                </Typography>
              )}
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {isLoading ? "Loading..." : `${totalOrders.toLocaleString()} orders`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg: {isLoading ? "..." : `${(totalOrders / parseInt(selectedDays)).toFixed(1)}/day`}
              </Typography>
            </Box>
          </Box>
          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={ordersChartData.length > 0 ? ordersChartData : []}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis 
                dataKey="label" 
                stroke={theme.palette.text.disabled}
                tick={{ fontSize: 12 }}
                angle={selectedDays === "7" ? 0 : -45}
                textAnchor={selectedDays === "7" ? "middle" : "end"}
                height={60}
              />
              <YAxis 
                stroke={theme.palette.text.disabled}
                label={{ 
                  value: 'Orders', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: 10,
                  style: { fill: theme.palette.text.secondary }
                }}
              />
              <Tooltip content={<OrdersTooltip />} />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={() => <span style={{ color: theme.palette.text.primary }}>Orders</span>}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke={theme.palette.primary.main}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    
    </>
  )
}
