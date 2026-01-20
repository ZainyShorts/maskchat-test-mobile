"use client"
import React from "react"
import { useState, useCallback, useMemo, useRef, useEffect } from "react"
// Add these imports at the top with your other icon imports
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  MenuItem,
  Alert,
  AlertTitle,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Avatar,
  Grid,
  Container,
  IconButton,
  useMediaQuery,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
 
} from "@mui/material"

import {
  Info, // Add this
} from "@mui/icons-material"
import {
  Upload,
  CheckCircle,
  Error as ErrorIcon,
  Send,
  Message,
  ArrowBack,
  ArrowForward,
  Phone,
  Videocam,
  Add,
  People,
  MoreVert,
  AttachFile,
  EmojiEmotions,
  Mic,
  Schedule,
  Download,
  Warning,
  CheckCircleOutline,
  PhotoCamera,
  Delete as DeleteIcon,
  CloudUpload,
  BarChart,
  GetApp,
  RemoveRedEye,
  Edit as EditIcon, // Added EditIcon
  Save as SaveIcon, // Added SaveIcon
  AutoAwesome, // added AutoAwesome icon
} from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"
import * as XLSX from "xlsx"
import { getAllBusiness } from "@/api/business"
import { getBaseUrl } from "@/api/vars/vars"
import { MarketingImageGenerator } from "./component/marketing-image-generator"
import { MAX_BUTTON_TEXT_LENGTH, NewTemplate, Template } from '../../../../libs/newsletter-utils'


// Add this interface near your other interfaces
interface CountryCost {
  prefix: string
  country: string
  cost: number
}

// Types
interface CSVData {
  phoneNumber: string
  customerName: string | null // customerName is now optional
}

interface CSVError {
  row: number
  error: string
  data?: any
}





interface ScheduleSettings {
  hour: number // 24-hour format
  timezone: string
}

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

const convertToCSV = (customers: CampaignCustomer[]): string => {
  const headers = ["Phone Number", "Customer Name", "Status", "Sent At"]
  const rows = customers.map((customer) => [
    customer.phone_number,
    customer.customer_name || "N/A",
    customer.status,
    new Date(customer.sent_at).toLocaleString(),
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

// Helper function to truncate text to 41 characters
const truncateText = (text: string, maxLength = 41) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + "..."
}

// Helper function to convert title to underscore format
const formatTitleForAPI = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/[^a-z0-9_]/g, "") // Remove special characters except underscores
    .replace(/_+/g, "_") // Replace multiple underscores with single underscore
    .replace(/^_|_$/g, "") // Remove leading/trailing underscores
}

export default function NewsletterApp() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"))

  // Image upload refs
  const imageFileInputRef = useRef<HTMLInputElement>(null)

  // Modal state
  const [modal, setModal] = useState<ModalState>({
    open: false,
    type: "info",
    title: "",
    message: "",
  })

  // Add this constant with your country cost data
// Add this constant with more country cost data
const COUNTRY_COSTS: CountryCost[] = [
  { prefix: "92", country: "Pakistan", cost: 0.0473 },
  { prefix: "27", country: "South Africa", cost: 0.0379 },
  { prefix: "44", country: "United Kingdom", cost: 0.0529 },
  { prefix: "49", country: "Germany", cost: 0.1365 },
  { prefix: "90", country: "Turkey", cost: 0.0109 },
  { prefix: "966", country: "Saudi Arabia", cost: 0.0455 },
  { prefix: "971", country: "UAE", cost: 0.0499 },
  { prefix: "1", country: "United States/Canada", cost: 0.0850 }, // Added US/Canada
  { prefix: "33", country: "France", cost: 0.0650 }, // Added France
  { prefix: "39", country: "Italy", cost: 0.0550 }, // Added Italy
  { prefix: "34", country: "Spain", cost: 0.0480 }, // Added Spain
  { prefix: "7", country: "Russia", cost: 0.0420 }, // Added Russia
  { prefix: "86", country: "China", cost: 0.0320 }, // Added China
  { prefix: "81", country: "Japan", cost: 0.0750 }, // Added Japan
  { prefix: "82", country: "South Korea", cost: 0.0680 }, // Added South Korea
  { prefix: "91", country: "India", cost: 0.0250 }, // Added India
  { prefix: "55", country: "Brazil", cost: 0.0380 }, // Added Brazil
]

  // Add this function to extract country prefix from phone number
const extractCountryPrefix = (phoneNumber: string): string | null => {
  const cleanPhone = phoneNumber.replace(/[\s\-()]/g, "")
  
  // Sort prefixes by length (longest first) to catch cases like 966 (3 digits) vs 92 (2 digits)
  const sortedPrefixes = COUNTRY_COSTS.map(c => c.prefix).sort((a, b) => b.length - a.length)
  
  for (const prefix of sortedPrefixes) {
    if (cleanPhone.startsWith(prefix)) {
      return prefix
    }
  }
  return null
}

// Add this state in your component
const [costEstimation, setCostEstimation] = useState<{
  totalNumbers: number
  breakdown: Array<{ country: string; count: number; cost: number }>
  totalCost: number
} | null>(null)

  // Stepper state
  const [activeStep, setActiveStep] = useState(0)

  // CSV Upload states
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<CSVData[]>([])
  const [csvErrors, setCsvErrors] = useState<CSVError[]>([])
  const [isParsingCsv, setIsParsingCsv] = useState(false)
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null)
  const [editingValues, setEditingValues] = useState<CSVData | null>(null)
  const [csvPreview, setCsvPreview] = useState<string>("")

  // Drag and drop states
  const [isDragOver, setIsDragOver] = useState(false)
  const [isImageDragOver, setIsImageDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [campaignCustomers, setCampaignCustomers] = useState<CampaignCustomer[]>([])
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)
  const [showModalView, setShowModal] = useState(false)


  const [searchTerm, setSearchTerm] = useState("")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(true)

  // Load campaigns on mount
  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    setIsLoadingCampaigns(true)
    try {
      const response = await apiCall("/my-campaigns/")
      console.log(response)
      setCampaigns(response.campaigns || [])
    } catch (error) {
      console.error("Failed to load campaigns:", error)
    } finally {
      setIsLoadingCampaigns(false)
    }
  }

  


// Add this function to toggle favorite status
const toggleTemplateFavorite = async (templateId: number, isFavorite: boolean) => {
  try {
    const response = await apiCall(`/campaign-templates/${templateId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ is_favorite: isFavorite }),
    })
    
    // Update local state
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, is_favorite: response.is_favorite } 
        : template
    ))
    
    return response
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
    showModal({
      type: "error",
      title: "Failed to Update",
      message: "Unable to update favorite status. Please try again.",
    })
    throw error
  }
}

  const loadCampaignCustomers = async (campaignId: number) => {
    setIsLoadingCustomers(true)
    try {
      const response = await apiCall(`/campaigns/${campaignId}/customers/`)
      console.log("loadCampaignCustomers", response)
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
      sent: campaignCustomers.filter((c) => c.status === "sent").length,
      delivered: campaignCustomers.filter((c) => c.status === "delivered").length,
      read: campaignCustomers.filter((c) => c.status === "read").length,
      failed: campaignCustomers.filter((c) => c.status === "failed").length,
    }
    console.log("returning stats", stats)
    return stats
  }

  const stats = calculateStats()

  // Daily limit and schedule states
  const [dailyLimit, setDailyLimit] = useState<number>(100)
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    hour: 14, // 2 PM
    timezone: "Asia/Karachi",
  })

  // Template states
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

  // Header type state - to control whether user uses image upload or text header
  const [useHeaderImage, setUseHeaderImage] = useState(false)

  // Image upload states
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // API states
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [isCreatingTemplateAPI, setIsCreatingTemplateAPI] = useState(false)
  const [isStartingCampaign, setIsStartingCampaign] = useState(false)
  const [userBusinessData, setUserBusinessData] = useState<any>({})

  // Timezone options
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

  // Hour options (24-hour format)
  const hourOptions = Array.from({ length: 24 * 4 }, (_, i) => {
  const totalMinutes = i * 15
  const hour24 = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  const hour12 =
    hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24

  const period = hour24 < 12 ? "AM" : "PM"

  return {
    value: totalMinutes, // or `${hour24}:${minutes.toString().padStart(2, "0")}`
    label: `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`,
  }
})

  // Modal helper functions
  const showModal = (modalData: Omit<ModalState, "open">) => {
    setModal({ ...modalData, open: true })
  }

  const closeModal = () => {
    setModal((prev) => ({ ...prev, open: false }))
  }

  const previousPreviewRef = useRef<string>("")

  // const resetForm = () => {
  //   // Reset all form states
  //   setActiveStep(4)
  //   setCsvFile(null)
  //   setCsvData([])
  //   setCsvErrors([])
  //   setCsvPreview("")
  //   setEditingRowIndex(null)
  //   setEditingValues(null)
  //   setDailyLimit(100)
  //   setScheduleSettings({
  //     hour: 14,
  //     timezone: "Asia/Karachi",
  //   })
  //   setSelectedTemplate("")
  //   setIsCreatingTemplate(false)

  //   // Clean up image preview URLs to prevent memory leaks
  //   if (newTemplate.headerImagePreview && newTemplate.headerImagePreview.startsWith("blob:")) {
  //     URL.revokeObjectURL(newTemplate.headerImagePreview)
  //   }

  //   setNewTemplate({
  //   title: "",
  //   url: "",
  //   lang: "en",
  //   header: "",
  //   body: "",
  //   footer: "",
  //   btn: "",
  //   btnUrl: "",
  //   btn2: "",
  //   btn2Url: "",
  //   btn3: "",
  //   headerImage: null,
  //   headerImagePreview: "",
  // })
  //   setUseHeaderImage(false)
  //   // Clear file input
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = ""
  //   }
  //   if (imageFileInputRef.current) {
  //     imageFileInputRef.current.value = ""
  //   }

  //   loadCampaigns()
  // }

  // Load templates on component mount
  
  // Update the resetForm function to clear cost estimation
const resetForm = () => {
  // Reset all form states
  setActiveStep(4)
  setCsvFile(null)
  setCsvData([])
  setCsvErrors([])
  setCsvPreview("")
  setCostEstimation(null) // Clear cost estimation
  setDailyLimit(100)
  setScheduleSettings({
    hour: 14,
    timezone: "Asia/Karachi",
  })
  setSelectedTemplate("")
  setIsCreatingTemplate(false)
  
  // Clean up image preview URLs to prevent memory leaks
  if (newTemplate.headerImagePreview && newTemplate.headerImagePreview.startsWith('blob:')) {
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
  // Clear file input
  if (fileInputRef.current) {
    fileInputRef.current.value = ""
  }
  if (imageFileInputRef.current) {
    imageFileInputRef.current.value = ""
  }
  setActiveStep(activeStep+1)
  loadCampaigns()
  
}

  useEffect(() => {
    loadTemplates()
  }, [])

  // Update header type when switching between image upload and text
  useEffect(() => {
    if (useHeaderImage) {
      setNewTemplate((prev) => ({ ...prev, header: "" }))
    } else {
      // Clean up image preview URL when switching to text header
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

  // Clean up image preview URLs on component unmount
  useEffect(() => {
    return () => {
      if (newTemplate.headerImagePreview && newTemplate.headerImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(newTemplate.headerImagePreview)
      }
    }
  }, [newTemplate.headerImagePreview])

  const [uploadSelectType, setUploadSelectType] = useState<string | null>(null)

 

  // Update handleImageUpload to remove the dependency
  const handleImageUpload = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      showModal({
        type: "error",
        title: "Invalid File Type",
        message: "Please select a valid image/video file (JPG, JPEG, PNG, MP4).",
      })
      return
    }

    // Validate file size (5MB limit)
    const maxSizeInMB = 16
    if (file.size > maxSizeInMB * 1024 * 1024) {
      showModal({
        type: "error",
        title: "File Too Large",
        message: `Image file size must be less than ${maxSizeInMB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      })
      return
    }

    setIsUploadingImage(true)
    if (file.type.startsWith("image/")) setUploadSelectType("Image")
    else if (file.type.startsWith("video/")) setUploadSelectType("Video")

    try {
      // Clean up previous preview URL
      if (previousPreviewRef.current && previousPreviewRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreviewRef.current)
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)

      // Store the preview URL in ref for future cleanup
      previousPreviewRef.current = previewUrl

      // Update state
      setNewTemplate((prev) => ({
        ...prev,
        headerImage: file,
        headerImagePreview: previewUrl,
        url: previewUrl, // This should be replaced with actual cloud URL in production
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
  }, []) // Remove the dependency on newTemplate.headerImagePreview

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

  // Update handleRemoveImage to use the ref
  const handleRemoveImage = useCallback(() => {
    if (previousPreviewRef.current && previousPreviewRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(previousPreviewRef.current)
      previousPreviewRef.current = ""
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
  }, []) // No dependencies needed

  useEffect(() => {
    return () => {
      // Clean up image preview URL on unmount
      if (previousPreviewRef.current && previousPreviewRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreviewRef.current)
      }
    }
  }, [])

  const handleImageInputClick = () => {
    imageFileInputRef.current?.click()
  }

  // API Functions
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

  // const createTemplateAPI = async (templateData: NewTemplate) => {
  //   setIsCreatingTemplateAPI(true)

  //   try {
  //     const formattedTitle = formatTitleForAPI(templateData.title)

  //     // Create FormData for the request
  //     const formData = new FormData()

  //     // Append all fields
  //     formData.append("title", formattedTitle)
  //     formData.append("lang", templateData.lang)
  //     formData.append("body", templateData.body)

  //     // Append optional fields if they exist
  //     if (templateData.header) formData.append("header", templateData.header)
  //     if (templateData.footer) formData.append("footer", templateData.footer)
  //     if (templateData.btn) formData.append("btn", templateData.btn)
  //     if (templateData.btnUrl) formData.append("btnUrl", templateData.btnUrl)

  //     // Append image file if present
  //     if (templateData.headerImage) {
  //       formData.append("upload", templateData.headerImage)
  //       // formData.append('url', 'https://themaskchat.com');
  //     }

  //     console.log("formData", formData)
  //     // Create the template with multipart form data
  //     const response = await fetch(`${API_BASE_URL}/campaign-templates/`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Token ${getAuthToken()}`,
  //       },
  //       body: formData,
  //     })

  //     if (!response.ok) {
  //       throw new Error(`API Error: ${response.status} ${response.statusText}`)
  //     }

  //     const result = await response.json()

  //     // Reload templates to get the updated list
  //     await loadTemplates()

  //     // Select the newly created template
  //     setSelectedTemplate(result.id.toString())
  //     return result
  //   } catch (error) {
  //     console.error("Failed to create template:", error)
  //     throw error
  //   } finally {
  //     setIsCreatingTemplateAPI(false)
  //   }
  // }

  // Filter templates based on search term and favorite status

  const createTemplateAPI = async (templateData: NewTemplate) => {
  setIsCreatingTemplateAPI(true)

  try {
    const formattedTitle = formatTitleForAPI(templateData.title)

    // Create FormData for the request
    const formData = new FormData()

    // Append all fields
    formData.append("title", formattedTitle)
    formData.append("lang", templateData.lang)
    formData.append("body", templateData.body)

    // Append optional fields if they exist
    if (templateData.header) formData.append("header", templateData.header)
    if (templateData.footer) formData.append("footer", templateData.footer)
    
    // Append buttons (up to 3)
    if (templateData.btn) formData.append("btn", templateData.btn)
    if (templateData.btnUrl) formData.append("btnUrl", templateData.btnUrl)
    
    if (templateData.btn2) formData.append("btn2", templateData.btn2)
    if (templateData.btn2Url) formData.append("btn2Url", templateData.btn2Url)
    
    if (templateData.btn3) formData.append("btn3", templateData.btn3)

    // Append image file if present
    if (templateData.headerImage) {
      formData.append("upload", templateData.headerImage)
    }

    console.log("formData", formData)
    // Create the template with multipart form data
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

    // Reload templates to get the updated list
    await loadTemplates()

    // Select the newly created template
    setSelectedTemplate(result.id.toString())
    return result
  } catch (error) {
    console.error("Failed to create template:", error)
    throw error
  } finally {
    setIsCreatingTemplateAPI(false)
  }
}

  const filteredTemplates = useMemo(() => {
  return templates.filter(template => {
    // Filter by favorite status if enabled
    if (showFavoritesOnly && !template.is_favorite) {
      return false
    }
    
    // Filter by search term
    if (searchTerm.trim() === "") {
      return true
    }
    
    const searchLower = searchTerm.toLowerCase()
    return (
      template.title?.toLowerCase().includes(searchLower) ||
      template.body?.toLowerCase().includes(searchLower) ||
      template.header?.toLowerCase().includes(searchLower) ||
      false
    )
  })
}, [templates, searchTerm, showFavoritesOnly])

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
          customerName: contact.customerName, // This will now correctly pass null if it's null
          phoneNumber: contact.phoneNumber,
        })),
      }
      const response = await apiCall("/campaigns/", {
        method: "POST",
        body: JSON.stringify(payload),
      })
      console.log("response campaign", response)
      return response
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsStartingCampaign(false)
    }
  }

  // Validation functions
  // const validateStep1 = () => csvData.length > 0 && csvFile !== null
  // // const validateStep2 = () => dailyLimit > 0 && scheduleSettings.hour >= 0 && scheduleSettings.hour <= 23 
  // const validateStep2 = () => dailyLimit > 0 && scheduleSettings.hour >= 0 && scheduleSettings.hour <= 1435
  // const validateStep3 = () => selectedTemplate !== ""
  // const validateAllSteps = () => validateStep1() && validateStep2() && validateStep3()

  // Validation functions
const validateStep1 = () => csvData.length > 0 && csvFile !== null
const validateStep2 = () => dailyLimit > 0 && scheduleSettings.hour >= 0 && scheduleSettings.hour <= 1435 // Updated to 1435 for 15-minute intervals
const validateStep3 = () => selectedTemplate !== ""
const validateAllSteps = () => validateStep1() && validateStep2() && validateStep3()

  // Get step validation status
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex === 0) return validateStep1() ? "completed" : "incomplete"
    if (stepIndex === 1) return validateStep2() ? "completed" : "incomplete"
    if (stepIndex === 2) return "completed" // AI generation is optional
    if (stepIndex === 3) return validateStep3() ? "completed" : "incomplete"
    return "incomplete"
  }

  // Enhanced phone number validation function
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
        error: `Phone number must start with a valid country code. Examples: 92 (Pakistan), 1 (US), 44 (UK). Found: ${cleanPhone.substring(0, 3)}...`,
      }
    }
    return { isValid: true }
  }

  // Function to download CSV template
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

  // CSV File handling
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase()
      if (fileExtension === "csv") {
        setCsvFile(file)
        parseCsvFile(file)
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        setCsvFile(file)
        parseExcelFile(file)
      } else {
        showModal({
          type: "error",
          title: "Invalid File Type",
          message: "Please select a valid CSV or Excel (.xlsx, .xls) file.",
        })
      }
    }
  }, [])

  const parseExcelFile = useCallback((file: File) => {
    setIsParsingCsv(true)
    setCsvErrors([])
    setCsvData([])
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

        if (jsonData.length < 2) {
          setCsvErrors([{ row: 0, error: "Excel file must have at least a header row and one data row" }])
          setIsParsingCsv(false)
          return
        }

        const parsedData: CSVData[] = []
        const errors: CSVError[] = []

        // Check header row (optional for Excel, but good practice to check)
        const headerLine = jsonData[0].join(",").trim()
        const headerColumns = headerLine.split(",").map((col) => col.trim().replace(/"/g, ""))

        if (headerColumns.length < 2) {
          errors.push({
            row: 1,
            error: "Header must have at least 2 columns: 'Phone Number' and 'Customer Name'",
            data: headerColumns,
          })
        } else {
          const expectedHeaders = ["Phone Number", "Customer Name"]
          const headerValid = headerColumns
            .slice(0, 2)
            .every((header, index) => header.toLowerCase().includes(expectedHeaders[index].toLowerCase().split(" ")[0]))
          if (!headerValid) {
            errors.push({
              row: 1,
              error: "First two header columns should be 'Phone Number' and 'Customer Name'",
              data: headerColumns,
            })
          }
        }

        // Parse data rows starting from row 1 (skipping header)
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i]
          if (!row || row.length === 0) continue

          const phoneNumberRaw = String(row[0] || "").trim()
          const customerNameRaw = String(row[1] || "").trim()
          const phoneNumber = phoneNumberRaw
          const customerName = customerNameRaw || null

          const phoneValidation = validatePhoneNumber(phoneNumber)

          const hasCountryCodePrefix = validCountryCodes.some((code) => phoneNumber.startsWith(code))

          if (!phoneNumber || !phoneValidation.isValid || !hasCountryCodePrefix) {
            errors.push({
              row: i + 1,
              error: !phoneNumber
                ? "Phone number is required"
                : !phoneValidation.isValid
                  ? phoneValidation.error || "Invalid format"
                  : "Missing valid country code",
              data: row,
            })
            continue // Skip invalid numbers
          }

          parsedData.push({ phoneNumber, customerName })
        }

        setCsvData(parsedData)
        setCsvErrors(errors)
      } catch (error) {
        console.error("Excel parsing error:", error)
        setCsvErrors([{ row: 0, error: "Failed to parse Excel file." }])
      } finally {
        setIsParsingCsv(false)
      }
    }
    reader.readAsArrayBuffer(file)
  }, [])

  // const parseCsvFile = useCallback((file: File) => {
  //   setIsParsingCsv(true)
  //   setCsvErrors([])
  //   setCsvData([])
  //   setCsvPreview("")
  //   const reader = new FileReader()
  //   reader.onload = (e) => {
  //     try {
  //       const text = e.target?.result as string
  //       setCsvPreview(text)
  //       const lines = text
  //         .replace(/\r\n/g, "\n")
  //         .replace(/\r/g, "\n")
  //         .split("\n")
  //         .map((line) => line.trim())
  //         .filter((line) => line.length > 0)

  //       if (lines.length < 2) {
  //         setCsvErrors([{ row: 0, error: "CSV file must have at least a header row and one data row" }])
  //         setIsParsingCsv(false)
  //         return
  //       }

  //       const data: CSVData[] = []
  //       const errors: CSVError[] = []

  //       // Check header row
  //       const headerLine = lines[0].trim()
  //       const headerColumns = headerLine.split(",").map((col) => col.trim().replace(/"/g, ""))

  //       // Validate header format
  //       if (headerColumns.length !== 2) {
  //         errors.push({
  //           row: 1,
  //           error: "Header must have exactly 2 columns: 'Phone Number' and 'Customer Name'",
  //           data: headerColumns,
  //         })
  //       } else {
  //         const expectedHeaders = ["Phone Number", "Customer Name"]
  //         const headerValid = headerColumns.every((header, index) =>
  //           header.toLowerCase().includes(expectedHeaders[index].toLowerCase().split(" ")[0]),
  //         )
  //         if (!headerValid) {
  //           errors.push({
  //             row: 1,
  //             error: "Header columns should be 'Phone Number' and 'Customer Name'",
  //             data: headerColumns,
  //           })
  //         }
  //       }

  //       // Parse data rows
  //       for (let i = 1; i < lines.length; i++) {
  //         const line = lines[i].trim()
  //         if (!line) continue

  //         const columns = line.split(",").map((col) => col.trim().replace(/"/g, ""))

  //         if (columns.length !== 2) {
  //           errors.push({
  //             row: i + 1,
  //             error: "Each row must have exactly 2 columns",
  //             data: columns,
  //           })
  //           continue
  //         }

  //         const phoneNumber = String(columns[0] || "").trim()
  //         const customerName = String(columns[1] || "").trim() || null

  //         // Validate phone number
  //         const phoneValidation = validatePhoneNumber(phoneNumber)
  //         const hasCountryCodePrefix = validCountryCodes.some((code) => phoneNumber.startsWith(code))

  //         if (!phoneNumber || !phoneValidation.isValid || !hasCountryCodePrefix) {
  //           errors.push({
  //             row: i + 1,
  //             error: !phoneNumber
  //               ? "Phone number required"
  //               : !phoneValidation.isValid
  //                 ? phoneValidation.error || "Invalid format"
  //                 : "Missing country code",
  //             data: columns,
  //           })
  //           continue // Don't add to data, just ignore
  //         }

  //         data.push({
  //           phoneNumber: phoneNumber,
  //           customerName: customerName,
  //         })
  //       }
  //       setCsvData(data)
  //       setCsvErrors(errors)
  //     } catch (error) {
  //       console.error("CSV parsing error:", error)
  //       setCsvErrors([{ row: 0, error: "Failed to parse CSV file. Please check the file format." }])
  //     } finally {
  //       setIsParsingCsv(false)
  //     }
  //   }
  //   reader.onerror = () => {
  //     console.error("File reading error")
  //     setCsvErrors([{ row: 0, error: "Failed to read the file. Please try again." }])
  //     setIsParsingCsv(false)
  //   }
  //   reader.readAsText(file)
  // }, [])

  // Drag and drop handlers
  
  // Update the parseCsvFile function to calculate costs

  const parseCsvFile = useCallback((file: File) => {
  setIsParsingCsv(true)
  setCsvErrors([])
  setCsvData([])
  setCsvPreview("")
  setCostEstimation(null) // Reset cost estimation
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target?.result as string
      setCsvPreview(text)
      const lines = text
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      if (lines.length < 2) {
        setCsvErrors([{ row: 0, error: "CSV file must have at least a header row and one data row" }])
        setIsParsingCsv(false)
        return
      }

      const data: CSVData[] = []
      const errors: CSVError[] = []
      
      // For cost calculation
      const countryCounts: Record<string, number> = {}
      let validPhoneNumbers = 0

      // Check header row
      const headerLine = lines[0].trim()
      const headerColumns = headerLine.split(",").map((col) => col.trim().replace(/"/g, ""))

      // Validate header format
      if (headerColumns.length !== 2) {
        errors.push({
          row: 1,
          error: "Header must have exactly 2 columns: 'Phone Number' and 'Customer Name'",
          data: headerColumns,
        })
      } else {
        const expectedHeaders = ["Phone Number", "Customer Name"]
        const headerValid = headerColumns.every((header, index) =>
          header.toLowerCase().includes(expectedHeaders[index].toLowerCase().split(" ")[0]),
        )
        if (!headerValid) {
          errors.push({
            row: 1,
            error: "Header columns should be 'Phone Number' and 'Customer Name'",
            data: headerColumns,
          })
        }
      }

      // Parse data rows
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const columns = line.split(",").map((col) => col.trim().replace(/"/g, ""))

        if (columns.length !== 2) {
          errors.push({
            row: i + 1,
            error: "Each row must have exactly 2 columns (Phone Number, Customer Name)",
            data: columns,
          })
          continue
        }

        const [phoneNumberRaw, customerNameRaw] = columns
        const phoneNumber = phoneNumberRaw.trim()
        const customerName = customerNameRaw.trim() || null

        // Validate phone number
        const phoneValidation = validatePhoneNumber(phoneNumber)
        if (!phoneNumber) {
          errors.push({
            row: i + 1,
            error: "Phone number is required",
            data: columns,
          })
          continue
        }
        if (!phoneValidation.isValid) {
          errors.push({
            row: i + 1,
            error: phoneValidation.error || "Invalid phone number format",
            data: columns,
          })
          continue
        }

        // Additional check for country code
        const hasCountryCodePrefix = validCountryCodes.some((code) => phoneNumber.startsWith(code))
        if (!hasCountryCodePrefix) {
          errors.push({
            row: i + 1,
            error: `Phone number must start with a country code. Examples: 923364569588 (Pakistan), 14155552671 (US), 447911123456 (UK)`,
            data: columns,
          })
          continue
        }

        // Customer name is now optional, no validation needed for its presence or length
        data.push({
          phoneNumber: phoneNumber,
          customerName: customerName,
        })
        
        // Calculate cost for valid numbers
        const countryPrefix = extractCountryPrefix(phoneNumber)
        if (countryPrefix) {
          const countryInfo = COUNTRY_COSTS.find(c => c.prefix === countryPrefix)
          if (countryInfo) {
            validPhoneNumbers++
            countryCounts[countryInfo.country] = (countryCounts[countryInfo.country] || 0) + 1
          }
        }
      }
      
      setCsvData(data)
      setCsvErrors(errors)
      
      // Calculate and set cost estimation if we have valid numbers
      if (validPhoneNumbers > 0) {
  const breakdown = Object.entries(countryCounts)
    .map(([country, count]) => {
      const countryInfo = COUNTRY_COSTS.find(c => c.country === country)
      return {
        country,
        count,
        cost: count * (countryInfo?.cost || 0),
      }
    })
    .sort((a, b) => b.count - a.count)
  
  const totalCost = breakdown.reduce((sum, item) => sum + item.cost, 0)
  
  setCostEstimation({
    totalNumbers: validPhoneNumbers,
    breakdown,
    totalCost,
  })
}

      
    } catch (error) {
      console.error("CSV parsing error:", error)
      setCsvErrors([{ row: 0, error: "Failed to parse CSV file. Please check the file format." }])
    } finally {
      setIsParsingCsv(false)
    }
  }
  reader.onerror = () => {
    console.error("File reading error")
    setCsvErrors([{ row: 0, error: "Failed to read the file. Please try again." }])
    setIsParsingCsv(false)
  }
  reader.readAsText(file)
}, [validatePhoneNumber, validCountryCodes])
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = e.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        if (file.type === "text/csv" || file.name.endsWith(".csv")) {
          setCsvFile(file)
          parseCsvFile(file)
        } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
          setCsvFile(file)
          parseExcelFile(file)
        } else {
          showModal({
            type: "error",
            title: "Invalid File Type",
            message: "Please drop a valid CSV or Excel (.xlsx, .xls) file.",
          })
        }
      }
    },
    [parseCsvFile, parseExcelFile],
  )

  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }

  // Template creation
  // const handleCreateTemplate = useCallback(async () => {
  //   if (!newTemplate.title || !newTemplate.body) {
  //     showModal({
  //       type: "warning",
  //       title: "Missing Information",
  //       message: "Please fill in template title and body text before creating the template.",
  //     })
  //     return
  //   }
  //   // Validate button URL if button text is provided
  //   if (newTemplate.btn && !newTemplate.btnUrl) {
  //     showModal({
  //       type: "warning",
  //       title: "Missing Button URL",
  //       message: "Please provide a button URL when adding a call-to-action button.",
  //     })
  //     return
  //   }
  //   try {
  //     await createTemplateAPI(newTemplate)
  //     setIsCreatingTemplate(false)

  //     // Clean up image preview URL
  //     if (newTemplate.headerImagePreview && newTemplate.headerImagePreview.startsWith("blob:")) {
  //       URL.revokeObjectURL(newTemplate.headerImagePreview)
  //     }

  //     setNewTemplate({
  //       title: "",
  //       url: "",
  //       lang: "en",
  //       header: "",
  //       body: "",
  //       footer: "",
  //       btn: "",
  //       btnUrl: "",
  //       headerImage: null,
  //       headerImagePreview: "",
  //     })
  //     setUseHeaderImage(false)
  //     showModal({
  //       type: "success",
  //       title: "Template Created",
  //       message: "Your template has been created successfully and is now available for selection.",
  //     })
  //   } catch (error) {
  //     showModal({
  //       type: "error",
  //       title: "Template Creation Failed",
  //       message: "Failed to create template. Please check your connection and try again.",
  //     })
  //   }
  // }, [newTemplate])

  const handleCreateTemplate = useCallback(async () => {
  if (!newTemplate.title || !newTemplate.body) {
    showModal({
      type: "warning",
      title: "Missing Information",
      message: "Please fill in template title and body text before creating the template.",
    })
    return
  }
  
  // Validate all buttons
  const buttonErrors = []
  
  if (newTemplate.btn && !newTemplate.btnUrl) {
    buttonErrors.push("Button 1 requires a URL")
  }
  if (newTemplate.btn2 && !newTemplate.btn2Url) {
    buttonErrors.push("Button 2 requires a URL")
  }
  
  
  // Check button text length
  if (newTemplate.btn && newTemplate.btn.length > MAX_BUTTON_TEXT_LENGTH) {
    buttonErrors.push(`Button 1 text exceeds ${MAX_BUTTON_TEXT_LENGTH} characters`)
  }
  if (newTemplate.btn2 && newTemplate.btn2.length > MAX_BUTTON_TEXT_LENGTH) {
    buttonErrors.push(`Button 2 text exceeds ${MAX_BUTTON_TEXT_LENGTH} characters`)
  }
  if (newTemplate.btn3 && newTemplate.btn3.length > MAX_BUTTON_TEXT_LENGTH) {
    buttonErrors.push(`Button 3 text exceeds ${MAX_BUTTON_TEXT_LENGTH} characters`)
  }
  
  if (buttonErrors.length > 0) {
    showModal({
      type: "warning",
      title: "Button Validation Errors",
      message: `Please fix the following:\n\n• ${buttonErrors.join('\n• ')}`,
    })
    return
  }
  
    try {
      await createTemplateAPI(newTemplate)
      setIsCreatingTemplate(false)

      // Clean up image preview URL
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
      showModal({
        type: "success",
        title: "Template Created",
        message: "Your template has been created successfully and is now available for selection.",
      })
    } catch (error) {
      showModal({
        type: "error",
        title: "Template Creation Failed",
        message: "Failed to create template. Please check your connection and try again.",
      })
    }
}, [newTemplate])


// Add this component for displaying cost estimation
const CostEstimationDisplay = ({ estimation }: { estimation: typeof costEstimation }) => {
  if (!estimation) return null
  
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          💰 Cost Estimation
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2">
            Total Valid Numbers:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {estimation.totalNumbers}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Breakdown by Country:
        </Typography>
        
        <Stack spacing={1} sx={{ maxHeight: 150, overflowY: 'auto', mb: 2 }}>
          {estimation.breakdown.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption">
                {item.country} ({item.count})
              </Typography>
              <Typography variant="caption" fontWeight="bold">
                ${item.cost.toFixed(4)}
              </Typography>
            </Box>
          ))}
        </Stack>
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body1" fontWeight="bold">
            Total Estimated Cost:
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            ${estimation.totalCost.toFixed(4)}
          </Typography>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          * Based on per-message rates for each country
        </Typography>
      </CardContent>
    </Card>
  )
}

  // Campaign start with validation
  const handleStartCampaign = useCallback(async () => {
    const errors: string[] = []
    if (!validateStep1()) {
      errors.push("• Please upload a valid CSV file with contacts")
    }
    if (!validateStep2()) {
      errors.push("• Please set a valid daily limit and schedule")
    }
    if (!validateStep3()) {
      errors.push("• Please select or create a template")
    }
    if (errors.length > 0) {
      showModal({
        type: "warning",
        title: "Campaign Not Ready",
        message: `Please complete all required steps:\n\n${errors.join("\n")}`,
      })
      return
    }
    const selectedTemplateData = templates.find((t) => t.id.toString() === selectedTemplate)
    const selectedTime = hourOptions.find((h) => h.value === scheduleSettings.hour)?.label
    const selectedTz = timezones.find((tz) => tz.value === scheduleSettings.timezone)?.label
    showModal({
      type: "info",
      title: "Confirm Campaign Launch",
      message: `Are you sure you want to start this campaign?\n\nCampaign Details:\n• Recipients: ${csvData.length}\n• Daily limit: ${dailyLimit}\n• Send time: ${selectedTime} (${selectedTz})\n• Template: ${selectedTemplateData?.title}\n• Estimated completion: ${Math.ceil(csvData.length / dailyLimit)} days\n\nThis action cannot be undone.`,
      onConfirm: async () => {
        try {
          await startCampaignAPI()
          showModal({
            type: "success",
            title: "Campaign Started Successfully!",
            message: `Your campaign has been launched successfully.\n\nCampaign Details:\n• Recipients: ${csvData.length}\n• Daily limit: ${dailyLimit}\n• Send time: ${selectedTime} (${selectedTz})\n• Template: ${selectedTemplateData?.title}\n• Estimated completion: ${Math.ceil(csvData.length / dailyLimit)} days\n\nThe form will be reset for your next campaign.`,
            onConfirm: resetForm,
            confirmText: "Ok",
          })
        } catch (error) {
          showModal({
            type: "error",
            title: "Campaign Launch Failed",
            message: "Failed to start campaign. ❌ Template is not approved yet by Meta.",
          })
        }
      },
      confirmText: "Start Campaign",
      cancelText: "Cancel",
    })
  }, [csvData, dailyLimit, scheduleSettings, selectedTemplate, templates, hourOptions, timezones])

  // Template preview with name replacement
  const getPreviewText = useCallback((template: Template, sampleName: string | null = "John") => {
    const nameToUse = sampleName || "there" // Fallback if customerName is null
    return {
      headerText: template.header?.replace(/\{\{customerName\}\}/g, nameToUse),
      bodyText: template.body.replace(/\{\{customerName\}\}/g, nameToUse),
      footerText: template.footer?.replace(/\{\{customerName\}\}/g, nameToUse),
    }
  }, [])

  // Helper function to detect if URL is a video
  const isVideoUrl = (url: string) => {
    if (!url) return false
    console.log("uploadSelectType", uploadSelectType)
    console.log("url^^^", url)
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".wmv"]
    const videoMimeTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"]

    // Check by extension
    if (videoExtensions.some((ext) => url.toLowerCase().includes(ext))) {
      return true
    }

    // Check by file type if it's a blob URL (for previews)
    if (url.startsWith("blob:")) {
      // You'll need to track the file type separately
      return uploadSelectType === "Video"
    }

    return false
  }

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()
        setUserBusinessData(response?.data?.results[0] || {})
      } catch (err: any) {
        console.error("Error fetching data:", err)
      }
    }
    fetchBusiness()
  }, [])

  const selectedTemplateData = useMemo(() => {
    return templates.find((t) => t.id.toString() === selectedTemplate)
  }, [templates, selectedTemplate])

  // const getLivePreviewTemplate = useMemo(() => {
  //   if (isCreatingTemplate) {
  //     // Convert new template format to display format
  //     return {
  //       id: 0,
  //       title: newTemplate.title,
  //       name: "",
  //       url: newTemplate.headerImagePreview || newTemplate.url,
  //       lang: newTemplate.lang,
  //       header: newTemplate.header,
  //       body: newTemplate.body,
  //       footer: newTemplate.footer,
  //       btn: newTemplate.btn,
  //       btnUrl: newTemplate.btnUrl,
  //     }
  //   }
  //   return selectedTemplateData
  // }, [isCreatingTemplate, newTemplate, selectedTemplateData])

  const getLivePreviewTemplate = useMemo(() => {
  if (isCreatingTemplate) {
    return {
      id: 0,
      title: newTemplate.title,
      name: "",
      url: newTemplate.headerImagePreview || newTemplate.url,
      lang: newTemplate.lang,
      header: newTemplate.header,
      body: newTemplate.body,
      footer: newTemplate.footer,
      btn: newTemplate.btn,
      btnUrl: newTemplate.btnUrl,
      btn2: newTemplate.btn2,
      btn2Url: newTemplate.btn2Url,
      btn3: newTemplate.btn3,
    }
  }
  return selectedTemplateData
}, [isCreatingTemplate, newTemplate, selectedTemplateData])

  const steps = [
    { title: "Upload CSV File", icon: Upload },
    { title: "Set Schedule & Limit", icon: Schedule },
    { title: "Generate AI Assets (Optional)", icon: AutoAwesome }, // added new step
    { title: "Select/Create Template", icon: Message },
    { title: "Preview & Send", icon: Send },
    { title: "View Campaigns", icon: RemoveRedEye },
  ]

  // WhatsApp Preview Component
  const WhatsAppPreview = React.memo(({ template }: { template?: Template }) => {
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
          width: 320, // Fixed width for consistent preview
        }}
      >
        {/* WhatsApp Header */}
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
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
            <Videocam sx={{ fontSize: { xs: 20, sm: 24 } }} />
            <Phone sx={{ fontSize: { xs: 20, sm: 24 } }} />
            <MoreVert sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </Box>
        </Box>
        {/* Chat Background */}
        <Box
          sx={{
            minHeight: { xs: 300, sm: 400 },
            p: { xs: 1, sm: 2 },
            position: "relative",
            backgroundImage: isDark
              ? "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.02) 0%, transparent 50%)"
              : "radial-gradient(circle at 25% 25%, rgba(0,0,0,0.02) 0%, transparent 50%)",
          }}
        >
          {/* Date Badge */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Chip
              label={new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              size="small"
              sx={{
                bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)",
                fontSize: "0.75rem",
                color: isDark ? "white" : "inherit",
              }}
            />
          </Box>
          {!template ? (
            /* No Template Selected State */
            <Box sx={{ textAlign: "center", py: { xs: 4, sm: 8 }, color: "text.secondary" }}>
              <Message sx={{ fontSize: { xs: 32, sm: 48 }, mb: 2, opacity: 0.5 }} />
              <Typography variant="body1" gutterBottom sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                No template selected
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                Create or select a template to see preview
              </Typography>
            </Box>
          ) : (
            /* Message Bubble */
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Paper
                sx={{
                  maxWidth: 280,
                  width: "100%",
                  bgcolor: "#dcf8c6",
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                {/* Header Image/Text */}
                {!isCreatingTemplate && (
                  <>
                    {template.url ? (
                      template.url.toLowerCase().endsWith(".mp4") ? (
                        <Box
                          sx={{
                            width: "100%",
                            height: 160,
                            bgcolor: "#000",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                        >
                          <video
                            src={template.url}
                            controls
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: 160,
                            backgroundImage: `url(${template.url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: 1,
                          }}
                        />
                      )
                    ) : (
                      template.header && (
                        <Box sx={{ p: 2, bgcolor: "#dcf8c6" }}>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            sx={{
                              fontSize: "0.875rem",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              color: "#000000",
                            }}
                          >
                            {truncateText(previewText?.headerText || template.header)}
                          </Typography>
                        </Box>
                      )
                    )}
                  </>
                )}

                {isCreatingTemplate && (
                  <>
                    {template.url ? (
                      isVideoUrl(template.url) ? (
                        <Box
                          sx={{
                            width: "100%",
                            height: 160,
                            bgcolor: "#000",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                        >
                          <video
                            src={template.url}
                            controls
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: 160,
                            backgroundImage: `url(${template.url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: 1,
                          }}
                        />
                      )
                    ) : (
                      template.header && (
                        <Box sx={{ p: 2, bgcolor: "#dcf8c6" }}>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            sx={{
                              fontSize: "0.875rem",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              color: "#000000",
                            }}
                          >
                            {truncateText(previewText?.headerText || template.header)}
                          </Typography>
                        </Box>
                      )
                    )}
                  </>
                )}

                {/* Body Text */}
                <Box sx={{ p: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-line",
                      mb: 2,
                      color: "#000000", // Always black text for WhatsApp message bubble
                      fontSize: "0.875rem",
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {truncateText(previewText?.bodyText || template.body || "Enter your message here...", 200)}
                  </Typography>
                  {/* Footer Text */}
                  {template.footer && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#666666", // Darker gray for footer text in WhatsApp bubble
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid",
                        borderColor: "grey.300",
                        display: "block",
                        fontSize: "0.75rem",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {truncateText(previewText?.footerText || template.footer)}
                    </Typography>
                  )}
                  {/* Button */}
                  {/* {template.btn && (
                    <>
                      <Divider sx={{ my: 2, borderColor: "grey.300" }} />
                      <Box sx={{ textAlign: "center" }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          size="small"
                          sx={{
                            borderColor: "#25d366",
                            color: "#25d366",
                            textTransform: "none",
                            fontSize: "0.75rem",
                            "&:hover": {
                              bgcolor: "#25d366",
                              color: "white",
                            },
                          }}
                        >
                          🔗 {truncateText(template.btn, 20)}
                        </Button>
                      </Box>
                    </>
                  )} */}
{/* Buttons */}
{(template.btn && template.btnUrl) && (
  <>
    <Divider sx={{ my: 2, borderColor: "grey.300" }} />
    <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
      {template.btn && template.btnUrl && (
        <Button
          variant="outlined"
          fullWidth
          size="small"
          sx={{
            borderColor: "#25d366",
            color: "#25d366",
            textTransform: "none",
            fontSize: "0.75rem",
            "&:hover": {
              bgcolor: "#25d366",
              color: "white",
            },
          }}
        >
          🔗 {truncateText(template.btn, 20)}
        </Button>
      )}
      {template.btn2 && template.btn2Url && (
        <Button
          variant="outlined"
          fullWidth
          size="small"
          sx={{
            borderColor: "#25d366",
            color: "#25d366",
            textTransform: "none",
            fontSize: "0.75rem",
            "&:hover": {
              bgcolor: "#25d366",
              color: "white",
            },
          }}
        >
          📞 {truncateText(template.btn2, 20)}
        </Button>
      )}
      {template.btn3 && (
        <Button
          variant="outlined"
          fullWidth
          size="small"
          sx={{
            borderColor: "#25d366",
            color: "#25d366",
            textTransform: "none",
            fontSize: "0.75rem",
            "&:hover": {
              bgcolor: "#25d366",
              color: "white",
            },
          }}
        >
          🌐 {truncateText(template.btn3, 20)}
        </Button>
      )}
    </Stack>
  </>
)}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5, mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.6rem" }}>
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.25 }}>
                      <Box sx={{ width: 4, height: 4, bgcolor: "grey.400", borderRadius: "50%" }} />
                      <Box sx={{ width: 4, height: 4, bgcolor: "grey.400", borderRadius: "50%" }} />
                    </Box>
                  </Box>
                </Box>
                {/* Message tail */}
                <Box
                  sx={{
                    position: "absolute",
                    right: -8,
                    bottom: 12,
                    width: 0,
                    height: 0,
                    borderLeft: "8px solid #dcf8c6",
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                  }}
                />
              </Paper>
            </Box>
          )}
          {/* Opt-out text - only show when template exists */}
          {template?.body && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  maxWidth: 280,
                  fontSize: "0.6rem",
                }}
              >
                Send STOP to opt-out
              </Typography>
            </Box>
          )}
        </Box>
        {/* WhatsApp Input Area */}
        <Box
          sx={{
            bgcolor: isDark ? "#2a2a2a" : "#f0f0f0",
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton
            size="small"
            sx={{
              bgcolor: "#25d366",
              color: "white",
              "&:hover": { bgcolor: "#128c7e" },
              width: 32,
              height: 32,
            }}
          >
            <Add sx={{ fontSize: 16 }} />
          </IconButton>
          <Box
            sx={{
              flex: 1,
              bgcolor: isDark ? "#3a3a3a" : "white",
              borderRadius: 25,
              px: 3,
              py: 1.5,
              color: "text.secondary",
              border: `1px solid ${isDark ? "#4a4a4a" : "#e0e0e0"}`,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <EmojiEmotions sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2" sx={{ flex: 1, fontSize: "0.75rem" }}>
              Type a message
            </Typography>
            <AttachFile sx={{ fontSize: 16, color: "text.secondary" }} />
          </Box>
          <IconButton
            size="small"
            sx={{
              bgcolor: "#25d366",
              color: "white",
              "&:hover": { bgcolor: "#128c7e" },
              width: 32,
              height: 32,
            }}
          >
            <Mic sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
        {/* Home indicator */}
        <Box
          sx={{
            bgcolor: isDark ? "grey.600" : "black",
            height: 4,
            width: 100,
            mx: "auto",
            borderRadius: 2,
            mt: 1,
          }}
        />
      </Box>
    )
  })

  // Modal Component
  const ModalDialog = () => {
    const getModalIcon = () => {
      switch (modal.type) {
        case "success":
          return <CheckCircleOutline sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
        case "error":
          return <ErrorIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
        case "warning":
          return <Warning sx={{ fontSize: 48, color: "warning.main", mb: 2 }} />
        default:
          return <CheckCircle sx={{ fontSize: 48, color: "info.main", mb: 2 }} />
      }
    }
    return (
      <Dialog
        open={modal.open}
        onClose={closeModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        <DialogContent sx={{ textAlign: "center", pt: 3 }}>
          {getModalIcon()}
          <DialogTitle sx={{ p: 0, mb: 2 }}>
            <Typography variant="h5" fontWeight="bold" color={`${modal.type}.main`}>
              {modal.title}
            </Typography>
          </DialogTitle>
          <DialogContentText sx={{ whiteSpace: "pre-line", fontSize: "1rem", color: "text.primary" }}>
            {modal.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
          {modal.onConfirm && (
            <Button
              onClick={() => {
                modal.onConfirm?.()
                closeModal()
              }}
              variant="contained"
              color={modal.type === "error" ? "error" : modal.type === "warning" ? "warning" : "primary"}
              size="large"
              sx={{ minWidth: 120 }}
            >
              {modal.confirmText || "OK"}
            </Button>
          )}
          <Button
            onClick={closeModal}
            variant={modal.onConfirm ? "outlined" : "contained"}
            color={modal.type === "error" ? "error" : modal.type === "warning" ? "warning" : "primary"}
            size="large"
            sx={{ minWidth: 120 }}
          >
            {modal.cancelText || (modal.onConfirm ? "Cancel" : "OK")}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  // Handlers for editing and deleting rows in CSV data
  const handleEditRow = (index: number) => {
    setEditingRowIndex(index)
    setEditingValues(csvData[index])
  }

  const handleSaveEdit = () => {
    if (editingRowIndex !== null && editingValues !== null) {
      const updatedCsvData = [...csvData]
      const phoneNumber = editingValues.phoneNumber.trim()
      const customerName = editingValues.customerName?.trim() || null

      const phoneValidation = validatePhoneNumber(phoneNumber)
      const hasCountryCodePrefix = validCountryCodes.some((code) => phoneNumber.startsWith(code))

      if (!phoneNumber || !phoneValidation.isValid || !hasCountryCodePrefix) {
        showModal({
          type: "warning",
          title: "Invalid Phone Number",
          message: `The phone number entered is invalid. Please ensure it starts with a valid country code and is 10-15 digits long.`,
        })
        return
      }

      updatedCsvData[editingRowIndex] = { phoneNumber, customerName }
      setCsvData(updatedCsvData)
    }
    setEditingRowIndex(null)
    setEditingValues(null)
  }

  const handleDeleteRow = (index: number) => {
    const updatedCsvData = csvData.filter((_, i) => i !== index)
    setCsvData(updatedCsvData)
    if (editingRowIndex === index) {
      setEditingRowIndex(null)
      setEditingValues(null)
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
      <Container maxWidth="xl">
        {/* Header */}
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h1"
                color="primary"
                fontWeight="bold"
                sx={{ textAlign: { xs: "center", sm: "left" } }}
              >
                Newsletter Campaign Manager
              </Typography>
            }
            subheader={
              <Typography
                variant={isMobile ? "body1" : "h6"}
                color="text.secondary"
                sx={{ textAlign: { xs: "center", sm: "left" } }}
              >
                Create and send WhatsApp Business newsletter campaigns with personalized templates
              </Typography>
            }
          />
        </Card>

        {/* Progress Steps */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            {isMobile ? (
              /* Mobile Vertical Stepper */
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const status = getStepStatus(index)
                  const isCompleted = status === "completed"
                  return (
                    <Step key={index}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: isCompleted
                                ? "success.main"
                                : index === activeStep
                                  ? "primary.main"
                                  : "grey.300",
                              color: "white",
                            }}
                          >
                            {isCompleted ? <CheckCircle sx={{ fontSize: 20 }} /> : <Icon sx={{ fontSize: 20 }} />}
                          </Box>
                        )}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          {step.title}
                        </Typography>
                        {!isCompleted && (
                          <Typography variant="caption" color="error.main">
                            Incomplete
                          </Typography>
                        )}
                      </StepLabel>
                      <StepContent>
                        <Box sx={{ py: 1 }}>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                              disabled={activeStep === 0}
                            >
                              Previous
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => {
                                const nextStep = Math.min(steps.length - 1, activeStep + 1)
                                if (activeStep === 0 && !validateStep1()) {
                                  showModal({
                                    type: "warning",
                                    title: "Step Incomplete",
                                    message: "Please upload a valid CSV file before proceeding to the next step.",
                                  })
                                  return
                                }
                                if (activeStep === 1 && !validateStep2()) {
                                  showModal({
                                    type: "warning",
                                    title: "Step Incomplete",
                                    message:
                                      "Please set a valid daily limit and schedule before proceeding to the next step.",
                                  })
                                  return
                                }
                                if (activeStep === 3 && !validateStep3()) {
                                  showModal({
                                    type: "warning",
                                    title: "Step Incomplete",
                                    message: "Please select or create a template before proceeding to the next step.",
                                  })
                                  return
                                }
                                setActiveStep(nextStep)
                              }}
                              disabled={activeStep === steps.length - 1}
                            >
                              Next
                            </Button>
                          </Stack>
                        </Box>
                      </StepContent>
                    </Step>
                  )
                })}
              </Stepper>
            ) : (
              /* Desktop Horizontal Stepper */
              <>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  {steps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = index === activeStep
                    const status = getStepStatus(index)
                    const isCompleted = status === "completed"
                    return (
                      <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                        <IconButton
                          onClick={() => setActiveStep(index)}
                          sx={{
                            width: 48,
                            height: 48,
                            mb: 1,
                            bgcolor: isCompleted ? "success.main" : isActive ? "primary.main" : "grey.300",
                            color: "white",
                            "&:hover": {
                              bgcolor: isCompleted ? "success.dark" : isActive ? "primary.dark" : "grey.400",
                            },
                          }}
                        >
                          {isCompleted ? <CheckCircle /> : <Icon />}
                        </IconButton>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          textAlign="center"
                          color={isActive ? "primary.main" : "text.secondary"}
                          sx={{ px: 1 }}
                        >
                          {step.title}
                        </Typography>
                        {!isCompleted &&
                          index < 3 && ( // Only show "Incomplete" for steps before the last one
                            <Typography variant="caption" color="error.main" sx={{ mt: 0.5 }}>
                              Incomplete
                            </Typography>
                          )}
                      </Box>
                    )
                  })}
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(activeStep / (steps.length - 1)) * 100}
                  sx={{ width: "100%", mb: 2 }}
                />
                {/* Navigation Buttons */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    startIcon={<ArrowBack />}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="contained" // made primary button contained
                    onClick={() => {
                      const nextStep = Math.min(steps.length - 1, activeStep + 1)
                      if (activeStep === 0 && !validateStep1()) {
                        showModal({
                          type: "warning",
                          title: "Step Incomplete",
                          message:
                            "Please upload a valid CSV file with at least one valid contact before proceeding to the next step.",
                        })
                        return
                      }
                      if (activeStep === 1 && !validateStep2()) {
                        showModal({
                          type: "warning",
                          title: "Step Incomplete",
                          message: "Please set a valid daily limit and schedule before proceeding to the next step.",
                        })
                        return
                      }
                      if (activeStep === 3 && !validateStep3()) {
                        showModal({
                          type: "warning",
                          title: "Step Incomplete",
                          message: "Please select or create a template before proceeding to the next step.",
                        })
                        return
                      }
                      setActiveStep(nextStep)
                    }}
                    disabled={activeStep === steps.length - 1}
                    endIcon={<ArrowForward />}
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
           
           {/* Step 1: CSV Upload */}
            {activeStep === 0 && (
              <Card>
                <CardHeader
                  title={
                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                      <Upload />
                      <Typography variant="h6">Upload CSV File</Typography>
                      {validateStep1() && <CheckCircle sx={{ color: "success.main" }} />}
                    </Stack>
                  }
                  subheader="Upload a CSV or Excel file with contacts"
                />
                <CardContent>
                  <Stack spacing={3}>
                    <Alert severity="info">
                      <AlertTitle>File Format Requirements</AlertTitle>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        <li>
                          <strong>Header row required:</strong> &quot;Phone Number, Customer Name&quot;
                        </li>
                        <li>
                          <strong>Phone numbers must include country code:</strong> 923364569588 (Pakistan), 14155552671
                          (US)
                        </li>
                        <li>
                          <strong>No + symbol allowed:</strong> Use 92 instead of +92
                        </li>
                        <li>
                          <strong>Phone number length:</strong> 10-15 digits total including country code
                        </li>
                        <li>
                          <strong>Customer names:</strong> Optional.
                        </li>
                        <li>
                          <strong>File structure:</strong> Exactly 2 columns only for valid records. Extra columns will
                          be ignored.
                        </li>
                        <li>
                          <strong>Minimum requirement:</strong> At least one valid contact to proceed
                        </li>
                      </ul>
                    </Alert>

                    {/* Download Template Button */}
                    <Box sx={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Download />}
                        onClick={downloadCsvTemplate}
                        sx={{ mb: 2 }}
                      >
                        Download CSV Template
                      </Button>
                      <Typography variant="body2" color="text.secondary">
                        Download a sample CSV file with the correct format and example data
                      </Typography>
                    </Box>

                    <Paper
                      sx={{
                        border: "2px dashed",
                        borderColor: isDragOver ? "primary.main" : "grey.300",
                        borderRadius: 2,
                        p: { xs: 3, sm: 4 },
                        textAlign: "center",
                        bgcolor: isDragOver ? "action.hover" : "transparent",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: "action.hover",
                        },
                      }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={handleFileInputClick}
                    >
                      <Upload
                        sx={{
                          fontSize: { xs: 32, sm: 48 },
                          color: isDragOver ? "primary.main" : "grey.400",
                          mb: 2,
                          transition: "color 0.2s ease-in-out",
                        }}
                      />
                      <input
                        ref={fileInputRef}
                        accept=".csv, .xlsx, .xls"
                        style={{ display: "none" }}
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                      />
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: isDragOver ? "primary.main" : "text.primary" }}
                      >
                        {isDragOver ? "Drop your CSV/Excel file here" : "Drag & Drop CSV/Excel File"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        or click to browse files
                      </Typography>
                      <Button
                        variant="outlined"
                        component="span"
                        disabled={isParsingCsv}
                        size={isMobile ? "small" : "medium"}
                        sx={{ pointerEvents: "none" }}
                      >
                        {isParsingCsv ? "Processing..." : "Choose File"}
                      </Button>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        CSV, XLSX, XLS files only
                      </Typography>
                    </Paper>

                    {isParsingCsv && (
                      <Box>
                        <LinearProgress />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Processing file...
                        </Typography>
                      </Box>
                    )}

                    {csvFile && (
                      <Alert severity="info">
                        <AlertTitle>File Selected</AlertTitle>
                        {csvFile.name} ({(csvFile.size / 1024).toFixed(2)} KB)
                      </Alert>
                    )}

                    {csvErrors.length > 0 && (
                      <Alert severity="warning">
                        <AlertTitle>Ignored Invalid Records ({csvErrors.length})</AlertTitle>
                        <Typography variant="body2">
                          We found {csvErrors.length} invalid phone numbers or incorrectly formatted rows. These will be
                          ignored, but you can still run your campaign with the {csvData.length} valid numbers below.
                        </Typography>
                        <Box sx={{ maxHeight: 100, overflow: "auto", mt: 1 }}>
                          {csvErrors.slice(0, 5).map((error, index) => (
                            <Typography key={index} variant="caption" display="block">
                              Row {error.row}: {error.error}
                            </Typography>
                          ))}
                        </Box>
                      </Alert>
                    )}

                    {/* {csvData.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <Divider sx={{ mb: 2 }}>
                          <Chip label="Editor Preview" icon={<EditIcon />} />
                        </Divider>
                        <Typography variant="subtitle2" gutterBottom color="text.secondary">
                          Review and edit your contact list before proceeding:
                        </Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                          <Table size="small" stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Customer Name</TableCell>
                                <TableCell align="right">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {csvData.map((row, index) => (
                                <TableRow key={index} hover>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>
                                    {editingRowIndex === index ? (
                                      <TextField
                                        size="small"
                                        value={editingValues?.phoneNumber}
                                        onChange={(e) =>
                                          setEditingValues((prev) =>
                                            prev ? { ...prev, phoneNumber: e.target.value } : null,
                                          )
                                        }
                                        fullWidth
                                      />
                                    ) : (
                                      row.phoneNumber
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editingRowIndex === index ? (
                                      <TextField
                                        size="small"
                                        value={editingValues?.customerName || ""}
                                        onChange={(e) =>
                                          setEditingValues((prev) =>
                                            prev ? { ...prev, customerName: e.target.value || null } : null,
                                          )
                                        }
                                        fullWidth
                                      />
                                    ) : (
                                      row.customerName || "—"
                                    )}
                                  </TableCell>
                                  <TableCell align="right">
                                    {editingRowIndex === index ? (
                                      <IconButton size="small" color="primary" onClick={handleSaveEdit}>
                                        <SaveIcon fontSize="small" />
                                      </IconButton>
                                    ) : (
                                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <IconButton size="small" onClick={() => handleEditRow(index)}>
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDeleteRow(index)}>
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Stack>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                          Showing {csvData.length} valid contacts ready for campaign.
                        </Typography>
                      </Box>
                    )} */}

                    {csvData.length > 0 && (
  <Box>
    <Typography variant="h6" gutterBottom>
      Parsed Data Preview:
    </Typography>
    <Paper sx={{ p: 2, bgcolor: "background.default" }}>
      <Stack spacing={1}>
        {csvData.slice(0, 5).map((row, index) => (
          <Stack key={index} direction="row" spacing={1} flexWrap="wrap">
            <Chip label={row.phoneNumber} size="small" variant="outlined" />
            <Chip label={row.customerName || "(No Name)"} size="small" color="primary" />
          </Stack>
        ))}
      </Stack>
      {csvData.length > 5 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          ... and {csvData.length - 5} more records
        </Typography>
      )}
    </Paper>
    
    {/* Add cost estimation display here */}
    <CostEstimationDisplay estimation={costEstimation} />
  </Box>
)}

                    {csvErrors.length > 0 && csvData.length === 0 && (
                      <Alert severity="error">
                        <AlertTitle>No Valid Contacts Found</AlertTitle>
                        All records in your file were invalid. Please check the country codes and format.
                      </Alert>
                    )}

                    {/* {csvData.length > 0 && csvErrors.length === 0 && (
                      <Alert severity="success">
                        <AlertTitle>Success!</AlertTitle>
                        Successfully parsed {csvData.length} valid records
                      </Alert>
                    )} */}

                    {csvData.length > 0 && csvErrors.length === 0 && (
  <Alert severity="success">
    <AlertTitle>Success!</AlertTitle>
    Successfully parsed {csvData.length} valid records
    {costEstimation && (
      <Typography variant="body2" sx={{ mt: 1 }}>
        Estimated cost: <strong>${costEstimation.totalCost.toFixed(4)}</strong>
      </Typography>
    )}
  </Alert>
)}

                    {csvPreview && (
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Raw File Preview:
                        </Typography>
                        <Paper sx={{ p: 2, bgcolor: "background.default", maxHeight: 200, overflow: "auto" }}>
                          <Typography variant="body2" component="pre" sx={{ fontSize: "0.75rem" }}>
                            {csvPreview.split("\n").slice(0, 10).join("\n")}
                            {csvPreview.split("\n").length > 10 && "\n... (truncated)"}
                          </Typography>
                        </Paper>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}


            {/* Step 2: Schedule & Daily Limit */}
            {activeStep === 1 && (
              <Card>
                <CardHeader
                  title={
                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                      <Schedule />
                      <Typography variant="h6">Set Schedule & Daily Limit</Typography>
                      {validateStep2() && <CheckCircle sx={{ color: "success.main" }} />}
                    </Stack>
                  }
                  subheader="Configure when and how many messages to send daily"
                />
                <CardContent>
                  <Stack spacing={3}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        {/* <TextField
                          label="Daily Limit"
                          type="number"
                          value={dailyLimit}
                          onChange={(e) => setDailyLimit(Number(e.target.value))}
                          inputProps={{ min: 1, max: 1000 }}
                          fullWidth
                          helperText="Maximum messages per day (1-1000)"
                        /> */}
                        <TextField
  label="Daily Limit"
  type="number"
  value={dailyLimit}
  onChange={(e) => setDailyLimit(Number(e.target.value))}
  inputProps={{ min: 1, max: 1000 }}
  fullWidth
  helperText="Maximum messages per day (1-1000)"
/>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Send Time</InputLabel>
                          <Select
                            value={scheduleSettings.hour}
                            onChange={(e) => {
                              setScheduleSettings((prev) => ({ ...prev, hour: Number(e.target.value) }))
                            }}
                            label="Send Time"
                          >
                            {hourOptions.map((hour) => (
                              <MenuItem key={hour.value} value={hour.value}>
                                {hour.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel>Timezone</InputLabel>
                          <Select
                            value={scheduleSettings.timezone}
                            onChange={(e) => {
                              setScheduleSettings((prev) => ({ ...prev, timezone: e.target.value }))
                            }}
                            label="Timezone"
                          >
                            {timezones.map((tz) => (
                              <MenuItem key={tz.value} value={tz.value}>
                                {tz.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Alert severity="info" icon={<People />}>
                      <AlertTitle>Campaign Schedule</AlertTitle>
                      {csvData.length > 0 ? (
                        <>
                          With {csvData.length} contacts, sending {dailyLimit} messages daily at{" "}
                          {hourOptions.find((h) => h.value === scheduleSettings.hour)?.label} (
                          {timezones.find((tz) => tz.value === scheduleSettings.timezone)?.label}), it will take
                          approximately {Math.ceil(csvData.length / dailyLimit)} day(s) to complete the campaign.
                        </>
                      ) : (
                        "Upload CSV file first to see campaign duration estimate."
                      )}
                    </Alert>

                    <Alert severity="warning" icon={<Schedule />}>
                      <AlertTitle>Important Notes</AlertTitle>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        <li>Messages will be sent at the specified time each day</li>
                        <li>Time selection is limited to full hours only (no minutes)</li>
                        <li>Campaign will automatically pause on weekends (optional feature)</li>
                        <li>You can modify the schedule after campaign starts</li>
                      </ul>
                    </Alert>
                  </Stack>
                </CardContent>
              </Card>
            )}

            {activeStep === 2 && (
              <Box>
                <MarketingImageGenerator />
                <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(3)}
                    endIcon={<ArrowForward />}
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    Continue to Templates
                  </Button>
                </Box>
              </Box>
            )}

            {activeStep === 3 && (
              <Card>
                <CardHeader
                  title={
                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                      <Message />
                      <Typography variant="h6">Select or Create Template</Typography>
                      {validateStep3() && <CheckCircle sx={{ color: "success.main" }} />}
                    </Stack>
                  }
                  subheader="Choose an existing template or create a new one"
                />
                <CardContent>
                  <Stack spacing={3}>
                    <Stack direction={isMobile ? "column" : "row"} spacing={1}>
                      <Button
                        variant={!isCreatingTemplate ? "contained" : "outlined"}
                        onClick={() => setIsCreatingTemplate(false)}
                        fullWidth={isMobile}
                      >
                        Use Existing Template
                      </Button>
                      <Button
                        variant={isCreatingTemplate ? "contained" : "outlined"}
                        onClick={() => setIsCreatingTemplate(true)}
                        fullWidth={isMobile}
                      >
                        Create New Template
                      </Button>
                    </Stack>

                    {!isCreatingTemplate ? (
                      // <>
                      //   {isLoadingTemplates ? (
                      //     <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                      //       <CircularProgress />
                      //     </Box>
                      //   ) : (
                      //     <TextField
                      //       select
                      //       label="Select Template"
                      //       value={selectedTemplate}
                      //       onChange={(e) => setSelectedTemplate(e.target.value)}
                      //       fullWidth
                      //     >
                      //       {templates.map((template) => (
                      //         <MenuItem key={template.id} value={template.id.toString()}>
                      //           {template.title}
                      //         </MenuItem>
                      //       ))}
                      //     </TextField>
                      //   )}
                      // </>
                      <>
    {/* Search and Filter Controls */}
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
<TextField
  fullWidth
  variant="outlined"
  placeholder="Search templates..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    ),
    endAdornment: searchTerm && (
      <InputAdornment position="end">
        <IconButton
          size="small"
          onClick={() => setSearchTerm("")}
          edge="end"
        >
          <ClearIcon />
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StarIcon sx={{ color: showFavoritesOnly ? '#FFD700' : 'inherit' }} />
                <Typography variant="body2">
                  Show Favorites Only
                </Typography>
              </Box>
            }
          />
        </Grid>
      </Grid>
    </Box>

    {isLoadingTemplates ? (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    ) : (
      <>
        <TextField
          select
          label="Select Template"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {filteredTemplates.length === 0 ? (
            <MenuItem disabled value="">
              {searchTerm 
                ? "No templates match your search" 
                : showFavoritesOnly 
                  ? "No favorite templates found" 
                  : "No templates available"}
            </MenuItem>
          ) : (
            filteredTemplates.map((template) => (
              <MenuItem key={template.id} value={template.id.toString()}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleTemplateFavorite(template.id, !template.is_favorite)
                      }}
                      sx={{ ml: -1 }}
                    >
                      {template.is_favorite ? (
                        <StarIcon sx={{ color: '#FFD700' }} />
                      ) : (
                        <StarBorderIcon />
                      )}
                    </IconButton>
                    <Typography>{template.title}</Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={template.lang.toUpperCase()}
                    variant="outlined"
                  />
                </Box>
              </MenuItem>
            ))
          )}
        </TextField>
        
        {filteredTemplates.length > 0 && (
          <Typography variant="caption" color="text.secondary">
            Showing {filteredTemplates.length} of {templates.length} templates
            {showFavoritesOnly && ` (${templates.filter(t => t.is_favorite).length} favorites)`}
          </Typography>
        )}
      </>
    )}
  </>
                    ) : (
                      <Stack spacing={3}>
                        <TextField
                          label="Template Title"
                          value={newTemplate.title}
                          onChange={(e) => setNewTemplate((prev) => ({ ...prev, title: e.target.value }))}
                          fullWidth
                          placeholder="Enter template title (e.g., Hello Template 1)"
                          helperText={`Will be formatted as: ${formatTitleForAPI(newTemplate.title || "hello_template_1")}`}
                        />

                        {/* Header Type Selection */}
                        <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
                          <Stack spacing={2}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Header Type (Optional)
                            </Typography>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={useHeaderImage}
                                  onChange={(e) => setUseHeaderImage(e.target.checked)}
                                />
                              }
                              label={useHeaderImage ? "Use Header Image" : "Use Header Text"}
                            />
                            {useHeaderImage ? (
                              <Box>
                                {/* Image Upload Section */}
                                {!newTemplate.headerImage ? (
                                  <Paper
                                    sx={{
                                      border: "2px dashed",
                                      borderColor: isImageDragOver ? "primary.main" : "grey.300",
                                      borderRadius: 2,
                                      p: 3,
                                      textAlign: "center",
                                      bgcolor: isImageDragOver ? "action.hover" : "transparent",
                                      cursor: "pointer",
                                      transition: "all 0.2s ease-in-out",
                                      "&:hover": {
                                        borderColor: "primary.main",
                                        bgcolor: "action.hover",
                                      },
                                    }}
                                    onDragOver={handleImageDragOver}
                                    onDragLeave={handleImageDragLeave}
                                    onDrop={handleImageDrop}
                                    onClick={handleImageInputClick}
                                  >
                                    {isUploadingImage ? (
                                      <>
                                        <CircularProgress sx={{ mb: 2 }} />
                                        <Typography variant="body2" color="text.secondary">
                                          Processing image...
                                        </Typography>
                                      </>
                                    ) : (
                                      <>
                                        <CloudUpload
                                          sx={{
                                            fontSize: 48,
                                            color: isImageDragOver ? "primary.main" : "grey.400",
                                            mb: 2,
                                            transition: "color 0.2s ease-in-out",
                                          }}
                                        />
                                        <input
                                          ref={imageFileInputRef}
                                          accept="image/png, image/jpeg, image/jpg, video/mp4"
                                          style={{ display: "none" }}
                                          type="file"
                                          onChange={handleImageFileUpload}
                                        />
                                        <Typography
                                          variant="h6"
                                          gutterBottom
                                          sx={{ color: isImageDragOver ? "primary.main" : "text.primary" }}
                                        >
                                          {isImageDragOver ? "Drop your image here" : "Upload Header Image"}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                          Drag & drop or click to browse
                                        </Typography>
                                        <Button
                                          variant="outlined"
                                          startIcon={<PhotoCamera />}
                                          component="span"
                                          sx={{ pointerEvents: "none" }}
                                        >
                                          Choose Image
                                        </Button>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                          JPG, JPEG, PNG, MP4 (max 16MB)
                                        </Typography>
                                      </>
                                    )}
                                  </Paper>
                                ) : (
                                  /* Image Preview */
                                  <Box>
                                    <Paper
                                      sx={{
                                        p: 2,
                                        border: "1px solid",
                                        borderColor: "success.main",
                                        borderRadius: 2,
                                      }}
                                    >
                                      <Stack direction="row" spacing={2} alignItems="center">
                                        <Box
                                          sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 1,
                                            overflow: "hidden",
                                            border: "1px solid",
                                            borderColor: "divider",
                                          }}
                                        >
                                          <img
                                            src={newTemplate.headerImagePreview || "/placeholder.svg"}
                                            alt="Header preview"
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              objectFit: "cover",
                                            }}
                                          />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                          <Typography variant="body2" fontWeight="bold">
                                            {newTemplate.headerImage?.name}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            {newTemplate.headerImage &&
                                              (newTemplate.headerImage.size / 1024).toFixed(2)}{" "}
                                            KB
                                          </Typography>
                                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                            
                                            <Button
                                              size="small"
                                              variant="outlined"
                                              color="error"
                                              startIcon={<DeleteIcon />}
                                              onClick={handleRemoveImage}
                                            >
                                              Remove
                                            </Button>
                                          </Stack>
                                        </Box>
                                      </Stack>
                                    </Paper>
                                  </Box>
                                )}
                              </Box>
                            ) : (
                              <TextField
                                value={newTemplate.header}
                                onChange={(e) => setNewTemplate((prev) => ({ ...prev, header: e.target.value }))}
                                placeholder="{{customerName}}, welcome to our store!"
                                fullWidth
                                helperText="Use {{customerName}} for personalization"
                                label="Header Text"
                              />
                            )}
                          </Stack>
                        </Paper>

                        {/* Body Section */}
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                            Body *
                          </Typography>
                          <TextField
                            value={newTemplate.body}
                            onChange={(e) => setNewTemplate((prev) => ({ ...prev, body: e.target.value }))}
                            placeholder="We offer 25% off EVERYTHING on our website until 8PM! Simply enter YAY25 at checkout 😍"
                            multiline
                            rows={4}
                            fullWidth
                            helperText={
                              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <span>• Use {"{{customerName}}"} for personalization</span>
                                <span>{newTemplate.body?.length || 0}/1024</span>
                              </Box>
                            }
                          />
                        </Box>

                        {/* Footer Section */}
                        <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
                          <Stack spacing={2}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Footer (Optional)
                            </Typography>
                            <TextField
                              value={newTemplate.footer}
                              onChange={(e) => setNewTemplate((prev) => ({ ...prev, footer: e.target.value }))}
                              placeholder="Thank you for choosing us!"
                              fullWidth
                              helperText={`${newTemplate.footer?.length || 0}/60`}
                            />
                          </Stack>
                        </Paper>


                        {/* Button Section */}
<Paper sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
  <Stack spacing={2}>
    <Typography variant="subtitle1" fontWeight="bold">
      Call to Action Buttons
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Add up to 3 buttons. Buttons will be displayed in the order shown below.
    </Typography>
    
    {/* Button 1: Website CTA */}
    <Box>
      <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
        Button 1: Website Link
      </Typography>
      <TextField
        label="Button Text"
        value={newTemplate.btn || ''}
        onChange={(e) => setNewTemplate((prev) => ({ ...prev, btn: e.target.value }))}
        placeholder="Visit Website"
        fullWidth
        error={newTemplate.btn ? newTemplate.btn.length > MAX_BUTTON_TEXT_LENGTH : false}
        helperText={`${newTemplate.btn?.length || 0}/${MAX_BUTTON_TEXT_LENGTH}`}
        InputProps={{
          sx: {
            borderColor: newTemplate.btn && newTemplate.btn.length > MAX_BUTTON_TEXT_LENGTH ? 'error.main' : undefined,
            '&.Mui-focused fieldset': {
              borderColor: newTemplate.btn && newTemplate.btn.length > MAX_BUTTON_TEXT_LENGTH ? 'error.main' : undefined,
            }
          }
        }}
      />
      {newTemplate.btn && (
        <TextField
          label="Website URL"
          value={newTemplate.btnUrl || ''}
          onChange={(e) => setNewTemplate((prev) => ({ ...prev, btnUrl: e.target.value }))}
          placeholder="https://example.com"
          fullWidth
          margin="normal"
          required
          helperText="Required when button text is provided"
          error={!!newTemplate.btn && !newTemplate.btnUrl}
        />
      )}
    </Box>

    {/* Button 2: Contact Number */}
    <Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
        Button 2: Contact Number
      </Typography>
      <TextField
        label="Button Text"
        value={newTemplate.btn2 || ''}
        onChange={(e) => setNewTemplate((prev) => ({ ...prev, btn2: e.target.value }))}
        placeholder="Call Now"
        fullWidth
        error={newTemplate.btn2 ? newTemplate.btn2.length > MAX_BUTTON_TEXT_LENGTH : false}
        helperText={`${newTemplate.btn2?.length || 0}/${MAX_BUTTON_TEXT_LENGTH}`}
        InputProps={{
          sx: {
            borderColor: newTemplate.btn2 && newTemplate.btn2.length > MAX_BUTTON_TEXT_LENGTH ? 'error.main' : undefined,
            '&.Mui-focused fieldset': {
              borderColor: newTemplate.btn2 && newTemplate.btn2.length > MAX_BUTTON_TEXT_LENGTH ? 'error.main' : undefined,
            }
          }
        }}
      />
      {newTemplate.btn2 && (
        <TextField
          label="Phone Number (with country code)"
          value={newTemplate.btn2Url || ''}
          onChange={(e) => setNewTemplate((prev) => ({ ...prev, btn2Url: e.target.value }))}
          placeholder="tel:+1234567890"
          fullWidth
          margin="normal"
          required
          helperText="Required when button text is provided. Format: tel:+1234567890"
          error={!!newTemplate.btn2 && !newTemplate.btn2Url}
        />
      )}
    </Box>

    {/* Button 3: Quick Reply */}
    <Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
        Button 3: Quick Reply
      </Typography>
      <TextField
        label="Button Text"
        value={newTemplate.btn3 || ''}
        onChange={(e) => setNewTemplate((prev) => ({ ...prev, btn3: e.target.value }))}
        placeholder="Yes, I'm interested!"
        fullWidth
        error={newTemplate.btn3 ? newTemplate.btn3.length > MAX_BUTTON_TEXT_LENGTH : false}
        helperText={`${newTemplate.btn3?.length || 0}/${MAX_BUTTON_TEXT_LENGTH}`}
        InputProps={{
          sx: {
            borderColor: newTemplate.btn3 && newTemplate.btn3.length > MAX_BUTTON_TEXT_LENGTH ? 'error.main' : undefined,
            '&.Mui-focused fieldset': {
              borderColor: newTemplate.btn3 && newTemplate.btn3.length > MAX_BUTTON_TEXT_LENGTH ? 'error.main' : undefined,
            }
          }
        }}
      />
    </Box>

    {/* Button count indicator */}
    <Alert severity="info" icon={<Info />} sx={{ mt: 1 }}>
      <AlertTitle>Button Rules</AlertTitle>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        <li>Button 1: Website link - Opens external URL</li>
        <li>Button 2: Contact number - Initiates phone call</li>
        <li>Button 3: Quick reply - Sends predefined message</li>
        <li>Each button text max {MAX_BUTTON_TEXT_LENGTH} characters</li>
        <li>URL/Text field is required when button text is provided</li>
        <li>You can fill any combination of buttons</li>
      </ul>
    </Alert>
  </Stack>
</Paper>

                        <Button
                          variant="contained"
                          onClick={handleCreateTemplate}
                          disabled={!newTemplate.title || !newTemplate.body || isCreatingTemplateAPI}
                          fullWidth={isMobile}
                          startIcon={isCreatingTemplateAPI ? <CircularProgress size={20} /> : undefined}
                        >
                          {isCreatingTemplateAPI ? "Creating Template..." : "Create Template"}
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Preview */}
            {activeStep === 4 && (
              <Card>
                <CardHeader
                  title={
                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                      <Send />
                      <Typography variant="h6">Campaign Preview & Launch</Typography>
                    </Stack>
                  }
                />
                <CardContent>
                  <Stack spacing={3}>
                    {/* Validation Status */}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Campaign Validation:
                      </Typography>
                      <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {validateStep1() ? (
                            <CheckCircle sx={{ color: "success.main" }} />
                          ) : (
                            <ErrorIcon sx={{ color: "error.main" }} />
                          )}
                          <Typography color={validateStep1() ? "success.main" : "error.main"} variant="body2">
                            CSV File:{" "}
                            {validateStep1() ? `${csvData.length} contacts loaded` : "No valid CSV/Excel file uploaded"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {validateStep2() ? (
                            <CheckCircle sx={{ color: "success.main" }} />
                          ) : (
                            <ErrorIcon sx={{ color: "error.main" }} />
                          )}
                          <Typography color={validateStep2() ? "success.main" : "error.main"} variant="body2">
                            Schedule:{" "}
                            {validateStep2()
                              ? `${dailyLimit} messages/day at ${hourOptions.find((h) => h.value === scheduleSettings.hour)?.label}`
                              : "Invalid schedule settings"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {validateStep3() ? (
                            <CheckCircle sx={{ color: "success.main" }} />
                          ) : (
                            <ErrorIcon sx={{ color: "error.main" }} />
                          )}
                          <Typography color={validateStep3() ? "success.main" : "error.main"} variant="body2">
                            Template: {validateStep3() ? selectedTemplateData?.title : "No template selected"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Campaign Summary */}
                    {validateAllSteps() && selectedTemplateData && (
                      <Card variant="outlined">
                        <CardHeader
                          title={
                            <Typography variant="h6" color="primary">
                              Campaign Summary
                            </Typography>
                          }
                        />
                        <CardContent>
                          <Stack spacing={1.5}>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">Template:</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {selectedTemplateData.title}
                              </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">Recipients:</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {csvData.length}
                              </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">Daily Limit:</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {dailyLimit}
                              </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">Send Time:</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {hourOptions.find((h) => h.value === scheduleSettings.hour)?.label}
                              </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">Timezone:</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {timezones.find((tz) => tz.value === scheduleSettings.timezone)?.label}
                              </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">Estimated Days:</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {Math.ceil(csvData.length / dailyLimit)}
                              </Typography>
                            </Stack>
                            <Divider sx={{ my: 1 }} />
                            <Button
                              variant="contained"
                              color="success"
                              fullWidth
                              size="large"
                              onClick={handleStartCampaign}
                              disabled={!validateAllSteps() || isStartingCampaign}
                              startIcon={isStartingCampaign ? <CircularProgress size={20} /> : <Send />}
                            >
                              {isStartingCampaign ? "Starting Campaign..." : "Start Campaign"}
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    )}

                    {!validateAllSteps() && (
                      <Alert severity="error" icon={<ErrorIcon />}>
                        <AlertTitle>Campaign Not Ready</AlertTitle>
                        Please complete all previous steps before starting the campaign. Use the navigation above to go
                        back and complete missing steps.
                      </Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {activeStep === 5 && (
              <Box>
                <Container maxWidth="lg" sx={{ py: 3 }}>
                  <Stack spacing={3}>
                    {/* Header */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                      }}
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
                  open={showModalView}
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
                                  Read
                                </Typography>
                                <Typography variant="h6">{stats.read}</Typography>
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
                                  <strong>Sent At</strong>
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
                                  <TableCell>{`${customer.sent_at == null ? "N/A" : new Date(customer.sent_at).toLocaleString()}`}</TableCell>
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
            )}
          </Grid>

          {/* WhatsApp Preview Sidebar */}

          <Grid item xs={12} lg={4}>
            <Card sx={{ position: { lg: "sticky" }, top: 24 }}>
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ color: "#25d366" }}>
                    WhatsApp Preview
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    {getLivePreviewTemplate ? "Live preview of your template" : "Select a template to see preview"}
                  </Typography>
                }
              />
              <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                <WhatsAppPreview template={getLivePreviewTemplate} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Modal Dialog */}
      <ModalDialog />
    </Box>
  )
}
