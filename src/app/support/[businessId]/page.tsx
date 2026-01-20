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
import { styled, useTheme } from "@mui/material/styles"
import TablePagination from "@mui/material/TablePagination"
import Switch from "@mui/material/Switch"
import Drawer from "@mui/material/Drawer"
import useMediaQuery from "@mui/material/useMediaQuery"
// Third-party Imports
import classnames from "classnames"
// API service imports
import { inboxApi } from "@/api/inboxApi"

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
import { useParams, useRouter } from "next/navigation"
import type { Locale } from "@configs/i18n"

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
  height: "calc(100vh - 200px)",
  display: "flex",
  flexDirection: "row",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  [theme.breakpoints.down("md")]: {
    height: "calc(100vh - 150px)",
    flexDirection: "column",
    minHeight: "calc(100vh - 150px)",
  },
}))

const CustomerListContainer = styled(Box)(({ theme }) => ({
  width: "350px",
  borderRight: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
  transition: "all 0.3s ease",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    borderRight: "none",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}))

const ChatContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.grey[50],
  backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
  minHeight: 0,
  overflow: "hidden",
}))

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  backgroundImage: `
    linear-gradient(45deg, ${theme.palette.grey[100]} 25%, transparent 25%),
    linear-gradient(-45deg, ${theme.palette.grey[100]} 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, ${theme.palette.grey[100]} 75%),
    linear-gradient(-45deg, transparent 75%, ${theme.palette.grey[100]} 75%)
  `,
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
  backgroundColor: theme.palette.grey[50],
  minHeight: 0,
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}))

const MessageBubble = styled(Box)<{ isFromCustomer: boolean }>(({ theme, isFromCustomer }) => ({
  maxWidth: "70%",
  padding: theme.spacing(1.5, 2),
  borderRadius: isFromCustomer ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
  alignSelf: isFromCustomer ? "flex-start" : "flex-end",
  backgroundColor: isFromCustomer ? theme.palette.common.white : theme.palette.primary.main,
  color: isFromCustomer ? theme.palette.text.primary : theme.palette.primary.contrastText,
  wordBreak: "break-word",
  boxShadow: isFromCustomer ? "0 2px 8px rgba(0, 0, 0, 0.08)" : "0 2px 12px rgba(37, 99, 235, 0.25)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: isFromCustomer ? "0 4px 12px rgba(0, 0, 0, 0.12)" : "0 4px 16px rgba(37, 99, 235, 0.35)",
  },
  [theme.breakpoints.down("sm")]: {
    maxWidth: "90%",
    padding: theme.spacing(1, 1.5),
    fontSize: "0.875rem",
  },
}))

const ChatInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.05)",
  flexShrink: 0,
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}))

export default function InboxPage() {
  const params = useParams()
  const businessId = (params.businessId as string) || ""

  console.log("businessId", businessId)

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
  const [newCustomerNotifications, setNewCustomerNotifications] = useState<any[]>([])
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPreviousPage, setHasPreviousPage] = useState(false)
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)

  const locale = (params.locale as Locale) || "en"

  // Polling state variables
  const [lastMessages, setLastMessages] = useState<Map<number, string>>(new Map())

  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedMessageIds, setSelectedMessageIds] = useState<number[]>([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteAllConfirmOpen, setDeleteAllConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const currentPageRef = useRef<number>(0)
  const router = useRouter()

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

  const { notifications, connectionStatus, markAsRead, clearNotifications, unreadCount } =
    useBusinessNotifications(businessId)

  useEffect(() => {
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
  
            if(payload.type != 'status' && payload.type !='delete_inbox_message'){
  
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
            }else if (payload.type == 'status'){
              console.log('elif condition',payload.type)
              console.log('incoming.id',incoming.id)
              console.log('incoming.message',incoming.message)
              setMessages((prev) =>
                prev.map((msg) => (msg.id === payload.data.id ? { ...msg, status: payload.data.message } : msg)),
              )
            }else if (payload.type === 'delete_inbox_message') {
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
  

  const handleSendMessage = useCallback(async () => {
    if (!selectedCustomer || (!newMessage.trim() && selectedImages.length === 0)) return

    try {
      if (selectedImages.length > 0) {
        await sendMessageToCustomer(selectedCustomer.id, newMessage, "Image", selectedImages)
      } else {
        await sendMessageToCustomer(selectedCustomer.id, newMessage, "Text")
      }

      setNewMessage("")
      setSelectedImages([])
      scrollToBottom(true)
    } catch (err) {
      console.error("[v0] Error sending message:", err)
// <<<<<<< main
    }
  }, [selectedCustomer, newMessage, selectedImages, sendMessageToCustomer])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
// =======
//     }
//   }, [selectedCustomer, newMessage, selectedImages, sendMessageToCustomer])

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSendMessage()
//     }
// >>>>>>> main
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
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
                    className="px-4 py-3">
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
                              console.log("customer.latest_message", type)
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
                                  return `💬 ${msg.charAt(0).toUpperCase()}${msg.slice(1)}`
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

  return (
    <>
      {imageModal.open && (
        <Box
          onClick={() => setImageModal({ open: false, src: null })}
          className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-50 cursor-pointer animate-in fade-in duration-200"
        >
          <img
            src={imageModal.src! || "/placeholder.svg"}
            alt="Full view"
            className="max-h-[85vh] max-w-[90vw] sm:max-w-[75vw] rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </Box>
      )}

      <VoiceRecordingModal
        open={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSend={() => {}}
        isLoading={sendingMessage}
      />

      <Card className="shadow-xl h-screen flex flex-col">
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            className="m-4 animate-in slide-in-from-top duration-300"
          >
            {error}
          </Alert>
        )}
        <Box className="p-4 md:p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between shadow-md flex-shrink-0">
          <Box>
            <Typography variant="h4" className="font-bold text-white flex items-center gap-2">
              <i className="tabler-message-circle text-3xl" />
              Support Inbox
            </Typography>
            <Typography variant="body2" className="text-blue-100 mt-1">
              Manage customer conversations and support requests
            </Typography>
          </Box>
          <IconButton
            onClick={() => setLogoutDialogOpen(true)}
            className="ml-4 bg-white/10 hover:bg-white/20 transition-all"
            title="Logout"
            size="large"
          >
            <i className="tabler-logout-2 text-2xl text-white" />
          </IconButton>
        </Box>

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
                    boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
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
                    <Box className="p-3 sm:p-4 border-b bg-gradient-to-r from-blue-50 to-white shadow-sm flex-shrink-0">
                      <Box className="flex items-center gap-2 sm:gap-3">
                        <IconButton
                          onClick={() => setMobileDrawerOpen(true)}
                          size="small"
                          className="hover:bg-blue-100 transition-colors"
                        >
                          <i className="tabler-menu-2" />
                        </IconButton>

                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "primary.main",
                            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                          }}
                        >
                          {selectedCustomer.name.charAt(0)}
                        </Avatar>
                        <Box className="flex-1 min-w-0">
                          <Typography variant="subtitle1" className="font-semibold truncate text-sm sm:text-base">
                            {selectedCustomer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" className="truncate block">
                            {selectedCustomer.phone_number}
                          </Typography>
                        </Box>

                        {/* Selection mode controls */}
                        {selectionMode && (
                          <>
                            <Chip
                              label={`${selectedMessageIds.length}`}
                              color="primary"
                              size="small"
                              className="shadow-sm"
                            />
                            <IconButton
                              size="small"
                              onClick={() => {}}
                              title="Select all"
                              className="hover:bg-blue-100"
                            >
                              <i className="tabler-checkbox text-sm" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => setDeleteConfirmOpen(true)}
                              disabled={selectedMessageIds.length === 0}
                              color="error"
                              title="Delete selected"
                              className="hover:bg-red-100"
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
                              className="hover:bg-gray-100"
                            >
                              <i className="tabler-x text-sm" />
                            </IconButton>
                          </>
                        )}

                        {/* Regular controls */}
                        {!selectionMode && (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => setSelectionMode(true)}
                              title="Select messages"
                              className="hover:bg-blue-100"
                            >
                              <i className="tabler-checkbox text-sm" />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* Chat Messages */}
                    <MessagesContainer>
                      {messagesLoading || switchingCustomer ? (
                        <Box className="flex justify-center items-center flex-1">
                          <CircularProgress />
                        </Box>
                      ) : (
                        <>
                          {messages && messages.length > 0 ? (
                            groupMessagesByDate(messages).map((group) => (
                              <Box key={group.date} className="mb-4">
                                <Box className="flex justify-center my-4">
                                  <Box className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-md">
                                    {group.date}
                                  </Box>
                                </Box>

                                {/* Messages */}
                                <Box className="flex flex-col gap-2">
                                  {group.items.map((message) => (
                                    <Box
                                      key={message.id}
                                      className="flex flex-col animate-in slide-in-from-bottom-2 duration-300"
                                    >
                                      <Box className="flex items-start gap-2">
                                        {selectionMode && (
                                          <Checkbox
                                            checked={selectedMessageIds.includes(message.id)}
                                            onChange={() => {}}
                                            size="small"
                                            sx={{ mt: 1 }}
                                          />
                                        )}
                                        <Box className="flex-1 flex flex-col">
                                          <MessageBubble isFromCustomer={message.sender === "user"}>
                                            {message.type === "Image" ? (
                                              <img
                                                src={message.message || "/placeholder.svg"}
                                                alt="Image"
                                                className="max-w-[200px] rounded-xl cursor-pointer transition-transform hover:scale-105 shadow-md"
                                                onClick={() => setImageModal({ open: true, src: message.message })}
                                              />
                                            ) : message.type === "Text" ? (
                                              <Typography
                                                className={classnames("font-medium text-sm", {
                                                  "text-gray-800": message.sender === "user",
                                                  "text-white": message.sender === "business",
                                                })}
                                                sx={{ whiteSpace: "pre-line" }}
                                                variant="body2"
                                              >
                                                {message.message}
                                              </Typography>
                                            ) : null}
                                          </MessageBubble>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            className={classnames("mt-1 text-xs", {
                                              "self-start ml-2": message.sender === "user",
                                              "self-end mr-2": message.sender === "business",
                                            })}
                                          >
                                            {formatTimestamp(message.timestamp)}
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
                                <Box className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                  <i className="tabler-message-off text-3xl text-blue-600" />
                                </Box>
                                <Typography variant="h6" color="text.secondary" className="mb-2 font-semibold">
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

                    <ChatInputContainer>
                      {selectedImages.length > 0 && (
                        <Box className="mb-3 flex gap-2 flex-wrap">
                          {selectedImages.map((file, index) => {
                            const type = file.type
                            const previewURL = URL.createObjectURL(file)

                            const isImage = type === "image/jpeg" || type === "image/jpg" || type === "image/png"

                            return (
                              <Box key={index} className="relative group">
                                {isImage && (
                                  <img
                                    src={previewURL || "/placeholder.svg"}
                                    alt={`Selected ${index + 1}`}
                                    className="h-14 w-14 object-cover rounded-lg border-2 border-blue-200 shadow-md"
                                  />
                                )}
                                <IconButton
                                  size="small"
                                  onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))}
                                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white shadow-lg"
                                  style={{ width: "24px", height: "24px" }}
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
                            bgcolor: "#fee2e2",
                            "&:hover": { backgroundColor: "#fecaca" },
                          }}
                        >
                          <i className="tabler-microphone text-lg" />
                        </IconButton>

                        <TextField
                          fullWidth
                          multiline
                          maxRows={4}
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          variant="outlined"
                          size="small"
                          disabled={sendingMessage}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "white",
                              "&:hover fieldset": {
                                borderColor: "primary.main",
                              },
                              "&.Mui-focused fieldset": {
                                borderWidth: "2px",
                              },
                            },
                            "& .MuiInputBase-input": {
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            },
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendingMessage}
                          className="min-w-[40px] h-[40px] shadow-md"
                          sx={{
                            padding: { xs: 1, sm: 1.5 },
                            borderRadius: "12px",
                          }}
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
                  <Box className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white">
                    <Box className="text-center">
                      <Box className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                        <i className="tabler-message-circle text-4xl text-white" />
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<i className="tabler-menu-2" />}
                        onClick={() => setMobileDrawerOpen(true)}
                        className="mb-4 shadow-lg"
                        sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 600 }}
                      >
                        Select a Customer
                      </Button>
                      <Typography variant="h6" color="text.secondary" className="mb-2 font-semibold">
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
                    <Box className="p-4 border-b bg-gradient-to-r from-blue-50 to-white shadow-sm flex-shrink-0">
                      <Box className="flex items-center gap-3">
                        <Avatar
                          sx={{
                            width: 44,
                            height: 44,
                            bgcolor: "primary.main",
                            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                          }}
                        >
                          {selectedCustomer.name.charAt(0)}
                        </Avatar>
                        <Box className="flex-1">
                          <Typography variant="h6" className="font-semibold">
                            {selectedCustomer.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" className="flex items-center gap-1">
                            <i className="tabler-phone text-sm" />
                            {selectedCustomer.phone_number}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Chat Messages */}
                    <MessagesContainer>
                      {messagesLoading || switchingCustomer ? (
                        <Box className="flex justify-center items-center flex-1">
                          <CircularProgress />
                        </Box>
                      ) : (
                        <>
                          {messages && messages.length > 0 ? (
                            groupMessagesByDate(messages).map((group) => (
                              <Box key={group.date} className="mb-4">
                                <Box className="flex justify-center my-4">
                                  <Box className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-md">
                                    {group.date}
                                  </Box>
                                </Box>

                                <Box className="flex flex-col gap-2">
                                  {group.items.map((message) => (
                                    <Box
                                      key={message.id}
                                      className="flex flex-col animate-in slide-in-from-bottom-2 duration-300"
                                    >
                                      <Box className="flex items-start gap-2">
                                        <Box className="flex-1 flex flex-col">
                                          <MessageBubble isFromCustomer={message.sender === "user"}>
                                            {message.type === "Image" ? (
                                              <img
                                                src={message.message || "/placeholder.svg"}
                                                alt="Image"
                                                className="max-w-[250px] rounded-xl cursor-pointer transition-transform hover:scale-105 shadow-md"
                                                onClick={() => setImageModal({ open: true, src: message.message })}
                                              />
                                            ) : message.type === "Text" ? (
                                              <Typography
                                                className={classnames("font-medium", {
                                                  "text-gray-800": message.sender === "user",
                                                  "text-white": message.sender === "business",
                                                })}
                                                sx={{ whiteSpace: "pre-line" }}
                                                variant="body2"
                                              >
                                                {message.message}
                                              </Typography>
                                            ) : null}
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
                                <Box className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                  <i className="tabler-message-off text-3xl text-blue-600" />
                                </Box>
                                <Typography variant="h6" color="text.secondary" className="mb-2 font-semibold">
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

                    <ChatInputContainer>
                      {selectedImages.length > 0 && (
                        <Box className="mb-3 flex gap-2 flex-wrap">
                          {selectedImages.map((file, index) => (
                            <Box key={index} className="relative group">
                              {file.type.startsWith("image/") && (
                                <img
                                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                                  alt={`Selected ${index + 1}`}
                                  className="h-16 w-16 object-cover rounded-lg border-2 border-blue-200 shadow-md"
                                />
                              )}
                              <IconButton
                                size="small"
                                onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white shadow-lg"
                                style={{ width: "24px", height: "24px" }}
                              >
                                <i className="tabler-x text-xs" />
                              </IconButton>
                            </Box>
                          ))}
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
                          size="small"
                          onClick={() => setVoiceModalOpen(true)}
                          disabled={sendingMessage}
                          sx={{
                            color: "#ef4444",
                            bgcolor: "#fee2e2",
                            "&:hover": { backgroundColor: "#fecaca" },
                          }}
                        >
                          <i className="tabler-microphone" />
                        </IconButton>

                        <TextField
                          fullWidth
                          multiline
                          maxRows={4}
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          variant="outlined"
                          size="small"
                          disabled={sendingMessage}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "white",
                            },
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendingMessage}
                          className="shadow-md"
                          sx={{ borderRadius: "12px" }}
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
                  <Box className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                    <Box className="text-center">
                      <Box className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                        <i className="tabler-message-circle text-5xl text-white" />
                      </Box>
                      <Typography variant="h5" color="text.secondary" className="mb-2 font-semibold">
                        No customer selected
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Select a customer from the list to start chatting
                      </Typography>
                    </Box>
                  </Box>
                )}
              </ChatContainer>
            </>
          )}
        </StyledBox>
      </Card>

      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>

          <Button onClick={()=>{localStorage.clear(); window.location.href = '/en/login'}} color="error" variant="contained">

            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )

  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
}
