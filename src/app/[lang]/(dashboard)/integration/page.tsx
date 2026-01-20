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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  Container,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  CircularProgress,
} from "@mui/material"
import { Google, Facebook, CheckCircle, Cancel, Settings, Refresh, LinkOff } from "@mui/icons-material"
import axios from "axios"
import { useRouter } from "next/navigation"
import { getBaseUrl, getBaseUrlForOAuth } from "@/api/vars/vars"
import { getAllBusiness } from "@/api/business"

interface Integration {
  id: string
  name: string
  provider: "google" | "meta"
  icon: React.ReactNode
  description: string
  isConnected: boolean
  permissions: string[]
  connectedAt?: string
}

export default function IntegrationsPage() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google",
      name: "Google",
      provider: "google",
      icon: <Google />,
      description: "Connect your Google account to access Google services and data",
      isConnected: false,
      permissions: ["Sheet", "Calendar", "Drive"],
    },
    {
      id: "meta",
      name: "Meta",
      provider: "meta",
      icon: <Facebook />,
      description: "Connect your Meta account for Facebook and Instagram integration",
      isConnected: false,
      permissions: ["Whatsapp", "Messenger", "Instagram"],
    },
  ])

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [permissionDialog, setPermissionDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [businessData, setBusinessData] = useState<string | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  const API_BASE = `${getBaseUrl()}integrations/`

  // 🚦 Redirect if no token
  useEffect(() => {
    if (!token) {
      router.push("/en/login")
      return
    }
    fetchGoogleCredentials()
  }, [])


    const fetchBusiness = useCallback(
          async (search?: string) => {
            try {
              setLoading(true)
         
              // Modify your API call to include search parameter
              const response:any = await getAllBusiness(search ? { search } : undefined)
      
              const newData = response?.data?.results || []
              console.log('businessData', newData[0]['business_id'])
              setBusinessData(newData[0]['business_id'])
      
            } catch (err: any) {
              // toast.error(err.message || "Failed to fetch businesses")
              console.log(err.message)
            }
          },
          [], // Remove businessAction from dependencies to prevent infinite loops
        )
      
        // Initial fetch - only run once on mount
        useEffect(() => {
          fetchBusiness()
        }, []) 

  // 🧠 Fetch Google Credentials
  const fetchGoogleCredentials = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}google-credentials/`, {
        headers: { Authorization: `Token ${token}` },
      })

      // If credentials exist, mark Google as connected
      if (res.data.data.length > 0) {
        setIntegrations((prev) =>
          prev.map((int) =>
            int.provider === "google"
              ? {
                  ...int,
                  isConnected: true,
                  connectedAt: res.data.data[0].created_at,
                }
              : int
          )
        )
      }
    } catch (err: any) {
      console.error("Fetch Google credentials failed:", err)
      if (err.response?.status === 401) {
        localStorage.removeItem("auth_token")
        router.push("/en/login")
      }
    } finally {
      setLoading(false)
    }
  }

  // 🌐 Redirect to Google OAuth
  const connectGoogle = () => {
    console.log('businessData in connectGoogle', businessData)
    const oauthUrl = `${getBaseUrlForOAuth()}integrations/auth/google/?state=${businessData}`
    window.location.href = oauthUrl
  }

  const handleConnectClick = (integration: Integration) => {
    if (integration.provider === "google") {
      setSelectedIntegration(integration)
      setPermissionDialog(true)
    }else{
      const appId = '299280309847138';
    const redirectUri = encodeURIComponent(
      "https://kosmosbackend.themaskchat.com/api/integrations/facebook/login/callback/"
    );
    const scope = "pages_show_list,pages_manage_metadata,pages_read_engagement";
    const authUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    window.location.href = authUrl;
    }
  }

  const handlePermissionGrant = () => {
    setPermissionDialog(false)
    connectGoogle()
  }

  // 🗑️ Delete Google Credentials
  const handleDeletePermission = async (integration: Integration) => {
    if (integration.provider !== "google") return
    setLoading(true)

    try {
      const res = await axios.get(`${API_BASE}google-credentials/`, {
        headers: { Authorization: `Token ${token}` },
      })

      if (res.data.data.length > 0) {
        const id = res.data.data[0].id
        await axios.delete(`${API_BASE}google-credentials/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        })
      }

      setIntegrations((prev) =>
        prev.map((int) =>
          int.id === integration.id
            ? { ...int, isConnected: false, connectedAt: undefined }
            : int
        )
      )
      setSuccessMessage(`${integration.name} disconnected successfully!`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      console.error("Delete error:", err)
      if (err.response?.status === 401) {
        localStorage.removeItem("auth_token")
        router.push("/en/login")
      } else {
        setError("Failed to disconnect. Try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant={isMobile ? "h5" : "h4"} component="h1" color="primary" fontWeight="bold">
                Integrations
              </Typography>
            }
            subheader={
              <Typography variant="h6" color="text.secondary">
                Connect and manage your third-party integrations
              </Typography>
            }
            action={
              <Button variant="outlined" startIcon={<Refresh />} disabled={loading}>
                Refresh
              </Button>
            }
          />
        </Card>

        {/* Success Alert */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          Click on any integration below to connect your account. You&apos;ll be asked to grant permissions for the services
          you want to use.
        </Alert>

        {/* Integrations Grid */}
        <Grid container spacing={3}>
          {integrations.map((integration) => (
            <Grid item xs={12} sm={6} md={6} key={integration.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: integration.provider === "google" ? "#4285F4" : "#1877F2",
                        width: 56,
                        height: 56,
                      }}
                    >
                      {integration.icon}
                    </Avatar>
                  }
                  title={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {integration.name}
                      </Typography>
                      <Chip
                        icon={integration.isConnected ? <CheckCircle /> : <Cancel />}
                        label={integration.isConnected ? "Connected" : "Not Connected"}
                        size="small"
                        color={integration.isConnected ? "success" : "default"}
                        variant="outlined"
                      />
                    </Stack>
                  }
                  subheader={
                    integration.isConnected && integration.connectedAt ? (
                      <Typography variant="body2" color="text.secondary">
                        Connected on {new Date(integration.connectedAt).toLocaleDateString()}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not yet connected
                      </Typography>
                    )
                  }
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {integration.description}
                  </Typography>

                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Available Permissions:
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {integration.permissions.map((permission) => (
                      <Chip
                        key={permission}
                        label={permission}
                        size="small"
                        variant="outlined"
                        color={integration.isConnected ? "primary" : "default"}
                      />
                    ))}
                  </Stack>
                </CardContent>

                <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
                  {!integration.isConnected ? (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => handleConnectClick(integration)}
                      disabled={loading}
                      startIcon={
                        loading && selectedIntegration?.id === integration.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Settings />
                        )
                      }
                    >
                      {loading && selectedIntegration?.id === integration.id ? "Connecting..." : "Enable"}
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeletePermission(integration)}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <LinkOff />}
                    >
                      {loading ? "Disconnecting..." : "Delete Permission"}
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Permission Dialog */}
        <Dialog open={permissionDialog} onClose={() => !loading && setPermissionDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: selectedIntegration?.provider === "google" ? "#4285F4" : "#1877F2",
                  width: 40,
                  height: 40,
                }}
              >
                {selectedIntegration?.icon}
              </Avatar>
              <Typography variant="h6" fontWeight="bold">
                Connect {selectedIntegration?.name}
              </Typography>
            </Stack>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Alert severity="info">
                You&apos;re about to connect your {selectedIntegration?.name} account. This will allow us to access the
                following permissions:
              </Alert>

              <Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  Requested Permissions:
                </Typography>
                <Stack spacing={1}>
                  {selectedIntegration?.permissions.map((permission) => (
                    <Stack key={permission} direction="row" alignItems="center" spacing={1}>
                      <CheckCircle sx={{ color: "success.main", fontSize: 20 }} />
                      <Typography variant="body2">{permission}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <Alert severity="warning">
                You will be redirected to {selectedIntegration?.name} to authorize this connection. Please make sure
                you&apos;re logged into the correct account.
              </Alert>

              <Typography variant="body2" color="text.secondary">
                By clicking &quot;Grant Permission&quot;, you agree to allow us to access your {selectedIntegration?.name} account
                with the permissions listed above. You can revoke these permissions at any time.
              </Typography>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setPermissionDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handlePermissionGrant}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
            >
              {loading ? "Processing..." : "Grant Permission"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}
