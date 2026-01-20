"use client"

import * as React  from "react"
import { useRouter } from "next/navigation"
import { getAllBusiness } from "@/api/business"
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Stack,
  Switch,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material"

import KeyIcon from "@mui/icons-material/VpnKey"
import MonetizationIcon from "@mui/icons-material/MonetizationOn"
import UploadIcon from "@mui/icons-material/UploadFile"
import CodeIcon from "@mui/icons-material/Code"
import HelpCenterIcon from "@mui/icons-material/HelpCenter"
import HeadphonesIcon from "@mui/icons-material/Headphones"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import VisibilityIcon from "@mui/icons-material/Visibility"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import DescriptionIcon from "@mui/icons-material/Description"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import BoltIcon from "@mui/icons-material/Bolt"
import CloseIcon from "@mui/icons-material/Close"

import { integrationOptions } from "./data"
import { getBaseUrl } from "@/api/vars/vars"

type AgentType = "faq" | "support" | "sales"

type Agent = {
  id: string
  name: string
  type: AgentType
  enabled: boolean
  documents: Array<{ title: string; file_id?: string }>
  description: string
  conversations: number
  vector_store_id?: string
  playground: boolean
}

const agentTypeConfig: Record<
  AgentType,
  {
    icon: React.ElementType
    color: string
    label: string
    description: string
    gradient: (themeMode: "light" | "dark") => string
  }
> = {
  faq: {
    icon: HelpCenterIcon,
    color: "rgb(25, 118, 210)",
    label: "FAQ",
    description: "Handles frequently asked questions",
    gradient: (mode) =>
      mode === "light" ? "linear-gradient(135deg, #1e88e5, #1565c0)" : "linear-gradient(135deg, #1565c0, #0d47a1)",
  },
  support: {
    icon: HeadphonesIcon,
    color: "rgb(123, 31, 162)",
    label: "Support",
    description: "Provides technical support",
    gradient: (mode) =>
      mode === "light" ? "linear-gradient(135deg, #8e24aa, #6a1b9a)" : "linear-gradient(135deg, #6a1b9a, #4a148c)",
  },
  sales: {
    icon: ShoppingCartIcon,
    color: "rgb(245, 124, 0)",
    label: "Sales",
    description: "Handles sales inquiries",
    gradient: (mode) =>
      mode === "light" ? "linear-gradient(135deg, #fb8c00, #ef6c00)" : "linear-gradient(135deg, #ef6c00, #e65100)",
  },
}

function gradientCircle(mode: "light" | "dark", css: string) {
  return {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: css,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  } as const
}

export default function DashboardContentMUI() {
  const theme = useTheme()
  const mode = theme.palette.mode as "light" | "dark"
  const mdDown = useMediaQuery(theme.breakpoints.down("md"))
  const router = useRouter()

  // State
  const [apiSource, setApiSource] = React.useState<"own" | "service">("service")
  const [ownApiKey, setOwnApiKey] = React.useState("")
  const [selectedAgent, setSelectedAgent] = React.useState<Agent | null>(null)
  const [showIntegrationDialog, setShowIntegrationDialog] = React.useState(false)
  const [integrationTab, setIntegrationTab] = React.useState(0)
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  })
  const [uploadingAgent, setUploadingAgent] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [tokenBalance, setTokenBalance] = React.useState<number>(1200)
  const [rechargeAmount, setRechargeAmount] = React.useState<number>(100)

  const [agents, setAgents] = React.useState<Agent[]>([])

  // Helpers
  const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
    setSnackbar({ open: true, message, severity })
  }

  // ---------- API helpers ----------
  const API_BASE = `${getBaseUrl()}agents`
  const [business_id,setBusiess_id] =  React.useState("")
  function getAuthToken() {
    return typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  }

    const fetchBusiness = React.useCallback(async () => {
      try {
        const response = await getAllBusiness()
        const businesses = response?.data?.results || []
        if (businesses){
          setBusiess_id(businesses[0].business_id)
          fetchChatbots(businesses[0].business_id)
        }
      } catch (err: any) {
        console.log(err.message)
      }
    }, [])
  
    // Initial data fetch - only on component mount
    React.useEffect(() => {
      fetchBusiness()
    }, [fetchBusiness])

  // Redirect if no token
  React.useEffect(() => {
    const t = getAuthToken()
    if (!t) router.push("/en/login")
  }, [router])

  // Fetch chatbots
  const fetchChatbots = React.useCallback(async (business_id: string) => {
    const token = getAuthToken()
    if (!token) return

    try {
      const res = await fetch(`${API_BASE}/chatbots/${business_id}/`, {
        // headers: { Authorization: `Token ${token}` },
      })
      if (res.status === 401) {
        router.push("/en/login")
        return
      }
      if (!res.ok) throw new Error("Failed to fetch chatbots")
      const data = await res.json()
      console.log(data)
      // Map API response to Agent[] used in UI
      const mapped: Agent[] = data.map((c: any) => ({
        id: String(c.id),
        name: c.name,
        type: "sales", // default - you can extend your backend to return type
        enabled: Boolean(c.status),
        playground: Boolean(c.playground),
        documents: (c.files || []).map((f: any) => ({ title: f.title || f.file_id, file_id: f.file_id })),
        description: c.description || "",
        conversations: c.conversations || 0,
        vector_store_id: c.vector_store_id,
      }))
      setAgents(mapped)
    } catch (err) {
      console.error(err)
      showSnackbar("Unable to load chatbots", "error")
    }
  }, [router])

  // Toggle chatbot status (calls PATCH .../toggle/)
  const apiToggleChatbot = React.useCallback(
    async (chatbotId: string, newStatus: boolean) => {
      const token = getAuthToken()
      if (!token) {
        router.push("/en/login")
        return
      }
      try {
        const res = await fetch(`${API_BASE}/chatbots/${chatbotId}/toggle/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        })
        if (res.status === 401) {
          router.push("/en/login")
          return
        }
        if (!res.ok) throw new Error("Failed to toggle chatbot")
        const data = await res.json()
        // update local state
        setAgents((prev) => prev.map((a) => (a.id === chatbotId ? { ...a, enabled: Boolean(data.status),playground: Boolean(data.playground) } : a)))
        showSnackbar("Agent status updated", "success")
      } catch (err) {
        console.error(err)
        showSnackbar("Failed to update agent status", "error")
        // revert toggle in UI (simple approach: refetch)
        fetchChatbots(business_id)
      }
    },
    [fetchChatbots, router],
  )


  // Toggle chatbot status (calls PATCH .../toggle/)
  const apiTogglePlaygroundChatbot = React.useCallback(
    async (chatbotId: string, newStatus: boolean) => {
      const token = getAuthToken()
      if (!token) {
        router.push("/en/login")
        return
      }
      try {
        const res = await fetch(`${API_BASE}/chatbots/${chatbotId}/toggle/playground/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        })
        if (res.status === 401) {
          router.push("/en/login")
          return
        }
        if (!res.ok) throw new Error("Failed to toggle chatbot")
        const data = await res.json()
        // update local state
        setAgents((prev) => prev.map((a) => (a.id === chatbotId ? { ...a, enabled: Boolean(data.status) } : a)))
        showSnackbar("Agent status updated", "success")
      } catch (err) {
        console.error(err)
        showSnackbar("Failed to update agent status", "error")
        // revert toggle in UI (simple approach: refetch)
        fetchChatbots(business_id)
      }
    },
    [fetchChatbots, router],
  )

  // Upload txt file to chatbot
  const apiUploadFile = React.useCallback(
    async (chatbotId: string, file: File, title?: string) => {
      const token = getAuthToken()
      if (!token) {
        router.push("/en/login")
        return { success: false }
      }

      // validate extension (only .txt allowed per API)
      const ext = "." + (file.name.split(".").pop() || "").toLowerCase()
      if (ext !== ".txt") {
        showSnackbar("Only .txt files allowed", "error")
        return { success: false }
      }

      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        showSnackbar("File too large (max 10MB)", "error")
        return { success: false }
      }

      const formData = new FormData()
      formData.append("file", file)
      // send title (optional) and force type=user
      if (title) formData.append("title", title)
      formData.append("type", "user")

      try {
        const res = await fetch(`${API_BASE}/chatbots/${chatbotId}/upload-file/`, {
          method: "POST",
          headers: { Authorization: `Token ${token}` }, // DO NOT set Content-Type for multipart
          body: formData,
        })
        if (res.status === 401) {
          router.push("/en/login")
          return { success: false }
        }
        const data = await res.json()
        if (!res.ok) {
          console.error("Upload error", data)
          showSnackbar(data?.error || "Upload failed", "error")
          return { success: false }
        }

        // update local agent documents with returned title/file_id if available
        setAgents((prev) =>
          prev.map((a) =>
            a.id === chatbotId
              ? {
                  ...a,
                  documents: [
                    ...a.documents,
                    { title: data.title || file.name, file_id: data.file_id || data.file_id || undefined },
                  ],
                }
              : a,
          ),
        )
        showSnackbar("File uploaded and attached successfully", "success")
        return { success: true, data }
      } catch (err) {
        console.error(err)
        showSnackbar("Upload failed", "error")
        return { success: false }
      }
    },
    [router],
  )

  // Delete file from chatbot
  const apiDeleteFile = React.useCallback(
    async (chatbotId: string, fileId: string) => {
      const token = getAuthToken()
      if (!token) {
        router.push("/en/login")
        return
      }
      try {
        const res = await fetch(`${API_BASE}/chatbots/${chatbotId}/delete-file/${fileId}/`, {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        })
        if (res.status === 401) {
          router.push("/en/login")
          return
        }
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          showSnackbar(errData?.error || "Delete failed", "error")
          return
        }
        // remove from UI
        setAgents((prev) => prev.map((a) => (a.id === chatbotId ? { ...a, documents: a.documents.filter((d) => d.file_id !== fileId) } : a)))
        showSnackbar("File removed successfully", "success")
      } catch (err) {
        console.error(err)
        showSnackbar("Failed to delete file", "error")
      }
    },
    [router],
  )

  // ---------- UI callbacks wired to API ----------
  const toggleAgent = async (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId)
    if (!agent) return
    // optimistic UI flip
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, enabled: !a.enabled } : a)))
    await apiToggleChatbot(agentId, !agent.enabled)
  }

  const toggleAgentPlayground = async (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId)
    if (!agent) return
    // optimistic UI flip
    if(agent.enabled === false) return
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, playground: !a.playground } : a)))
    await apiTogglePlaygroundChatbot(agentId, !agent.playground)
  }

  const handleFileUpload = async (agentId: string, files: FileList | null) => {
    if (!files || files.length === 0) return

    // For this API, we send one file at a time (only .txt)
    const file = files[0]
    // Remove description part while uploading: (you said "remove description part while uploading file")
    // We will only send file + title (no description)
    const title = file.name.replace(/\.[^/.]+$/, "") // default title without ext

    setUploadingAgent(agentId)
    const result = await apiUploadFile(agentId, file, title)
    setUploadingAgent(null)
    // clear file input
    if (fileInputRef.current) fileInputRef.current.value = ""
    return result
  }

  const handleDeleteFile = async (agentId: string, fileId?: string) => {
    if (!fileId) {
      showSnackbar("No file id provided", "error")
      return
    }
    await apiDeleteFile(agentId, fileId)
  }

  // ---------- UI rendering ----------
  // Styles
  const cardBorder = (highlight = false) =>
    `1px solid ${highlight ? alpha(theme.palette.primary.main, 0.35) : theme.palette.divider}`

  return (
    <Box sx={{ maxWidth: 1500, mx: "auto", px: { xs: 2, md: 3 }, pb: 4, pt: 4 }}>
      <Grid item xs={12} lg={6}>
        <Card
          variant="outlined"
          sx={{
            border: cardBorder(false),
            backdropFilter: "blur(8px)",
          }}
        >
          <CardHeader
            avatar={
              <Box sx={gradientCircle(mode, "linear-gradient(135deg, #ec407a, #d81b60)")}>
                <MonetizationIcon fontSize="small" />
              </Box>
            }
            titleTypographyProps={{ variant: "h6", fontWeight: 700 }}
            title="Token Management"
            subheader="Purchase Credits"
            subheaderTypographyProps={{ color: "text.secondary" }}
          />

          <CardContent sx={{ pt: 0 }}>
            <Box
              sx={{
                p: { xs: 2, md: 3 },
                textAlign: "center",
                borderRadius: 2,
                border: "1px solid",
                borderColor: mode === "light" ? "primary.light" : "primary.dark",
                bgcolor: mode === "light" ? alpha(theme.palette.primary.light, 0.08) : alpha(theme.palette.primary.dark, 0.18),
                mb: 2.5,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #1e88e5, #ec407a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Buy $10 credits
              </Typography>
              <Typography color="text.secondary">for just $10</Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => {
                setTokenBalance((prev) => prev + 1000000)
                showSnackbar("Service not available", "error")
              }}
              startIcon={<BoltIcon />}
              sx={{ py: 1.25, fontWeight: 700 }}
            >
              Purchase Tokens 🔒
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Agent Management */}
      <Card variant="outlined" sx={{ mt: 3, border: cardBorder(false), backdropFilter: "blur(8px)" }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Grid item xs={12} md="auto">
              <Typography variant={mdDown ? "h5" : "h4"} fontWeight={700}>
                Agent Management
              </Typography>
              <Typography color="text.secondary">Create and manage your AI chatbot agents</Typography>
            </Grid>
            
          </Grid>

          <Grid container spacing={2}>
            {agents.map((agent) => {
              const cfg = agentTypeConfig[agent.type]
              const Icon = cfg.icon
              return (
                <Grid item xs={12} sm={6} lg={4} key={agent.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      transition: "all .2s ease",
                      border: cardBorder(agent.enabled),
                      "&:hover": { transform: "translateY(-2px)", boxShadow: 4 },
                      bgcolor: agent.enabled ? alpha(theme.palette.primary.main, mode === "light" ? 0.06 : 0.16) : undefined,
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={gradientCircle(mode, cfg.gradient(mode))}>
                            <Icon fontSize="small" />
                          </Box>
                          <Box>
                            <Typography fontWeight={700}>{agent.name}</Typography>
                            <Chip
                              size="small"
                              label={'Agent'}
                              sx={{
                                mt: 0.5,
                                fontWeight: 600,
                                bgcolor: `${cfg.color}20`,
                                color: cfg.color,
                              }}
                            />
                          </Box>
                        </Stack>

                        <div className="flex flex-col">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <PowerSettingsNewIcon color="primary" fontSize="small" />
                          <Switch checked={agent.enabled} onChange={() => toggleAgent(agent.id)} inputProps={{ "aria-label": "Agent status" }} />
                        </Stack>
                        {
                          agent.enabled && (
                            <>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <SmartToyIcon color="primary" fontSize="small" />
                            <Switch checked={agent.playground} onChange={() => toggleAgentPlayground(agent.id)} inputProps={{ "aria-label": "Agent status" }} />
                          </Stack>
                            </>
                          )
                         }
                          </div>     
                      </Stack>

                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {agent.description}
                      </Typography>

                      <Grid container spacing={2} mb={2}>
                        <Grid item xs={6}>
                          <Typography fontWeight={700}>{agent.conversations.toLocaleString()}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Conversations
                          </Typography>
                        </Grid>
                      </Grid>

                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Typography variant="body2" color="text.secondary">
                          Documents: {agent.documents.length}
                        </Typography>
                        <Tooltip title="Upload Documents (.txt only)">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setUploadingAgent(agent.id)
                              fileInputRef.current?.click()
                            }}
                          >
                            <UploadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <Button fullWidth variant="outlined" startIcon={<VisibilityIcon />} onClick={() => setSelectedAgent(agent)} sx={{ textTransform: "none" }}>
                          View
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Hidden file input (only .txt allowed per backend) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={false}
        accept=".txt"
        style={{ display: "none" }}
        onChange={async (e) => {
          const files = e.target.files
          if (uploadingAgent) {
            await handleFileUpload(uploadingAgent, files)
            setUploadingAgent(null)
          }
          if (e.target) e.target.value = ""
        }}
      />

      {/* Integration Dialog (unchanged) */}
      <Dialog open={showIntegrationDialog} onClose={() => setShowIntegrationDialog(false)} fullWidth maxWidth="xl" PaperProps={{ sx: { height: { xs: "95vh", sm: "80vh" } } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, background: mode === "light" ? "linear-gradient(90deg, rgba(33,150,243,0.06), rgba(156,39,176,0.06))" : "linear-gradient(90deg, rgba(33,150,243,0.16), rgba(156,39,176,0.16))" }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, background: "linear-gradient(135deg, #1e88e5, #8e24aa)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <CodeIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800}>
              Integration Code
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose your platform and copy the integration code
            </Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <IconButton onClick={() => setShowIntegrationDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <Grid container sx={{ height: { xs: "auto", md: 540 } }}>
            {/* Sidebar */}
            <Grid item xs={12} md={3} sx={{ borderRight: { md: "1px solid" }, borderBottom: { xs: "1px solid", md: "none" }, borderColor: "divider", bgcolor: mode === "light" ? "grey.50" : "background.default" }}>
              <Box sx={{ p: 1.5, height: "100%", overflow: "auto" }}>
                <Typography variant="overline" fontWeight={700} color="text.secondary" sx={{ px: 1.5 }}>
                  Platforms
                </Typography>
                <List dense sx={{ pt: 0 }}>
                  {integrationOptions.map((opt, idx) => {
                    const Icon = opt.icon
                    return (
                      <ListItemButton key={opt.name} selected={integrationTab === idx} onClick={() => setIntegrationTab(idx)} sx={{ borderRadius: 1.5, mx: 1, my: 0.5, "&.Mui-selected": { bgcolor: "primary.main", color: "#fff" } }}>
                        <ListItemIcon sx={{ minWidth: 34, color: "inherit" }}>
                          <Icon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={opt.name} secondary={opt.description} primaryTypographyProps={{ noWrap: true }} secondaryTypographyProps={{ sx: { display: { xs: "none", sm: "block" } } }} />
                      </ListItemButton>
                    )
                  })}
                </List>
              </Box>
            </Grid>

            {/* Code area */}
            <Grid item xs={12} md={9} sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider", bgcolor: "grey.900" }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: "grey.300" }}>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, bgcolor: "error.main", borderRadius: "50%" }} />
                    <Box sx={{ width: 10, height: 10, bgcolor: "warning.main", borderRadius: "50%" }} />
                    <Box sx={{ width: 10, height: 10, bgcolor: "success.main", borderRadius: "50%" }} />
                  </Box>
                  <Typography variant="caption" fontFamily="monospace" noWrap>
                    {integrationOptions[integrationTab].name.toLowerCase()}-chatbot-widget
                  </Typography>
                </Stack>

                <Button size="small" variant="contained" color="inherit" onClick={() => {
                    navigator.clipboard.writeText(integrationOptions[integrationTab].code)
                    showSnackbar("Code copied to clipboard")
                  }} startIcon={<ContentCopyIcon />}>
                  Copy Code
                </Button>
              </Stack>

              <Box sx={{ position: "relative", flex: 1, overflow: "auto", bgcolor: "grey.900" }}>
                <Box component="pre" sx={{ p: { xs: 2, md: 3 }, color: "grey.100", fontFamily: "monospace", m: 0 }}>
                  <code>{integrationOptions[integrationTab].code}</code>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: "space-between", bgcolor: mode === "light" ? "grey.50" : "background.default" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Ready to integrate • Professional AI chatbot widget
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Button variant="contained" onClick={() => {
                navigator.clipboard.writeText(integrationOptions[integrationTab].code)
                showSnackbar("Code copied to clipboard")
              }} startIcon={<ContentCopyIcon />}>
              Copy Code
            </Button>
            <Button variant="outlined" onClick={() => setShowIntegrationDialog(false)}>
              Close
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Agent Details Dialog */}
      <Dialog open={!!selectedAgent} onClose={() => setSelectedAgent(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {selectedAgent && (
            <Box sx={gradientCircle(mode, agentTypeConfig[selectedAgent.type].gradient(mode))}>
              {React.createElement(agentTypeConfig[selectedAgent.type].icon, { fontSize: "small" })}
            </Box>
          )}
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {selectedAgent?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure agent settings
            </Typography>
          </Box>
          <IconButton sx={{ ml: "auto" }} onClick={() => setSelectedAgent(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Agent Name */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              Documet Title
            </Typography>
            <Box
              component="input"
              type="text"
              value={selectedAgent?.name || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (!selectedAgent) return
                const updated = { ...selectedAgent, name: e.target.value }
                setSelectedAgent(updated)
                setAgents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
              }}
              sx={{ width: "100%", px: 1.5, py: 1, border: "1px solid", borderColor: "divider", borderRadius: 1 }}
            />
          </Box>


          {/* Documents */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} mb={1}>
              Documents
            </Typography>
            <Box sx={{ p: 2, borderRadius: 2, border: "2px dashed", borderColor: "divider", bgcolor: mode === "light" ? "grey.50" : "background.default" }}>
              {selectedAgent && selectedAgent.documents.length > 0 ? (
                <Stack spacing={1}>
                  {selectedAgent.documents.map((doc, idx) => (
                    <Stack key={idx} direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1, borderRadius: 1, border: "1px solid", borderColor: "divider", bgcolor: mode === "light" ? "#fff" : "grey.800" }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <DescriptionIcon color="action" fontSize="small" />
                        <Typography variant="body2">{doc.title}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        
                        {doc.file_id && (
                          <IconButton size="small" color="error" onClick={() => {
                              if (!selectedAgent) return
                              handleDeleteFile(selectedAgent.id, doc.file_id)
                              // update selectedAgent UI immediately
                              setSelectedAgent((sa) => sa ? { ...sa, documents: sa.documents.filter(d => d.file_id !== doc.file_id) } : sa)
                            }}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Stack alignItems="center" spacing={0.5}>
                  <DescriptionIcon color="disabled" sx={{ fontSize: 40 }} />
                  <Typography variant="body2" color="text.secondary">
                    No documents uploaded
                  </Typography>
                </Stack>
              )}
            </Box>

            <Button fullWidth variant="outlined" startIcon={<UploadIcon />} sx={{ mt: 2, textTransform: "none" }} onClick={() => {
                if (!selectedAgent) return
                setUploadingAgent(selectedAgent.id)
                fileInputRef.current?.click()
              }}>
              Upload Documents (.txt)
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setSelectedAgent(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} variant="filled" sx={{ alignItems: "center" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

