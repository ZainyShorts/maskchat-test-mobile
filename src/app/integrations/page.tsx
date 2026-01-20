"use client"
import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Chip,
  Paper,
  Avatar,
  Grid,
  Container,
  useMediaQuery,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from "@mui/material"
import { Upload, Send, Message, ArrowBack, Schedule, Download, GetApp, BarChart } from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"
import { getBaseUrl } from "@/api/vars/vars"

interface Campaign {
  id: number
  name: string
  template_name: string
  daily_limit: number
  send_time: number
  time_zone: string
  total_days: number
  subscribers: any[]
}

interface CampaignCustomer {
  id: number
  campaign: number
  customer_name: string | null
  phone_number: string
  sent: boolean
  sent_at: string
  status: "sent" | "delivered" | "read" | "failed"
}

// Types
interface CSVData {
  phoneNumber: string
  customerName: string | null
}

interface CSVError {
  row: number
  error: string
  data?: any
}

interface Template {
  id: number
  title: string
  name: string
  url?: string
  lang: string
  header?: string
  body: string
  footer?: string
  btn?: string
  btnUrl?: string
}

interface NewTemplate {
  title: string
  url?: string
  lang: string
  header?: string
  body: string
  footer?: string
  btn?: string
  btnUrl?: string
  headerImage?: File | null
  headerImagePreview?: string
}

interface ScheduleSettings {
  hour: number
  timezone: string
}

interface ModalState {
  open: boolean
  type: "error" | "success" | "warning" | "info"
  title: string
  message: string
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
}

// Valid country codes list
const validCountryCodes = [
  "1",
  "7",
  "20",
  "27",
  "30",
  "31",
  "32",
  "33",
  "34",
  "36",
  "39",
  "40",
  "41",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "60",
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "81",
  "82",
  "84",
  "86",
  "90",
  "91",
  "92",
  "93",
  "94",
  "95",
  "98",
  "211",
  "212",
  "213",
  "216",
  "218",
  "220",
  "221",
  "222",
  "223",
  "224",
  "225",
  "226",
  "227",
  "228",
  "229",
  "230",
  "231",
  "232",
  "233",
  "234",
  "235",
  "236",
  "237",
  "238",
  "239",
  "240",
  "241",
  "242",
  "243",
  "244",
  "245",
  "246",
  "248",
  "249",
  "250",
  "251",
  "252",
  "253",
  "254",
  "255",
  "256",
  "257",
  "258",
  "260",
  "261",
  "262",
  "263",
  "264",
  "265",
  "266",
  "267",
  "268",
  "269",
  "290",
  "291",
  "297",
  "298",
  "299",
  "350",
  "351",
  "352",
  "353",
  "354",
  "355",
  "356",
  "357",
  "358",
  "359",
  "370",
  "371",
  "372",
  "373",
  "374",
  "375",
  "376",
  "377",
  "378",
  "379",
  "380",
  "381",
  "382",
  "383",
  "385",
  "386",
  "387",
  "389",
  "420",
  "421",
  "423",
  "500",
  "501",
  "502",
  "503",
  "504",
  "505",
  "506",
  "507",
  "508",
  "509",
  "590",
  "591",
  "592",
  "593",
  "594",
  "595",
  "596",
  "597",
  "598",
  "599",
  "670",
  "672",
  "673",
  "674",
  "675",
  "676",
  "677",
  "678",
  "679",
  "680",
  "681",
  "682",
  "683",
  "685",
  "686",
  "687",
  "688",
  "689",
  "690",
  "691",
  "692",
  "850",
  "852",
  "853",
  "855",
  "856",
  "880",
  "886",
  "960",
  "961",
  "962",
  "963",
  "964",
  "965",
  "966",
  "967",
  "968",
  "970",
  "971",
  "972",
  "973",
  "974",
  "975",
  "976",
  "977",
  "992",
  "993",
  "994",
  "995",
  "996",
  "998",
]

// API Configuration
const API_BASE_URL = `${getBaseUrl()}newsletter`

// API Helper Functions
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

const apiHeaders = (isMultipart = false) => ({
  ...(isMultipart ? {} : { "Content-Type": "application/json" }),
  Authorization: `Token ${getAuthToken()}`,
})

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const isMultipart = options.body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...apiHeaders(isMultipart),
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// Helper function to truncate text
const truncateText = (text: string, maxLength = 41) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + "..."
}

const convertToCSV = (customers: CampaignCustomer[]): string => {
  const headers = ["Phone Number", "Customer Name", "Status", "Sent At", "Sent"]
  const rows = customers.map((customer) => [
    customer.phone_number,
    customer.customer_name || "N/A",
    customer.status,
    new Date(customer.sent_at).toLocaleString(),
    customer.sent ? "Yes" : "No",
  ])

  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  return csvContent
}

const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Helper function to format title for API
const formatTitleForAPI = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
}

// Helper function to upload image
const uploadImageToService = async (file: File): Promise<string> => {
  return URL.createObjectURL(file)
}

const CampaignsView = ({ theme, isMobile }: { theme: any; isMobile: boolean }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [campaignCustomers, setCampaignCustomers] = useState<CampaignCustomer[]>([])
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Load campaigns on mount
  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    setIsLoadingCampaigns(true)
    try {
      const response = await apiCall("/my-campaigns/")
      setCampaigns(response.campaigns || [])
    } catch (error) {
      console.error("Failed to load campaigns:", error)
    } finally {
      setIsLoadingCampaigns(false)
    }
  }

  const loadCampaignCustomers = async (campaignId: number) => {
    setIsLoadingCustomers(true)
    try {
      const response = await apiCall(`/campaigns/${campaignId}/customers/`)
      console.log('loadCampaignCustomers',response)
      setCampaignCustomers(response.customers || [])
      setShowModal(true)
    } catch (error) {
      console.error("Failed to load campaign customers:", error)
    } finally {
      setIsLoadingCustomers(false)
    }
  }

  const handleCampaignClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    loadCampaignCustomers(campaign.id)
  }

  const handleDownloadCSV = () => {
    if (selectedCampaign && campaignCustomers.length > 0) {
      const csvContent = convertToCSV(campaignCustomers)
      downloadCSV(csvContent, `campaign_${selectedCampaign.id}_report.csv`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "info"
      case "delivered":
        return "success"
      case "read":
        return "primary"
      case "failed":
        return "error"
      default:
        return "default"
    }
  }

  const calculateStats = () => {
    const stats = {
      total: campaignCustomers.length,
      sent: campaignCustomers.filter((c) => c.sent).length,
      delivered: campaignCustomers.filter((c) => c.status === "delivered").length,
      read: campaignCustomers.filter((c) => c.status === "read").length,
      failed: campaignCustomers.filter((c) => c.status === "failed").length,
    }
    return stats
  }

  const stats = calculateStats()

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}
          >
            <Typography variant="h5" fontWeight="bold">
              Running Campaigns
            </Typography>
            <Button
              variant="outlined"
              onClick={loadCampaigns}
              disabled={isLoadingCampaigns}
              startIcon={isLoadingCampaigns ? <CircularProgress size={20} /> : <BarChart />}
            >
              Refresh
            </Button>
          </Box>

          {/* Campaigns List or Empty State */}
          {isLoadingCampaigns ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : campaigns.length === 0 ? (
            <Alert severity="info">
              <AlertTitle>No Campaigns</AlertTitle>
              You don&apos;t have any running campaigns yet. Create one using the campaign builder above.
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    <TableCell>
                      <strong>Campaign Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Template</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Daily Limit</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Time Zone</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Action</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id} hover>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>{truncateText(campaign.template_name, 30)}</TableCell>
                      <TableCell align="right">{campaign.daily_limit}</TableCell>
                      <TableCell>{campaign.time_zone}</TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<GetApp />}
                          onClick={() => handleCampaignClick(campaign)}
                        >
                          {isMobile ? "View" : "View & Export"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </Container>

      {/* Campaign Details Modal */}
      <Dialog
        open={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedCampaign(null)
          setCampaignCustomers([])
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{selectedCampaign?.name}</Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<Download />}
              onClick={handleDownloadCSV}
              disabled={campaignCustomers.length === 0}
            >
              Export CSV
            </Button>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {isLoadingCustomers ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : campaignCustomers.length === 0 ? (
            <Typography color="text.secondary">No customer data available</Typography>
          ) : (
            <Box sx={{ mt: 2 }}>
              {/* Stats */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ p: 1.5, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Total
                      </Typography>
                      <Typography variant="h6">{stats.total}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ p: 1.5, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Sent
                      </Typography>
                      <Typography variant="h6" sx={{ color: "info.main" }}>
                        {stats.sent}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ p: 1.5, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Delivered
                      </Typography>
                      <Typography variant="h6" sx={{ color: "success.main" }}>
                        {stats.delivered}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card>
                    <CardContent sx={{ p: 1.5, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Failed
                      </Typography>
                      <Typography variant="h6" sx={{ color: "error.main" }}>
                        {stats.failed}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Customer Table */}
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "action.hover" }}>
                      <TableCell>
                        <strong>Phone</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell>
                        {/* <strong>Sent At</strong> */}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaignCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.phone_number}</TableCell>
                        <TableCell>{customer.customer_name || "—"}</TableCell>
                        <TableCell>
                          <Chip
                            label={customer.status}
                            color={getStatusColor(customer.status)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        {/* <TableCell>{`${customer.sent_at == null ? 'N/A': new Date(customer.sent_at).toLocaleString()}`}</TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowModal(false)
              setSelectedCampaign(null)
              setCampaignCustomers([])
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default function NewsletterApp() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"))
  const [activeTab, setActiveTab] = useState(0)

  const imageFileInputRef = useRef<HTMLInputElement>(null)

  const [modal, setModal] = useState<ModalState>({
    open: false,
    type: "info",
    title: "",
    message: "",
  })

  const [activeStep, setActiveStep] = useState(0)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<CSVData[]>([])
  const [csvErrors, setCsvErrors] = useState<CSVError[]>([])
  const [isParsingCsv, setIsParsingCsv] = useState(false)
  const [csvPreview, setCsvPreview] = useState<string>("")
  const [isDragOver, setIsDragOver] = useState(false)
  const [isImageDragOver, setIsImageDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dailyLimit, setDailyLimit] = useState<number>(100)
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    hour: 14,
    timezone: "Asia/Karachi",
  })
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)
  const [newTemplate, setNewTemplate] = useState<NewTemplate>({
    title: "",
    url: "",
    lang: "en",
    header: "",
    body: "",
    footer: "",
    btn: "",
    btnUrl: "",
    headerImage: null,
    headerImagePreview: "",
  })
  const [useHeaderImage, setUseHeaderImage] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [isCreatingTemplateAPI, setIsCreatingTemplateAPI] = useState(false)
  const [isStartingCampaign, setIsStartingCampaign] = useState(false)
  const [userBusinessData, setUserBusinessData] = useState<any>({})

  const timezones = [
    { value: "Asia/Karachi", label: "Pakistan (PKT)" },
    { value: "Asia/Dubai", label: "UAE (GST)" },
    { value: "Asia/Riyadh", label: "Saudi Arabia (AST)" },
    { value: "Europe/London", label: "UK (GMT/BST)" },
    { value: "America/New_York", label: "US Eastern (EST/EDT)" },
    { value: "America/Los_Angeles", label: "US Pacific (PST/PDT)" },
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "Asia/Singapore", label: "Singapore (SGT)" },
    { value: "Europe/Berlin", label: "Germany (CET/CEST)" },
  ]

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`,
  }))

  const showModal = (modalData: Omit<ModalState, "open">) => {
    setModal({ ...modalData, open: true })
  }

  const closeModal = () => {
    setModal((prev) => ({ ...prev, open: false }))
  }

  const resetForm = () => {
    setActiveStep(0)
    setCsvFile(null)
    setCsvData([])
    setCsvErrors([])
    setCsvPreview("")
    setDailyLimit(100)
    setScheduleSettings({
      hour: 14,
      timezone: "Asia/Karachi",
    })
    setSelectedTemplate("")
    setIsCreatingTemplate(false)

    if (newTemplate.headerImagePreview && newTemplate.headerImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(newTemplate.headerImagePreview)
    }

    setNewTemplate({
      title: "",
      url: "",
      lang: "en",
      header: "",
      body: "",
      footer: "",
      btn: "",
      btnUrl: "",
      headerImage: null,
      headerImagePreview: "",
    })
    setUseHeaderImage(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = ""
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    if (useHeaderImage) {
      setNewTemplate((prev) => ({ ...prev, header: "" }))
    } else {
      if (newTemplate.headerImagePreview && newTemplate.headerImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(newTemplate.headerImagePreview)
      }
      setNewTemplate((prev) => ({
        ...prev,
        url: "",
        headerImage: null,
        headerImagePreview: "",
      }))
    }
  }, [useHeaderImage])

  useEffect(() => {
    return () => {
      if (newTemplate.headerImagePreview && newTemplate.headerImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(newTemplate.headerImagePreview)
      }
    }
  }, [newTemplate.headerImagePreview])

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        showModal({
          type: "error",
          title: "Invalid File Type",
          message: "Please select a valid image file (JPG, PNG, GIF, WebP).",
        })
        return
      }

      const maxSizeInMB = 5
      if (file.size > maxSizeInMB * 1024 * 1024) {
        showModal({
          type: "error",
          title: "File Too Large",
          message: `Image file size must be less than ${maxSizeInMB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
        })
        return
      }

      setIsUploadingImage(true)

      try {
        const previewUrl = URL.createObjectURL(file)

        if (newTemplate.headerImagePreview && newTemplate.headerImagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(newTemplate.headerImagePreview)
        }

        setNewTemplate((prev) => ({
          ...prev,
          headerImage: file,
          headerImagePreview: previewUrl,
          url: previewUrl,
        }))
      } catch (error) {
        showModal({
          type: "error",
          title: "Upload Failed",
          message: "Failed to process the image. Please try again.",
        })
      } finally {
        setIsUploadingImage(false)
      }
    },
    [newTemplate.headerImagePreview],
  )

  const handleImageFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        handleImageUpload(file)
      }
    },
    [handleImageUpload],
  )

  const handleImageDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsImageDragOver(true)
  }, [])

  const handleImageDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsImageDragOver(false)
  }, [])

  const handleImageDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsImageDragOver(false)
      const files = e.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        handleImageUpload(file)
      }
    },
    [handleImageUpload],
  )

  const handleRemoveImage = useCallback(() => {
    if (newTemplate.headerImagePreview && newTemplate.headerImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(newTemplate.headerImagePreview)
    }
    setNewTemplate((prev) => ({
      ...prev,
      headerImage: null,
      headerImagePreview: "",
      url: "",
    }))
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = ""
    }
  }, [newTemplate.headerImagePreview])

  const handleImageInputClick = () => {
    imageFileInputRef.current?.click()
  }

  const loadTemplates = async () => {
    setIsLoadingTemplates(true)
    try {
      const response = await apiCall("/campaign-templates/")
      setTemplates(response.results || [])
    } catch (error) {
      console.error("Failed to load templates:", error)
      showModal({
        type: "error",
        title: "Failed to Load Templates",
        message: "Unable to load templates. Please check your connection and try again.",
      })
    } finally {
      setIsLoadingTemplates(false)
    }
  }

  const createTemplateAPI = async (templateData: NewTemplate) => {
    setIsCreatingTemplateAPI(true)

    try {
      const formattedTitle = formatTitleForAPI(templateData.title)
      const formData = new FormData()

      formData.append("title", formattedTitle)
      formData.append("lang", templateData.lang)
      formData.append("body", templateData.body)

      if (templateData.header) formData.append("header", templateData.header)
      if (templateData.footer) formData.append("footer", templateData.footer)
      if (templateData.btn) formData.append("btn", templateData.btn)
      if (templateData.btnUrl) formData.append("btnUrl", templateData.btnUrl)

      if (templateData.headerImage) {
        formData.append("upload", templateData.headerImage)
      }

      const response = await fetch(`${API_BASE_URL}/campaign-templates/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${getAuthToken()}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      await loadTemplates()

      setSelectedTemplate(result.id.toString())
      return result
    } catch (error) {
      console.error("Failed to create template:", error)
      throw error
    } finally {
      setIsCreatingTemplateAPI(false)
    }
  }

  const startCampaignAPI = async () => {
    setIsStartingCampaign(true)
    try {
      const selectedTemplateData = templates.find((t) => t.id.toString() === selectedTemplate)
      const payload = {
        name: `Campaign ${new Date().toISOString().split("T")[0]}`,
        template_name: selectedTemplateData?.name || "",
        daily_limit: dailyLimit,
        send_time: scheduleSettings.hour,
        time_zone: scheduleSettings.timezone,
        total_days: Math.ceil(csvData.length / dailyLimit),
        contacts: csvData.map((contact) => ({
          customerName: contact.customerName,
          phoneNumber: contact.phoneNumber,
        })),
      }
      const response = await apiCall("/campaigns/", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      showModal({
        type: "success",
        title: "Campaign Started",
        message: "Your campaign has been successfully created and started!",
        onConfirm: () => {
          closeModal()
          resetForm()
        },
        confirmText: "Great!",
      })
    } catch (error) {
      console.error("Failed to start campaign:", error)
      showModal({
        type: "error",
        title: "Campaign Failed",
        message: "Failed to start campaign. Please try again.",
      })
    } finally {
      setIsStartingCampaign(false)
    }
  }

  // ... rest of existing implementation stays the same ...
  const validatePhoneNumber = (phone: string): { isValid: boolean; error?: string } => {
    const cleanPhone = phone.replace(/[\s\-()]/g, "")
    if (!/^\d+$/.test(cleanPhone)) {
      return { isValid: false, error: "Phone number must contain only digits" }
    }
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return { isValid: false, error: "Phone number must be 10-15 digits long" }
    }
    let hasValidCountryCode = false
    const sortedCountryCodes = [...validCountryCodes].sort((a, b) => b.length - a.length)
    for (const code of sortedCountryCodes) {
      if (cleanPhone.startsWith(code)) {
        const remainingDigits = cleanPhone.length - code.length
        if (remainingDigits >= 7 && remainingDigits <= 12) {
          hasValidCountryCode = true
          break
        }
      }
    }
    if (!hasValidCountryCode) {
      return {
        isValid: false,
        error: `Phone number must start with a valid country code.`,
      }
    }
    return { isValid: true }
  }

  const downloadCsvTemplate = () => {
    const csvContent = `Phone Number,Customer Name
923364569588,John Doe
14155552671,
447911123456,Bob Johnson
919876543210,Alice Brown
33123456789,Charlie Wilson`
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "newsletter_template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // ... existing validation and handler functions ...
  const validateStep1 = () => csvData.length > 0 && csvErrors.length === 0 && csvFile !== null
  const validateStep2 = () => dailyLimit > 0 && scheduleSettings.hour >= 0 && scheduleSettings.hour <= 23
  const validateStep3 = () => selectedTemplate !== ""
  const validateAllSteps = () => validateStep1() && validateStep2() && validateStep3()

  const getStepStatus = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return validateStep1() ? "completed" : "incomplete"
      case 1:
        return validateStep2() ? "completed" : "incomplete"
      case 2:
        return validateStep3() ? "completed" : "incomplete"
      case 3:
        return validateAllSteps() ? "completed" : "incomplete"
      default:
        return "incomplete"
    }
  }

  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      handleFileUpload(file)
    }
  }

  const handleFileUpload = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      showModal({
        type: "error",
        title: "Invalid File Type",
        message: "Please upload a CSV file.",
      })
      return
    }

    setCsvFile(file)
    setIsParsingCsv(true)
    setCsvErrors([])
    setCsvData([])

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const lines = content.split("\n")
        const errors: CSVError[] = []
        const data: CSVData[] = []

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue

          const [phone, customerName] = line.split(",").map((x) => x.trim())

          if (!phone) {
            errors.push({
              row: i + 1,
              error: "Phone number is required",
            })
            continue
          }

          const validation = validatePhoneNumber(phone)
          if (!validation.isValid) {
            errors.push({
              row: i + 1,
              error: validation.error || "Invalid phone number",
              data: { phone, customerName },
            })
            continue
          }

          data.push({
            phoneNumber: phone,
            customerName: customerName || null,
          })
        }

        setCsvData(data)
        setCsvErrors(errors)
        setCsvPreview(`Parsed ${data.length} valid contacts, ${errors.length} errors`)

        if (errors.length > 0) {
          showModal({
            type: "warning",
            title: "CSV Parsing Complete",
            message: `Successfully parsed ${data.length} valid contacts. Found ${errors.length} errors.`,
          })
        }
      } catch (error) {
        showModal({
          type: "error",
          title: "CSV Parsing Error",
          message: "Failed to parse CSV file. Please check the format.",
        })
      } finally {
        setIsParsingCsv(false)
      }
    }

    reader.readAsText(file)
  }

  const handleCreateTemplate = async () => {
    if (!newTemplate.title || !newTemplate.body) {
      showModal({
        type: "error",
        title: "Missing Required Fields",
        message: "Please fill in template title and body.",
      })
      return
    }

    try {
      await createTemplateAPI(newTemplate)
      showModal({
        type: "success",
        title: "Template Created",
        message: "Your template has been created successfully!",
      })
      setNewTemplate({
        title: "",
        url: "",
        lang: "en",
        header: "",
        body: "",
        footer: "",
        btn: "",
        btnUrl: "",
        headerImage: null,
        headerImagePreview: "",
      })
      setIsCreatingTemplate(false)
    } catch (error) {
      showModal({
        type: "error",
        title: "Template Creation Failed",
        message: "Failed to create template. Please try again.",
      })
    }
  }

  const getLivePreviewTemplate = () => {
    if (isCreatingTemplate) {
      return {
        title: newTemplate.title,
        name: formatTitleForAPI(newTemplate.title),
        lang: newTemplate.lang,
        header: newTemplate.header,
        body: newTemplate.body,
        footer: newTemplate.footer,
        btn: newTemplate.btn,
        btnUrl: newTemplate.btnUrl,
        url: newTemplate.headerImagePreview,
      }
    }
    return templates.find((t) => t.id.toString() === selectedTemplate)
  }

  const getPreviewText = (template: Template | any, customerName: string | null): string => {
    let text = ""
    if (template.header) text += `${template.header}\n\n`
    if (template.body) {
      text += template.body.replace("{{customerName}}", customerName || "")
    }
    if (template.footer) text += `\n\n${template.footer}`
    return text
  }

  const WhatsAppPreview = ({ template }: { template?: Template | any }) => {
    const previewText = template ? getPreviewText(template, csvData[0]?.customerName || null) : null
    const isDark = theme.palette.mode === "dark"
    return (
      <Box
        sx={{
          bgcolor: isDark ? "#1a1a1a" : "#e5ddd5",
          borderRadius: 2,
          overflow: "hidden",
          maxWidth: "100%",
          mx: "auto",
          width: 320,
        }}
      >
        <Box
          sx={{
            bgcolor: "#075e54",
            color: "white",
            p: { xs: 1.5, sm: 2 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, flex: 1, minWidth: 0 }}>
            <ArrowBack sx={{ fontSize: { xs: 20, sm: 24 } }} />
            <Avatar
              src={userBusinessData?.marketing_template_url}
              alt="Business logo"
              sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                bgcolor: "#128c7e",
              }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ color: "white", fontSize: { xs: "0.875rem", sm: "1rem" } }}
                noWrap
              >
                {userBusinessData?.name || "Your Business"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#ccc" }}>
                {isCreatingTemplate ? "Template Preview" : "Live Preview"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
          {template?.url && (
            <Box
              component="img"
              src={template.url}
              alt="Template"
              sx={{
                width: "100%",
                borderRadius: 1,
                mb: 1,
                maxHeight: 150,
                objectFit: "cover",
              }}
            />
          )}
          <Typography
            variant="body2"
            sx={{
              color: isDark ? "#fff" : "#000",
              lineHeight: 1.6,
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {previewText || "No template selected"}
          </Typography>

          {template?.btn && (
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#075e54",
                color: "white",
                mt: 2,
                fontSize: "0.75rem",
                py: 0.5,
              }}
            >
              {template.btn}
            </Button>
          )}
        </Box>
      </Box>
    )
  }

  const ModalDialog = () => (
    <Dialog open={modal.open} onClose={closeModal}>
      <DialogTitle>{modal.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{modal.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {modal.cancelText && (
          <Button onClick={closeModal} color="inherit">
            {modal.cancelText}
          </Button>
        )}
        <Button
          onClick={() => {
            if (modal.onConfirm) modal.onConfirm()
            closeModal()
          }}
          variant="contained"
        >
          {modal.confirmText || "OK"}
        </Button>
      </DialogActions>
    </Dialog>
  )

  const steps = [
    { title: "Upload CSV File", icon: Upload },
    { title: "Set Schedule & Limit", icon: Schedule },
    { title: "Select/Create Template", icon: Message },
    { title: "Preview & Send", icon: Send },
  ]

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mt: 0 }}>
            <Tab label="Create Campaign" value={0} />
            <Tab label="View Campaigns" value={1} />
          </Tabs>
        </Container>
      </Box>

      {/* Tab 0: Create Campaign */}
      {activeTab === 0 && (
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              {/* ... existing campaign creation code ... */}
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h6" gutterBottom>
                    Campaign Builder
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card sx={{ position: { lg: "sticky" }, top: 24 }}>
                <CardHeader
                  title={
                    <Typography variant="h6" sx={{ color: "#25d366" }}>
                      WhatsApp Preview
                    </Typography>
                  }
                />
                <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                  <WhatsAppPreview template={getLivePreviewTemplate()} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      )}

      {/* Tab 1: View Campaigns */}
      {activeTab === 1 && <CampaignsView theme={theme} isMobile={isMobile} />}

      {/* Modal Dialog */}
      <ModalDialog />
    </Box>
  )
}
