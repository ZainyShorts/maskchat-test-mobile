

"use client"

import type React from "react"

// React Imports
import { useEffect, useState, useCallback, useRef } from "react"
import { format, isToday, isYesterday } from "date-fns"
// MUI Imports
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import Chip from "@mui/material/Chip"
import TextField from "@mui/material/TextField"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import { styled } from "@mui/material/styles"
import TablePagination from "@mui/material/TablePagination"
import Switch from "@mui/material/Switch"
import AudiotrackIcon from "@mui/icons-material/Audiotrack"
import Drawer from "@mui/material/Drawer"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"
// Third-party Imports
import classnames from "classnames"
import toast from "react-hot-toast"
// API service imports
import { inboxApi } from "@/api/inboxApi"

import { AudioPlayer } from "@/components/audio_video/audio-player"
import { VideoPlayer } from "@/components/audio_video/video-player"
import { VideoModalWrapper } from "@/components/audio_video/video-modal-wrapper"
import { getBaseUrl, getWebSocketUrl } from "@/api/vars/vars"
import { ImageUploadButton } from "@/components/audio_video/image-upload-button"
import { VoiceRecordingModal } from "@/components/audio_video/voice-recording-modal"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Checkbox from "@mui/material/Checkbox"
import { useBusinessNotifications } from "@/customHooks/useBusinessNotifications"
import { formatMessageTime } from "@/utils/dateUtils"
import { useParams, useSearchParams } from "next/navigation"
import { getAllBusiness } from "@/api/business"
import { BusinessDataType } from "@/api/interface/businessInterface"
import { useStateValidator } from "react-use"


interface Customer {
  id: number
  name: string
  phone_number: string
  business: number
  admin: number
  assigned_to: number | null
  latest_message?: string
  latest_message_time?: string
  unreadCount?: number
  isOnline?: boolean
  type?: "whatsapp" | "instagram" | "telegram" | "messenger"
  allow_chatbot_reply?: boolean
  latest_message_type?: string
}

interface Message {
  id: number
  sender: "business" | "user"
  message: string
  timestamp: string
  customer: number
  status?: "sent" | "delivered" | "read" | "failed" | ""
  type?: "Text" | "Image" | "Audio" | "Video" | "Pdf" | "Xlsx" | "Csv" | "Docx" | "Template"
}

// Styled Components
const StyledBox = styled(Box)(({ theme }) => ({
  height: "100dvh",
  display: "flex",
  flexDirection: "row",
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down("md")]: {
    height: "100dvh",
    flexDirection: "column",
  },
}))


const CustomerListContainer = styled(Box)(({ theme }) => ({
  width: "350px",
  borderRight: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down("md")]: {
    width: "100%",
    borderRight: "none",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}))

const ChatContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
}))

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(12), // adjust to input bar height
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}))


const MessageBubble = styled(Box)<{ isFromCustomer: boolean }>(({ theme, isFromCustomer }) => ({
  maxWidth: "70%",
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(2),
  alignSelf: isFromCustomer ? "flex-start" : "flex-end",
  backgroundColor: isFromCustomer ? theme.palette.grey[100] : theme.palette.primary.main,
  color: isFromCustomer ? theme.palette.text.primary : theme.palette.primary.contrastText,
  wordBreak: "break-word",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "85%",
    padding: theme.spacing(0.75, 1.5),
  },
}))

const ChatInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}))

const MessageStatus = ({ status }: { status?: string }) => {
  if (!status || status === "") {
    return <i className="ml-1 text-xs tabler-check text-gray-500" />
  }

  if (status === "failed") {
    return <i className="ml-1 text-xs tabler-check text-red-500" />
  }

  if (status === "sent") {
    return <i className="ml-1 text-xs tabler-check text-gray-500" />
  }

  if (status === "delivered") {
    return <i className="ml-1 text-xs tabler-checks text-gray-500" />
  }

  if (status === "read") {
    return <i className="ml-1 text-xs tabler-checks text-green-500" />
  }

  return null
}



export default function InboxPage({
  params,
}: {
  params: { business_id: string }
}) {
  const businessId = params.business_id

  console.log('businessId', businessId)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [customersLoading, setCustomersLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canSend, setCanSend] = useState(true)
  const [switchingCustomer, setSwitchingCustomer] = useState(false)
  const [isInitialMessageLoad, setIsInitialMessageLoad] = useState(false)
  const [imageModal, setImageModal] = useState<{ open: boolean; src: string | null }>({
    open: false,
    src: null,
  })


  const [businessSocket, setBusinessSocket] = useState<WebSocket | null>(null)



  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)

  // Polling state variables
  const [lastMessages, setLastMessages] = useState<Map<number, string>>(new Map())

  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedMessageIds, setSelectedMessageIds] = useState<number[]>([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteAllConfirmOpen, setDeleteAllConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [business, setBusiness] = useState()
  const currentPageRef = useRef<number>(0)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<WebSocket | null>(null)

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [wsConnectionStatus, setWsConnectionStatus] = useState<"connected" | "disconnected" | "connecting">(
    "disconnected",
  )
  const [wsRetryCount, setWsRetryCount] = useState(0)
  const MAX_RETRIES = 5
  const wsReconnectInterval = useRef<NodeJS.Timeout | null>(null)



  // const {
  //   notifications,
  //   connectionStatus,
  //   markAsRead,
  //   clearNotifications,
  //   unreadCount
  // } = useBusinessNotifications(businessId)

  useEffect(() => {
    console.log("InboxPage khadeeja");
    currentPageRef.current = page
  }, [page])

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString)

    if (isToday(date)) return "Today"
    if (isYesterday(date)) return "Yesterday"
    return format(date, "dd MMM yyyy")
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; items: Message[] }[] = []
    let lastDate = ""

    messages.forEach((msg) => {
      const dateLabel = getDateLabel(msg.timestamp)

      if (dateLabel !== lastDate) {
        groups.push({ date: dateLabel, items: [msg] })
        lastDate = dateLabel
      } else {
        groups[groups.length - 1].items.push(msg)
      }
    })

    return groups
  }

  const fetchCustomers = useCallback(
    async (pageNum = 0, search = "") => {
      try {
        setCustomersLoading(true)
        setError(null)

        const apiPage = pageNum + 1
        const response = await inboxApi.getCustomers(apiPage, rowsPerPage, search)
        console.log("customers response", response.results)

        const transformedCustomers: Customer[] = response.results.map((customer) => ({
          ...customer,
          unreadCount: 0,
          isOnline: Math.random() > 0.5,
        }))

        setCustomers(transformedCustomers)
        setTotalCustomers(response.count)
        setHasNextPage(!!response.next)
        setHasPreviousPage(!!response.previous)

        console.log("[v0] Customers loaded successfully:", transformedCustomers)
      } catch (err) {
        console.error("[v0] Error fetching customers:", err)
        setError(err instanceof Error ? err.message : "Failed to load customers")
      } finally {
        setCustomersLoading(false)
      }
    },
    [rowsPerPage],
  )

  const fetchMessages = useCallback(async (customerId: number) => {
    try {
      setMessagesLoading(true)
      setError(null)
      const response: any = await inboxApi.getMessages(customerId)
      setMessages(response || [])
      console.log("[v0] Messages loaded successfully:", response)
    } catch (err) {
      console.error("[v0] Error fetching messages:", err)
      setError(err instanceof Error ? err.message : "Failed to load messages")
    } finally {
      setMessagesLoading(false)
    }
  }, [])

  const handleToggleChatbot = async (customer: Customer) => {
    const newValue = !customer.allow_chatbot_reply

    // Optimistic update
    setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, allow_chatbot_reply: newValue } : c)))

    try {
      await inboxApi.toggleChatbotReply(customer.id)
    } catch (err) {
      console.error("Toggle error:", err)

      // rollback on error
      setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, allow_chatbot_reply: !newValue } : c)))
    }
  }

  const sendMessageToCustomer = useCallback(
    async (
      customerId: number,
      message: string,
      messageType: "Image" | "Audio" | "Text" | "Video" | "Pdf" | "Xlsx" | "Csv" | "Docx",
      images?: File[],
    ) => {
      const tempId = Date.now()
      try {
        console.log("sendMessageToCustomer images", images, messageType)
        setSendingMessage(true)
        setError(null)

        // Create optimistic message with temporary ID
        const optimisticMessage: Message = {
          id: tempId,
          sender: "business" as const,
          message: message.trim(),
          timestamp: new Date().toISOString(),
          customer: customerId,
          status: "sent",
          type: messageType,
        }

        let response: any

        if (images && images.length > 0) {
          const formData = new FormData()
          formData.append("customer", customerId.toString())
          formData.append("sender", "business")
          formData.append("type", messageType)
          if (messageType == "Image") formData.append("message", "📷 Image")
          if (messageType == "Video") formData.append("message", "🎥 Video")
          if (messageType == "Audio") formData.append("message", "🎤 Audio")
          if (messageType == "Pdf") formData.append("message", "📄 PDF")
          if (messageType == "Docx") formData.append("message", "📝 Document")
          if (messageType == "Xlsx") formData.append("message", "📊 Spreadsheet")
          if (messageType == "Csv") formData.append("message", "📑 CSV File")

          // Append all images
          images.forEach((image, index) => {
            formData.append(`file`, image)
          })

          // Append message if text is provided
          console.log("formData", formData)
          const apiResponse = await fetch(`${getBaseUrl()}inbox/messages/`, {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("auth_token")}`,
              // Do NOT set Content-Type header when using FormData
            },
            body: formData,
          })

          if (!apiResponse.ok) {
            throw new Error(`Failed to send image: ${apiResponse.statusText}`)
          }

          response = await apiResponse.json()
        } else {
          response = await inboxApi.sendMessage(customerId, message.trim())
        }

        setSelectedImages([])

        console.log("[v0] Message sent successfully")
        return response
      } catch (err) {
        console.error("[v0] Error sending message:", err)
        setError(err instanceof Error ? err.message : "Failed to send message")

        // Remove optimistic message on error
        // setMessages((prev) => prev.filter((msg) => msg.id !== tempId))
        throw err
      } finally {
        setSendingMessage(false)
      }
    },
    [],
  )

  useEffect(() => {
    fetchCustomers(page, searchQuery)
  }, [fetchCustomers, page])

  const {
    notifications,
    connectionStatus,
    markAsRead,
    clearNotifications,
    unreadCount
  } = useBusinessNotifications(businessId)


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(0)
      fetchCustomers(0, searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, fetchCustomers])

  const paginatedCustomers = customers

  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollToBottom(isInitialMessageLoad)
      if (isInitialMessageLoad) {
        setIsInitialMessageLoad(false)
      }
    }
  }, [messages, isInitialMessageLoad])

  const scrollToBottom = (withAnimation = false) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: withAnimation ? "smooth" : "auto",
    })
  }

  const handleCustomerSelect = useCallback(
    async (customer: Customer) => {
      if (switchingCustomer) return

      if (isMobile) {
        setMobileDrawerOpen(false)
      }

      // Reset WebSocket state
      if (socketRef.current) {
        socketRef.current.close(1000, "Switching customer")
        socketRef.current = null
      }

      // Clear any pending reconnect attempts
      if (wsReconnectInterval.current) {
        clearTimeout(wsReconnectInterval.current)
        wsReconnectInterval.current = null
      }

      setWsRetryCount(0)
      setWsConnectionStatus("disconnected")

      // Rest of your existing code...
      setSwitchingCustomer(true)
      setSelectedCustomer(customer)
      setMessages([])
      setIsInitialMessageLoad(true)

      try {
        const response: any = await inboxApi.getMessages(customer.id)
        setMessages(response || [])

        if (response && response.length > 0) {
          const latestMessage = response[0]
          setLastMessages((prev) => new Map(prev).set(customer.id, latestMessage.message))
        }

        if (response && response.length > 0) {
          const lastUserMsg = response.find((msg: Message) => msg.sender === "user")
          if (lastUserMsg) {
            const lastUserTime = new Date(lastUserMsg.timestamp).getTime()
            const now = new Date().getTime()
            const hoursDiff = (now - lastUserTime) / (1000 * 60 * 60)
            setCanSend(hoursDiff <= 24)
          } else {
            setCanSend(false)
          }
        } else {
          setCanSend(false)
        }

        setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, unreadCount: 0 } : c)))
      } catch (error) {
        console.error("[v0] Error loading messages for customer:", customer.id, error)
        setError("Failed to load messages for this customer")
      } finally {
        setSwitchingCustomer(false)
      }
    },
    [switchingCustomer, isMobile],
  )

  useEffect(() => {
    if (!selectedCustomer) return

    const token = localStorage.getItem("auth_token")
    if (!token) {
      console.log("[WS] No auth token found")
      return
    }

    // Function to establish WebSocket connection
    const connectWebSocket = () => {
      // Close previous socket if exists
      if (socketRef.current) {
        socketRef.current.close(1000, "Reconnecting")
        socketRef.current = null
      }
      const wsUrl = `${getWebSocketUrl()}/ws/chat/${selectedCustomer.id}/`

      console.log("[WS] Connecting:", wsUrl)
      setWsConnectionStatus("connecting")

      const socket = new WebSocket(wsUrl, ["token", token])
      socketRef.current = socket

      socket.onopen = () => {
        console.log("[WS] Connected for customer:", selectedCustomer.id)
        setWsConnectionStatus("connected")
        setWsRetryCount(0) // Reset retry count on successful connection

        // Clear any reconnect intervals
        if (wsReconnectInterval.current) {
          clearTimeout(wsReconnectInterval.current)
          wsReconnectInterval.current = null
        }
      }

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          console.log("[WS] Message:", payload)

          // Handle new message

          const incoming = payload.data

          if (payload.type != 'status' && payload.type != 'delete_inbox_message') {

            setMessages((prev) => {
              if (prev.some((m) => m.id === incoming.id)) return prev

              return [
                ...prev,
                {
                  id: incoming.id,
                  sender: incoming.sender,
                  message: incoming.message,
                  timestamp: new Date().toISOString(),
                  customer: selectedCustomer.id,
                  type: payload.type || "Text",
                  status: incoming.status || "",
                },
              ]
            })

            setTimeout(scrollToBottom, 50)
          } else if (payload.type == 'status') {
            console.log('elif condition', payload.type)
            console.log('incoming.id', incoming.id)
            console.log('incoming.message', incoming.message)
            setMessages((prev) =>
              prev.map((msg) => (msg.id === payload.data.id ? { ...msg, status: payload.data.message } : msg)),
            )
          } else if (payload.type === 'delete_inbox_message') {
            console.log('elif delete_multiple', payload.type)
            console.log('ids list', incoming.message)

            const idsToDelete = incoming.message // array of message IDs

            setMessages((prev) =>
              prev.filter((msg) => !idsToDelete.includes(msg.id))
            )
          }
        } catch (err) {
          console.error("[WS] Parse error:", err)
        }
      }

      socket.onerror = (err) => {
        console.error("[WS] Error:", err)
        setWsConnectionStatus("disconnected")
      }

      socket.onclose = (event) => {
        console.log("[WS] Closed:", event.code, event.reason)
        setWsConnectionStatus("disconnected")

        // Auto-reconnect only if not manually closed and under retry limit
        if (event.code !== 1000 && wsRetryCount < MAX_RETRIES) {
          const delay = Math.min(1000 * Math.pow(2, wsRetryCount), 10000) // Exponential backoff
          console.log(`[WS] Reconnecting in ${delay}ms... (Attempt ${wsRetryCount + 1}/${MAX_RETRIES})`)

          wsReconnectInterval.current = setTimeout(() => {
            setWsRetryCount((prev) => prev + 1)
            connectWebSocket()
          }, delay)
        } else if (wsRetryCount >= MAX_RETRIES) {
          console.error("[WS] Max reconnection attempts reached")
          setError("Connection lost. Please refresh the page or select the customer again.")
        }
      }
    }

    // Initial connection
    connectWebSocket()

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmount")
        socketRef.current = null
      }

      if (wsReconnectInterval.current) {
        clearTimeout(wsReconnectInterval.current)
        wsReconnectInterval.current = null
      }

      setWsConnectionStatus("disconnected")
      setWsRetryCount(0)
    }
  }, [selectedCustomer])


  // Add a useEffect to monitor WebSocket status and show UI feedback
  useEffect(() => {
    if (wsConnectionStatus === "disconnected" && selectedCustomer) {
      console.log("[WS] Connection lost for customer:", selectedCustomer.id)
    }
  }, [wsConnectionStatus, selectedCustomer])

  const handleSendMessage = useCallback(async () => {
    if (!selectedCustomer || sendingMessage) return

    if (!newMessage.trim() && selectedImages.length === 0) return
    console.log("selectedImages", selectedImages)

    let messageType: "Text" | "Image" | "Audio" | "Video" | "Pdf" | "Xlsx" | "Csv" | "Docx" | "Template" = "Text" // default type

    // Determine type based on selectedImages
    if (selectedImages.length > 0) {
      const file: any = selectedImages[0] // take first file for type check
      console.log("file", file)
      const ext = file.name.split(".").pop().toLowerCase()
      console.log("ext", ext)
      if (ext === "mp4") {
        messageType = "Video"
      } else if (["jpg", "jpeg", "png"].includes(ext)) {
        messageType = "Image"
      } else if (["mp3"].includes(ext)) {
        messageType = "Audio"
      } else if (["ogg"].includes(ext)) {
        messageType = "Audio"
      } else if (["wav"].includes(ext)) {
        messageType = "Audio"
      } else if (["pdf"].includes(ext)) {
        messageType = "Pdf"
      } else if (["xlsx"].includes(ext)) {
        messageType = "Xlsx"
      } else if (["csv"].includes(ext)) {
        messageType = "Csv"
      } else if (["docx"].includes(ext)) {
        messageType = "Docx"
      }
    }

    console.log("Selected Images:", selectedImages, "Message Type:", messageType)

    try {
      await sendMessageToCustomer(
        selectedCustomer.id,
        newMessage.trim(),
        messageType,
        selectedImages.length > 0 ? selectedImages : undefined,
      )
      setNewMessage("")
    } catch (err) {
      // Error is already handled in sendMessageToCustomer
    }
  }, [newMessage, selectedCustomer, sendingMessage, sendMessageToCustomer, selectedImages])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage],
  )

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage)
  }, [])

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRowsPerPage = Number.parseInt(event.target.value, 10)
      setRowsPerPage(newRowsPerPage)
      setPage(0)
      fetchCustomers(0, searchQuery)
    },
    [fetchCustomers, searchQuery],
  )

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  
  const handleSendVoiceMessage = useCallback(
    async (audioFile: File) => {
      if (!selectedCustomer || sendingMessage) return

      try {
        await sendMessageToCustomer(selectedCustomer.id, "", "Audio", [audioFile])
        setVoiceModalOpen(false)
      } catch (err) {
        console.error("[v0] Error sending voice message:", err)
      }
    },
    [selectedCustomer, sendingMessage, sendMessageToCustomer],
  )

  function capitalizeFirstMessage(message: string | undefined) {
    if (!message || typeof message !== "string") return ""
    return message.charAt(0).toUpperCase() + message.slice(1)
  }

  const handleFileClick = async (messageId: number, fileName: string) => {
    try {
      const res = await inboxApi.getPresignedUrl(messageId)

      if (!res.success) {
        alert("Unable to fetch file URL.")
        return
      }

      const a = document.createElement("a")
      a.href = res.presigned_url // presigned URL from server
      a.download = fileName || "file"
      a.target = "_blank"
      a.click()
    } catch (err) {
      console.error("Error downloading file:", err)
      alert("Download failed.")
    }
  }

  const handleDeleteSelectedMessages = async () => {
    if (selectedMessageIds.length === 0) return

    try {
      setDeleting(true)
      await inboxApi.deleteMultipleMessages(selectedMessageIds)

      // Refresh messages after deletion
      // if (selectedCustomer) {
      //   await fetchMessages(selectedCustomer.id)
      // }

      // Reset selection
      setSelectedMessageIds([])
      setSelectionMode(false)
      setDeleteConfirmOpen(false)
    } catch (err) {
      console.error("[v0] Error deleting messages:", err)
      setError(err instanceof Error ? err.message : "Failed to delete messages")
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteAllMessages = async () => {
    if (!selectedCustomer) return

    try {
      setDeleting(true)
      await inboxApi.deleteAllMessages(selectedCustomer.id)

      // Refresh messages after deletion
      await fetchMessages(selectedCustomer.id)

      setDeleteAllConfirmOpen(false)
    } catch (err) {
      console.error("[v0] Error deleting all messages:", err)
      setError(err instanceof Error ? err.message : "Failed to delete all messages")
    } finally {
      setDeleting(false)
    }
  }

  const toggleMessageSelection = (messageId: number) => {
    setSelectedMessageIds((prev) =>
      prev.includes(messageId) ? prev.filter((id) => id !== messageId) : [...prev, messageId],
    )
  }

  const selectAllMessages = () => {
    if (selectedMessageIds.length === messages.length) {
      setSelectedMessageIds([])
    } else {
      setSelectedMessageIds(messages.map((msg) => msg.id))
    }
  }



  const CustomerListContent = () => (
    <>
      {/* Search Header */}
      <Box className="p-4 border-b">
        <TextField
          fullWidth
          size="small"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <i className="tabler-search" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Customer List */}
      <Box className="flex-1 overflow-y-auto">
        {customersLoading ? (
          <Box className="flex justify-center items-center h-32">
            <CircularProgress />
          </Box>
        ) : paginatedCustomers.length === 0 ? (
          <Box className="flex flex-col items-center justify-center h-32 p-4">
            <Typography variant="body2" color="text.secondary" className="text-center">
              {searchQuery ? `No customers found matching "${searchQuery}"` : "No customers found"}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {paginatedCustomers.map((customer) => {
              const getTypeColor = (type?: string) => {
                switch (type?.toLowerCase()) {
                  case "whatsapp":
                    return "success"
                  case "instagram":
                    return "error"
                  case "messenger":
                    return "primary"
                  case "telegram":
                    return "info"
                  default:
                    return "default"
                }
              }

              return (
                <ListItem key={customer.id} disablePadding>
                  <ListItemButton
                    selected={selectedCustomer?.id === customer.id}
                    onClick={() => handleCustomerSelect(customer)}
                    className="px-4 py-3"
                  >
                    <ListItemAvatar>
                      <Avatar>{customer.name?.charAt(0) || "?"}</Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Box className="flex items-center justify-between w-full">
                          {/* LEFT: Name */}
                          <Typography variant="subtitle2" className="font-medium truncate">
                            {customer.name || "Unknown Customer"}
                          </Typography>

                          {/* RIGHT: Time + Switch */}
                          {customer.latest_message_time && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">
                                {formatMessageTime(customer.latest_message_time)}
                              </span>

                              <Switch
                                edge="end"
                                checked={customer.allow_chatbot_reply}
                                onChange={() => handleToggleChatbot(customer)}
                              />
                            </div>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box className="flex items-center justify-between mt-1">
                          <Typography variant="body2" color="text.secondary" className="truncate flex-1 mr-2">
                            {(() => {
                              const type = customer.latest_message_type?.toLowerCase()
                              const msg = customer.latest_message || ""
                              console.log('customer.latest_message', type)
                              switch (type) {
                                case "image":
                                  return "📷 Image"
                                case "video":
                                  return "🎥 Video"
                                case "audio":
                                  return "🔊 Audio"
                                case "pdf":
                                  return "📄 PDF"
                                case "docx":
                                  return "📝 DOCX"
                                case "xlsx":
                                  return "📊 XLSX"
                                case "csv":
                                  return "📁 CSV"
                                case "template":
                                  return "📋 Template"
                                case "text":
                                  return `💬 ${capitalizeFirstMessage(msg)}`
                                default:
                                  return "No messages yet"
                              }
                            })()}
                          </Typography>

                          {customer.type && (
                            <Chip
                              label={customer.type}
                              size="small"
                              color={getTypeColor(customer.type)}
                              className="ml-2"
                            />
                          )}

                          {(customer.unreadCount ?? 0) > 0 && (
                            <Chip
                              label={customer.unreadCount}
                              size="small"
                              color="secondary"
                              className="min-w-[20px] h-5 ml-2"
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        )}
      </Box>

      <Box className="border-t p-0">
        <TablePagination
          component="div"
          count={totalCustomers}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Per page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`}
        />
      </Box>
    </>
  )


  // Function to connect to business notifications WebSocket
  const connectToBusinessNotifications = useCallback(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      console.log("[Business WS] No auth token found")
      return null
    }

    // const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"

    const wsUrl = `${getWebSocketUrl()}/ws/business/${businessId}/notifications/`

    console.log("[Business WS] Connecting:", wsUrl)

    const socket = new WebSocket(wsUrl, ["token", token])

    socket.onopen = () => {
      console.log("[Business WS] Connected for business:", businessId)
      // Optionally send initial ping or subscription
      // socket.send(JSON.stringify({ type: 'subscribe', events: ['NEW_CUSTOMER'] }))
    }

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        console.log("[Business WS] Notification received:", payload)

        // Handle different notification types
        if (payload.type === 'NEW_CUSTOMER') {
          const customerData = payload.data

          // Add to notifications list
          setCustomers(prev => [customerData, ...prev])

          // Show toast notification
          toast.success(`New customer: ${customerData.name}`, {
            duration: 5000,
            position: 'top-right'
          })

        } else if (payload.type === 'allow_chatbot_reply') {
          const payloadData = payload.data


          setCustomers((prev) =>
            prev.map((cus) => (cus.id === payloadData['customer_id'] ? { ...cus, allow_chatbot_reply: payloadData['data'] } : cus)),
          )
        }
        else if (payload.type === 'SIDE_MSG') {
          const payloadData = payload.data

          setCustomers((prev) => {
            // find the customer
            const updatedCustomer = prev.find(
              (cus) => cus.id === payloadData.customer_id
            )

            if (!updatedCustomer) return prev

            console.log('latest_message_time', payloadData)
            // update customer fields
            const newCustomer = {
              ...updatedCustomer,
              latest_message: payloadData.latest_message,
              latest_message_type: payloadData.latest_message_type,
              latest_message_time: payloadData.latest_message_time,
            }

            // remove old entry & move updated one to top
            return [
              newCustomer,
              ...prev.filter((cus) => cus.id !== payloadData.customer_id),
            ]
          })
        }


      } catch (err) {
        console.error("[Business WS] Parse error:", err)
      }
    }

    socket.onerror = (err) => {
      console.error("[Business WS] Error:", err)
    }

    socket.onclose = (event) => {
      console.log("[Business WS] Closed:", event.code, event.reason)

      // Auto-reconnect after 5 seconds
      setTimeout(() => {
        console.log("[Business WS] Reconnecting...")
        connectToBusinessNotifications()
      }, 5000)
    }

    return socket
  }, [businessId])

  // Connect to business notifications on component mount
  useEffect(() => {
    const socket = connectToBusinessNotifications()
    setBusinessSocket(socket)

    return () => {
      if (socket) {
        socket.close(1000, "Component unmount")
      }
    }
  }, [connectToBusinessNotifications])


  // Template Message Component
  const TemplateMessageBox = styled(Box)(({ theme }) => ({
    backgroundColor: '#f8f9fa',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: theme.spacing(2),
    maxWidth: '300px',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: theme.spacing(1.5),
      left: theme.spacing(-1),
      width: '0',
      height: '0',
      borderTop: '8px solid transparent',
      borderBottom: '8px solid transparent',
      borderRight: '8px solid #e0e0e0',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: theme.spacing(1.5),
      left: theme.spacing(-0.9),
      width: '0',
      height: '0',
      borderTop: '8px solid transparent',
      borderBottom: '8px solid transparent',
      borderRight: '8px solid #f8f9fa',
    },
  }));

  const TemplateHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: '#6c757d',
    fontWeight: 500,
  }));

  const TemplateContent = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    border: '1px solid #dee2e6',
    borderRadius: '6px',
    padding: theme.spacing(1.5),
    fontFamily: '"Segoe UI", Roboto, sans-serif',
    fontSize: '14px',
    lineHeight: '1.5',
  }));


  return (
    <>
      {imageModal.open && (
        <Box
          onClick={() => setImageModal({ open: false, src: null })}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50 cursor-pointer"
        >
          <img
            src={imageModal.src! || "/placeholder.svg"}
            alt="Full view"
            className="max-h-[80vh] max-w-[90vw] sm:max-w-[70vw] rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </Box>
      )}

      <VoiceRecordingModal
        open={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSend={handleSendVoiceMessage}
        isLoading={sendingMessage}
      />

      <Card>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} className="m-4">
            {error}
          </Alert>
        )}

        <StyledBox>
          {isMobile ? (
            <>
              <Drawer
                anchor="left"
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
                sx={{
                  "& .MuiDrawer-paper": {
                    width: "85%",
                    maxWidth: "350px",
                  },
                }}
              >
                <CustomerListContainer>
                  <CustomerListContent />
                </CustomerListContainer>
              </Drawer>

              {/* Chat Area for Mobile */}
              <ChatContainer>
                {selectedCustomer ? (
                  <>
                    {/* Chat Header */}
                    <Box className="p-3 sm:p-4 border-b bg-background-paper">
                      <Box className="flex items-center gap-2 sm:gap-3">
                        <IconButton onClick={() => setMobileDrawerOpen(true)} size="small">
                          <i className="tabler-menu-2" />
                        </IconButton>

                        <Avatar sx={{ width: 32, height: 32 }}>{selectedCustomer.name.charAt(0)}</Avatar>
                        <Box className="flex-1 min-w-0">
                          <Typography variant="subtitle1" className="font-medium truncate text-sm sm:text-base">
                            {selectedCustomer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" className="truncate block">
                            {selectedCustomer.phone_number}
                          </Typography>
                        </Box>

                        {/* Selection mode controls */}
                        {selectionMode && (
                          <>
                            <Chip label={`${selectedMessageIds.length}`} color="primary" size="small" />
                            <IconButton size="small" onClick={selectAllMessages} title="Select all">
                              <i className="tabler-checkbox text-sm" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => setDeleteConfirmOpen(true)}
                              disabled={selectedMessageIds.length === 0}
                              color="error"
                              title="Delete selected"
                            >
                              <i className="tabler-trash text-sm" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectionMode(false)
                                setSelectedMessageIds([])
                              }}
                              title="Cancel"
                            >
                              <i className="tabler-x text-sm" />
                            </IconButton>
                          </>
                        )}

                        {/* Regular controls */}
                        {!selectionMode && (
                          <>
                            <IconButton size="small" onClick={() => setSelectionMode(true)} title="Select messages">
                              <i className="tabler-checkbox text-sm" />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* Chat Messages */}
                    <MessagesContainer sx={{ padding: { xs: 1, sm: 2 } }}>
                      {messagesLoading || switchingCustomer ? (
                        <Box className="flex justify-center items-center h-32">
                          <CircularProgress />
                          <Typography variant="body2" className="ml-2">
                            Loading messages...
                          </Typography>
                        </Box>
                      ) : (
                        <>
                          {messages && messages.length > 0 ? (
                            groupMessagesByDate(messages).map((group) => (
                              <Box key={group.date} className="mb-4">
                                {/* Date Separator */}
                                <Box className="flex justify-center my-4">
                                  <Box className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full">
                                    {group.date}
                                  </Box>
                                </Box>

                                {/* Messages */}
                                <Box className="flex flex-col gap-2">
                                  {group.items.map((message) => (
                                    <Box key={message.id} className="flex flex-col">
                                      <Box className="flex items-start gap-2">
                                        {selectionMode && (
                                          <Checkbox
                                            checked={selectedMessageIds.includes(message.id)}
                                            onChange={() => toggleMessageSelection(message.id)}
                                            size="small"
                                            sx={{ mt: 1 }}
                                          />
                                        )}
                                        <Box className="flex-1 flex flex-col">
                                          <MessageBubble
                                            isFromCustomer={message.sender === "user"}
                                            className={
                                              message.type === "Image" ||
                                                message.type === "Audio" ||
                                                message.type === "Video" ||
                                                message.type === "Pdf" ||
                                                message.type === "Docx" ||
                                                message.type === "Csv" ||
                                                message.type === "Xlsx"
                                                ? "bg-transparent"
                                                : ""
                                            }
                                          >
                                            {message.type === "Image" ? (
                                              <img
                                                src={message.message || "/placeholder.svg"}
                                                alt="Image"
                                                className="max-w-[200px] sm:max-w-[250px] rounded-lg cursor-pointer"
                                                onClick={() => setImageModal({ open: true, src: message.message })}
                                              />
                                            ) : message.type === "Audio" ? (
                                              <div className="max-w-full overflow-hidden">
                                                <AudioPlayer src={message.message} />
                                              </div>
                                            ) : message.type === "Video" ? (
                                              <VideoPlayer src={message.message} />
                                            ) : message.type === "Pdf" ||
                                              message.type === "Docx" ||
                                              message.type === "Xlsx" ||
                                              message.type === "Csv" ? (
                                              <div
                                                onClick={() =>
                                                  handleFileClick(message.id, `file.${message?.type?.toLowerCase()}`)
                                                }
                                                className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                                              >
                                                <Box className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center bg-transparent rounded-lg bg-blue-100 border border-blue-200">
                                                  <i className="tabler-file text-lg sm:text-xl text-white" />
                                                </Box>

                                                <Box className="flex flex-col">
                                                  <Typography className="font-semibold text-xs sm:text-sm text-white">
                                                    {message.type.toUpperCase()} File
                                                  </Typography>
                                                  <Typography className="text-xs text-white">
                                                    Tap to download
                                                  </Typography>
                                                </Box>
                                              </div>
                                            ) : message.type === "Template" ? (
                                              <TemplateMessageBox>
                                                <TemplateHeader>
                                                  {/* <i className="tabler-mail text-sm" /> */}
                                                  💬
                                                  <Typography variant="caption" sx={{ fontWeight: 1000 }}>
                                                    WhatsApp Template
                                                  </Typography>
                                                </TemplateHeader>
                                                <TemplateContent>
                                                  <Typography
                                                    variant="body2"
                                                    sx={{
                                                      whiteSpace: 'pre-line',
                                                      fontSize: '14px',
                                                      lineHeight: '1.5'
                                                    }}
                                                  >
                                                    {message.message}
                                                  </Typography>
                                                </TemplateContent>
                                              </TemplateMessageBox>
                                            ) : (
                                              <Typography
                                                className={classnames("font-bold text-sm sm:text-md", {
                                                  "text-black": message.sender === "user",
                                                  "text-white": message.sender === "business",
                                                })}
                                                sx={{ whiteSpace: "pre-line" }}
                                                variant="body2"
                                              >
                                                {message.message}
                                              </Typography>
                                            )}
                                          </MessageBubble>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            className={classnames("mt-1", {
                                              "self-start ml-2": message.sender === "user",
                                              "self-end mr-2": message.sender === "business",
                                            })}
                                          >
                                            {formatTimestamp(message.timestamp)}
                                            {message.sender === "business" && <MessageStatus status={message.status} />}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                            ))
                          ) : (
                            <Box className="flex-1 flex items-center justify-center">
                              <Box className="text-center p-4">
                                <i className="tabler-message-off text-4xl text-textSecondary mb-4" />
                                <Typography variant="h6" color="text.secondary" className="mb-2">
                                  No messages yet
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Start a conversation with this customer
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </MessagesContainer>

                    {/* Message Input */}
                    <ChatInputContainer sx={{ padding: { xs: 1, sm: 2 } }}>
                      {selectedImages.length > 0 && (
                        <Box className="mb-3 flex gap-2 flex-wrap">
                          {selectedImages.map((file, index) => {
                            const type = file.type
                            const previewURL = URL.createObjectURL(file)

                            const isImage = type === "image/jpeg" || type === "image/jpg" || type === "image/png"

                            const isAudio = type === "audio/mpeg" || type === "audio/ogg" || type === "audio/wav"

                            const isVideo = type === "video/mp4"
                            const isPDF = type === "application/pdf"
                            const isDocx =
                              type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            const isXlsx = type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            const isCsv = type === "text/csv"

                            return (
                              <Box key={index} className="relative group">
                                {isImage && (
                                  <img
                                    src={previewURL || "/placeholder.svg"}
                                    alt={`Selected ${index + 1}`}
                                    className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded border border-gray-300 dark:border-gray-600"
                                  />
                                )}
                                {isVideo && (
                                  <video
                                    src={previewURL}
                                    className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded border border-gray-300 dark:border-gray-600"
                                    muted
                                    autoPlay
                                    loop
                                  />
                                )}
                                {isAudio && (
                                  <Box className="h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                                    <AudiotrackIcon className="text-gray-700 dark:text-gray-300" />
                                  </Box>
                                )}
                                {isPDF && (
                                  <Box className="h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded border border-gray-300 bg-red-100 dark:bg-red-900 font-semibold text-red-700 dark:text-red-300 text-xs">
                                    PDF
                                  </Box>
                                )}
                                {isDocx && (
                                  <Box className="h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded border border-gray-300 bg-blue-100 dark:bg-blue-900 font-semibold text-blue-700 dark:text-blue-300 text-xs">
                                    DOCX
                                  </Box>
                                )}
                                {isXlsx && (
                                  <Box className="h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded border border-gray-300 bg-green-100 dark:bg-green-900 font-semibold text-green-700 dark:text-green-300 text-xs">
                                    XLSX
                                  </Box>
                                )}
                                {isCsv && (
                                  <Box className="h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded border border-gray-300 bg-green-100 dark:bg-green-900 font-semibold text-green-700 dark:text-green-300 text-xs">
                                    CSV
                                  </Box>
                                )}
                                <IconButton
                                  size="small"
                                  onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))}
                                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-0"
                                  style={{ width: "20px", height: "20px" }}
                                >
                                  <i className="tabler-x text-xs" />
                                </IconButton>
                              </Box>
                            )
                          })}
                        </Box>
                      )}

                      <Box className="flex items-end gap-1 sm:gap-2">
                        <ImageUploadButton
                          onImagesSelected={(files) => setSelectedImages(files)}
                          maxImages={3}
                          disabled={sendingMessage}
                          isLoading={sendingMessage}
                        />

                        <IconButton
                          size="small"
                          onClick={() => setVoiceModalOpen(true)}
                          disabled={sendingMessage}
                          sx={{
                            color: "#ef4444",
                            "&:hover": { backgroundColor: "#fee2e2" },
                          }}
                        >
                          <i className="tabler-microphone text-lg sm:text-xl" />
                        </IconButton>

                        <TextField
                          fullWidth
                          multiline
                          maxRows={4}
                          placeholder={selectedImages.length > 0 ? "Add caption (optional)..." : "Type a message..."}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          variant="outlined"
                          size="small"
                          disabled={sendingMessage || selectedImages.length > 0}
                          sx={{
                            "& .MuiInputBase-input": {
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            },
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleSendMessage}
                          disabled={(!newMessage.trim() && selectedImages.length === 0) || sendingMessage}
                          className="min-w-[40px] sm:min-w-[44px] h-[40px] sm:h-[44px]"
                          sx={{ padding: { xs: 1, sm: 1.5 } }}
                        >
                          {sendingMessage ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <i className="tabler-send" />
                          )}
                        </Button>
                      </Box>
                    </ChatInputContainer>
                  </>
                ) : (
                  <Box className="flex-1 flex items-center justify-center p-4">
                    <Box className="text-center">
                      <Button
                        variant="contained"
                        startIcon={<i className="tabler-menu-2" />}
                        onClick={() => setMobileDrawerOpen(true)}
                        className="mb-4"
                      >
                        Select a Customer
                      </Button>
                      <Typography variant="h6" color="text.secondary" className="mb-2">
                        No customer selected
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tap the button above to choose a customer
                      </Typography>
                    </Box>
                  </Box>
                )}
              </ChatContainer>
            </>
          ) : (
            <>
              <CustomerListContainer>
                <CustomerListContent />
              </CustomerListContainer>

              {/* Chat Area for Desktop */}
              <ChatContainer>
                {selectedCustomer ? (
                  <>
                    {/* Chat Header */}
                    <Box className="p-4 border-b bg-background-paper">
                      <Box className="flex items-center gap-3">
                        <Avatar>{selectedCustomer.name.charAt(0)}</Avatar>
                        <Box className="flex-1">
                          <Typography variant="h6" className="font-medium">
                            {selectedCustomer.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedCustomer.phone_number}
                          </Typography>
                        </Box>

                        {/* Selection mode controls */}
                        {selectionMode && (
                          <>
                            <Chip label={`${selectedMessageIds.length} selected`} color="primary" size="small" />
                            <IconButton onClick={selectAllMessages} title="Select all">
                              <i className="tabler-checkbox" />
                            </IconButton>
                            <IconButton
                              onClick={() => setDeleteConfirmOpen(true)}
                              disabled={selectedMessageIds.length === 0}
                              color="error"
                              title="Delete selected"
                            >
                              <i className="tabler-trash" />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setSelectionMode(false)
                                setSelectedMessageIds([])
                              }}
                              title="Cancel"
                            >
                              <i className="tabler-x" />
                            </IconButton>
                          </>
                        )}

                        {/* Regular controls */}
                        {!selectionMode && (
                          <>
                            <IconButton onClick={() => setSelectionMode(true)} title="Select messages">
                              <i className="tabler-checkbox" />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* Chat Messages */}
                    <MessagesContainer>
                      {messagesLoading || switchingCustomer ? (
                        <Box className="flex justify-center items-center h-32">
                          <CircularProgress />
                          <Typography variant="body2" className="ml-2">
                            Loading messages...
                          </Typography>
                        </Box>
                      ) : (
                        <>
                          {messages && messages.length > 0 ? (
                            groupMessagesByDate(messages).map((group) => (
                              <Box key={group.date} className="mb-4">
                                {/* Date Separator */}
                                <Box className="flex justify-center my-4">
                                  <Box className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full">
                                    {group.date}
                                  </Box>
                                </Box>

                                {/* Messages */}
                                <Box className="flex flex-col gap-2">
                                  {group.items.map((message) => (
                                    <Box key={message.id} className="flex flex-col">
                                      <Box className="flex items-start gap-2">
                                        {selectionMode && (
                                          <Checkbox
                                            checked={selectedMessageIds.includes(message.id)}
                                            onChange={() => toggleMessageSelection(message.id)}
                                            size="small"
                                            sx={{ mt: 1 }}
                                          />
                                        )}
                                        <Box className="flex-1 flex flex-col">
                                          <MessageBubble
                                            isFromCustomer={message.sender === "user"}
                                            className={
                                              message.type === "Image" ||
                                                message.type === "Audio" ||
                                                message.type === "Video" ||
                                                message.type === "Pdf" ||
                                                message.type === "Docx" ||
                                                message.type === "Csv" ||
                                                message.type === "Xlsx" ||
                                                message.type === 'Template'
                                                ? "bg-transparent"
                                                : ""
                                            }
                                          >
                                            {message.type === "Image" ? (
                                              <img
                                                src={message.message || "/placeholder.svg"}
                                                alt="Image"
                                                className="max-w-[250px] rounded-lg cursor-pointer"
                                                onClick={() => setImageModal({ open: true, src: message.message })}
                                              />
                                            ) : message.type === "Audio" ? (
                                              <div className="max-w-full overflow-hidden">
                                                <AudioPlayer src={message.message} />
                                              </div>
                                            ) : message.type === "Video" ? (
                                              <VideoPlayer src={message.message} />
                                            ) : message.type === "Pdf" ||
                                              message.type === "Docx" ||
                                              message.type === "Xlsx" ||
                                              message.type === "Csv" ? (
                                              <div
                                                onClick={() =>
                                                  handleFileClick(message.id, `file.${message?.type?.toLowerCase()}`)
                                                }
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                                              >
                                                <Box className="h-10 w-10 flex items-center justify-center bg-transparent rounded-lg bg-blue-100 border border-blue-200">
                                                  <i className="tabler-file text-xl text-white" />
                                                </Box>

                                                <Box className="flex flex-col">
                                                  <Typography className="font-semibold text-sm text-white">
                                                    {message.type.toUpperCase()} File
                                                  </Typography>
                                                  <Typography className="text-xs text-white">
                                                    Tap to download
                                                  </Typography>
                                                </Box>
                                              </div>
                                            ) : message.type === "Template" ? (<div className="whatsapp-bubble">
                                              <div className="bubble-header ">
                                                💬
                                                <span className="header-text">WhatsApp Template</span>
                                              </div>

                                              <div className="bubble-message">
                                                {message.message}
                                              </div>


                                            </div>

                                            ) : (
                                              <Typography
                                                className={classnames("font-bold text-md", {
                                                  "text-black": message.sender === "user",
                                                  "text-white": message.sender === "business",
                                                })}
                                                sx={{ whiteSpace: "pre-line" }}
                                                variant="body2"
                                              >
                                                {message.message}
                                              </Typography>
                                            )}
                                          </MessageBubble>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            className={classnames("mt-1", {
                                              "self-start ml-2": message.sender === "user",
                                              "self-end mr-2": message.sender === "business",
                                            })}
                                          >
                                            {formatTimestamp(message.timestamp)}
                                            {message.sender === "business" && <MessageStatus status={message.status} />}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                            ))
                          ) : (
                            <Box className="flex-1 flex items-center justify-center">
                              <Box className="text-center">
                                <i className="tabler-message-off text-4xl text-textSecondary mb-4" />
                                <Typography variant="h6" color="text.secondary" className="mb-2">
                                  No messages yet
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Start a conversation with this customer
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </MessagesContainer>

                    {/* Message Input */}
                    <ChatInputContainer>
                      {selectedImages.length > 0 && (
                        <Box className="mb-3 flex gap-2 flex-wrap">
                          {selectedImages.map((file, index) => {
                            const type = file.type
                            const previewURL = URL.createObjectURL(file)

                            const isImage = type === "image/jpeg" || type === "image/jpg" || type === "image/png"

                            const isAudio = type === "audio/mpeg" || type === "audio/ogg" || type === "audio/wav"

                            const isVideo = type === "video/mp4"
                            const isPDF = type === "application/pdf"
                            const isDocx =
                              type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            const isXlsx = type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            const isCsv = type === "text/csv"

                            return (
                              <Box key={index} className="relative group">
                                {isImage && (
                                  <img
                                    src={previewURL || "/placeholder.svg"}
                                    alt={`Selected ${index + 1}`}
                                    className="h-16 w-16 object-cover rounded border border-gray-300 dark:border-gray-600"
                                  />
                                )}
                                {isVideo && (
                                  <video
                                    src={previewURL}
                                    className="h-16 w-16 object-cover rounded border border-gray-300 dark:border-gray-600"
                                    muted
                                    autoPlay
                                    loop
                                  />
                                )}
                                {isAudio && (
                                  <Box className="h-16 w-16 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                                    <AudiotrackIcon className="text-gray-700 dark:text-gray-300" />
                                  </Box>
                                )}
                                {isPDF && (
                                  <Box className="h-16 w-16 flex items-center justify-center rounded border border-gray-300 bg-red-100 dark:bg-red-900 font-semibold text-red-700 dark:text-red-300 text-xs">
                                    PDF
                                  </Box>
                                )}
                                {isDocx && (
                                  <Box className="h-16 w-16 flex items-center justify-center rounded border border-gray-300 bg-blue-100 dark:bg-blue-900 font-semibold text-blue-700 dark:text-blue-300 text-xs">
                                    DOCX
                                  </Box>
                                )}
                                {isXlsx && (
                                  <Box className="h-16 w-16 flex items-center justify-center rounded border border-gray-300 bg-green-100 dark:bg-green-900 font-semibold text-green-700 dark:text-green-300 text-xs">
                                    XLSX
                                  </Box>
                                )}
                                {isCsv && (
                                  <Box className="h-16 w-16 flex items-center justify-center rounded border border-gray-300 bg-green-100 dark:bg-green-900 font-semibold text-green-700 dark:text-green-300 text-xs">
                                    CSV
                                  </Box>
                                )}
                                <IconButton
                                  size="small"
                                  onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))}
                                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-0"
                                  style={{ width: "24px", height: "24px" }}
                                >
                                  <i className="tabler-x text-xs" />
                                </IconButton>
                              </Box>
                            )
                          })}
                        </Box>
                      )}

                      <Box className="flex items-end gap-2">
                        <ImageUploadButton
                          onImagesSelected={(files) => setSelectedImages(files)}
                          maxImages={3}
                          disabled={sendingMessage}
                          isLoading={sendingMessage}
                        />

                        <IconButton
                          onClick={() => setVoiceModalOpen(true)}
                          disabled={sendingMessage}
                          sx={{
                            color: "#ef4444",
                            "&:hover": { backgroundColor: "#fee2e2" },
                          }}
                        >
                          <i className="tabler-microphone text-xl" />
                        </IconButton>

                        <TextField
                          fullWidth
                          multiline
                          maxRows={4}
                          placeholder={selectedImages.length > 0 ? "Add caption (optional)..." : "Type a message..."}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          variant="outlined"
                          size="small"
                          disabled={sendingMessage || selectedImages.length > 0}
                        />
                        <Button
                          variant="contained"
                          onClick={handleSendMessage}
                          disabled={(!newMessage.trim() && selectedImages.length === 0) || sendingMessage}
                          className="min-w-[44px] h-[44px]"
                        >
                          {sendingMessage ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <i className="tabler-send" />
                          )}
                        </Button>
                      </Box>
                    </ChatInputContainer>
                  </>
                ) : (
                  <Box className="flex-1 flex items-center justify-center">
                    <Box className="text-center">
                      <i className="tabler-message-circle text-6xl text-textSecondary mb-4" />
                      <Typography variant="h6" color="text.secondary" className="mb-2">
                        Select a customer to start chatting
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Choose a customer from the list to view and respond to their messages
                      </Typography>
                    </Box>
                  </Box>
                )}
              </ChatContainer>
            </>
          )}
        </StyledBox>
      </Card>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Selected Messages?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedMessageIds.length} message
            {selectedMessageIds.length > 1 ? "s" : ""}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDeleteSelectedMessages} color="error" variant="contained" disabled={deleting}>
            {deleting ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteAllConfirmOpen} onClose={() => setDeleteAllConfirmOpen(false)}>
        <DialogTitle>Clear All Messages?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all messages for {selectedCustomer?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAllConfirmOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAllMessages} color="error" variant="contained" disabled={deleting}>
            {deleting ? <CircularProgress size={20} /> : "Clear All"}
          </Button>
        </DialogActions>
      </Dialog>

      <VideoModalWrapper />
    </>
  )
}



