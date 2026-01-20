"use client"
import {
  Box,
  Typography,
  Button,
  Avatar,
  AppBar,
  Toolbar,
  useTheme,
  alpha,
  Container,
  Grid,
  Card,
  CardContent,
  Zoom,
} from "@mui/material"
import {
  SmartToy as BotIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Chat as MessageSquareIcon,
  MonetizationOn as CoinsIcon,
} from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getBaseUrl } from "@/api/vars/vars"

interface DashboardHeaderProps {
  agents: Array<{
    id: string
    name: string
    type: "faq" | "support" | "sales"
    enabled: boolean
    documents: string[]
    description: string
    conversations: number
    satisfaction: number
  }>
  tokenBalance: number
}

export default function DashboardHeader({ agents, tokenBalance }: DashboardHeaderProps) {
  const theme = useTheme()
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const totalConversations = agents.reduce((sum, agent) => sum + agent.conversations, 0)
  const avgSatisfaction =
    agents.length > 0 ? Math.round(agents.reduce((sum, agent) => sum + agent.satisfaction, 0) / agents.length) : 0

  const stats = [
    {
      title: "Active Agents",
      value: analytics?.total_Agents|| 0,
      icon: BotIcon,
      color: "#1976d2",
      gradient: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
    },
    {
      title: "Conversations",
      value: analytics?.conversations || 0,
      icon: MessageSquareIcon,
      color: "#388e3c",
      gradient: "linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)",
    },
    {
      title: "Leads",
      value: analytics?.complete_conversations || 0,
      icon: TrendingUpIcon,
      color: "#7b1fa2",
      gradient: "linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%)",
    },
    {
      title: "Token Balance",
      value: `${analytics?.balance_usd || 0}`,
      icon: CoinsIcon,
      color: "#f57c00",
      gradient: "linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)",
    },
  ]

  useEffect(() => {
    const fetchAnalytics = async () => {
      const auth_token = localStorage.getItem("auth_token")

      if (!auth_token) {
        router.push("/en/login")
        return
      }

      try {
        const res = await fetch(`${getBaseUrl()}agents/analytics/me/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${auth_token}`,
          },
        })

        if (!res.ok) {
          if (res.status === 401) {
            router.push("/en/login")
            return
          }
          throw new Error("Failed to fetch analytics")
        }

        const data = await res.json()
        console.log('analytics',data)
        setAnalytics(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [router])

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        pb: { xs: 2, md: 4 },
      }}
    >
      {/* Premium Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          backdropFilter: "blur(20px)",
        }}
      >
        <Toolbar sx={{ py: { xs: 1, md: 2 } }}>
          <Avatar
            sx={{
              mr: { xs: 2, md: 3 },
              width: { xs: 40, md: 56 },
              height: { xs: 40, md: 56 },
              background: `linear-gradient(135deg, ${alpha("#fff", 0.2)} 0%, ${alpha("#fff", 0.1)} 100%)`,
              backdropFilter: "blur(10px)",
              border: `2px solid ${alpha("#fff", 0.2)}`,
            }}
          >
            <BotIcon sx={{ fontSize: { xs: 20, md: 28 }, color: "#fff" }} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#fff",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                mb: 0.5,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
              }}
            >
              AI Chatbot Dashboard
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: alpha("#fff", 0.9),
                fontWeight: 400,
                fontSize: { xs: "0.875rem", md: "1.25rem" },
                display: { xs: "none", sm: "block" },
              }}
            >
              Create and manage intelligent AI assistants
            </Typography>
          </Box>
          
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
        {/* Premium Stats Overview */}
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Zoom in timeout={300 + index * 100}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    background: stat.gradient,
                    color: "#fff",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${alpha("#fff", 0.1)} 0%, transparent 100%)`,
                      pointerEvents: "none",
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, md: 3 }, position: "relative", zIndex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: alpha("#fff", 0.9),
                          fontWeight: 500,
                          fontSize: { xs: "0.75rem", md: "0.875rem" },
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <stat.icon sx={{ fontSize: { xs: 20, md: 28 }, opacity: 0.8 }} />
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
