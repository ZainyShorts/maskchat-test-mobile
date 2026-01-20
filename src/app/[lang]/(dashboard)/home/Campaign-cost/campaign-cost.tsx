"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@mui/material/styles"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Tooltip from "@mui/material/Tooltip"
import InfoIcon from "@mui/icons-material/Info"
import { getBaseUrl } from "@/api/vars/vars"
import { LineChart, Line, ResponsiveContainer } from "recharts"

interface CampaignCostDashboardProps {
  selectedDays: "7" | "30" | "90" | string
}

interface CampaignCostData {
  summary: {
    total_cost_usd: string
    total_campaigns: number
    total_messages_sent: number
    avg_cost_per_message: string
    success_rate_percentage: number
  }
  period_info: {
    period_days: number
    start_date: string
    end_date: string
  }
  status_breakdown: {
    sent: number
    delivered: number
    read: number
    failed: number
    other: number
    total_tracked: number
  }
}

const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US")
}

const STATUS_TOOLTIPS = {
  sent: "Message was sent to WhatsApp servers but not yet delivered to customer's device (phone may be off or disconnected from internet)",
  delivered:
    "Message successfully reached the customer's phone, but they haven't opened your business profile or read it yet",
  read: "Customer has read your message",
  failed:
    "Message delivery failed - invalid number, no WhatsApp account on this number, or customer blocked your business newsletter",
}

const CardHeader = ({
  label,
  tooltipText,
  color,
}: {
  label: string
  tooltipText: string
  color?: string
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Tooltip
      title={tooltipText}
      arrow
      placement="top"
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: "#333",
            color: "#fff",
            fontSize: "0.75rem",
            padding: "8px 12px",
            borderRadius: "6px",
            maxWidth: "250px",
          },
        },
      }}
    >
      <InfoIcon sx={{ fontSize: "1rem", cursor: "pointer", opacity: 0.6, "&:hover": { opacity: 1 } }} />
    </Tooltip>
  </Box>
)

export default function CampaignCostDashboard({ selectedDays }: CampaignCostDashboardProps) {
  const theme = useTheme()
  const [totalCost, setTotalCost] = useState<string>("0.00")
  const [isLoading, setIsLoading] = useState(false)
  const [periodInfo, setPeriodInfo] = useState<string>("")
  const [statusData, setStatusData] = useState({
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
  })

  const generateTrendData = (value: number) => {
    const base = Math.max(1, Math.floor(value / 5))
    return [
      { v: Math.floor(base * 0.8) },
      { v: Math.floor(base * 1.2) },
      { v: Math.floor(base * 0.9) },
      { v: Math.floor(base * 1.3) },
      { v: Math.floor(base * 1.5) },
    ]
  }

  const sentTrendData = generateTrendData(statusData.sent)
  const deliveredTrendData = generateTrendData(statusData.delivered)
  const readTrendData = generateTrendData(statusData.read)
  const failedTrendData = generateTrendData(statusData.failed)

  useEffect(() => {
    const fetchCampaignCostData = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("auth_token")

        if (!token) {
          console.warn("No auth token found")
          return
        }

        const endpoint = `${getBaseUrl()}newsletter/campaign-cost-dashboard/?period=${selectedDays}`

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

        const data: CampaignCostData = await response.json()

        setTotalCost(Number.parseFloat(data.summary.total_cost_usd).toFixed(2))

        if (data.period_info) {
          const period = `${data.period_info.start_date} to ${data.period_info.end_date}`
          setPeriodInfo(period)
        }

        if (data.status_breakdown) {
          setStatusData({
            sent: data.status_breakdown.sent,
            delivered: data.status_breakdown.delivered,
            read: data.status_breakdown.read,
            failed: data.status_breakdown.failed,
          })
        }
      } catch (error) {
        console.error("Error fetching campaign cost data:", error)
        setTotalCost("0.00")
        setStatusData({
          sent: 0,
          delivered: 0,
          read: 0,
          failed: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaignCostData()
  }, [selectedDays])

  return (
    <Grid container spacing={2}>
      {/* Total Spent Card */}
      <Grid item sx={{ flex: "1 1 20%" }}>
        <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 1, border: `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Spent on Campaigns
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {isLoading ? "Loading..." : `$${totalCost}`}
              </Typography>
              {periodInfo && (
                <Typography variant="caption" color="text.secondary">
                  {periodInfo}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Sent Messages Card */}
      <Grid item sx={{ flex: "1 1 20%" }}>
        <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 1, border: `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <CardHeader label="Messages Sent" tooltipText={STATUS_TOOLTIPS.sent} color={theme.palette.info.main} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
              {isLoading ? "..." : formatNumber(statusData.sent)}
            </Typography>
            <Box sx={{ mt: 2, height: 30 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentTrendData}>
                  <Line type="monotone" dataKey="v" stroke={theme.palette.info.main} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Delivered Messages Card */}
      <Grid item sx={{ flex: "1 1 20%" }}>
        <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 1, border: `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <CardHeader label="Delivered" tooltipText={STATUS_TOOLTIPS.delivered} color={theme.palette.success.main} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
              {isLoading ? "..." : formatNumber(statusData.delivered)}
            </Typography>
            <Box sx={{ mt: 2, height: 30 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={deliveredTrendData}>
                  <Line type="monotone" dataKey="v" stroke={theme.palette.success.main} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Read Messages Card */}
      <Grid item sx={{ flex: "1 1 20%" }}>
        <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 1, border: `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <CardHeader label="Read" tooltipText={STATUS_TOOLTIPS.read} color={theme.palette.warning.main} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
              {isLoading ? "..." : formatNumber(statusData.read)}
            </Typography>
            <Box sx={{ mt: 2, height: 30 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={readTrendData}>
                  <Line type="monotone" dataKey="v" stroke={theme.palette.warning.main} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Failed Messages Card */}
      <Grid item sx={{ flex: "1 1 20%" }}>
        <Card sx={{ height: "100%", borderRadius: 2, boxShadow: 1, border: `1px solid ${theme.palette.divider}` }}>
          <CardContent>
            <CardHeader label="Failed" tooltipText={STATUS_TOOLTIPS.failed} color={theme.palette.error.main} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
              {isLoading ? "..." : formatNumber(statusData.failed)}
            </Typography>
            <Box sx={{ mt: 2, height: 30 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={failedTrendData}>
                  <Line type="monotone" dataKey="v" stroke={theme.palette.error.main} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
