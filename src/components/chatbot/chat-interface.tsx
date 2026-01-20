// "use client"
// import { Box, useMediaQuery, useTheme } from "@mui/material"
// import { useEffect, useState } from "react"
// import type { AttractionCard, ChatInterfaceProps, EventCard, Message, SelectedCard } from "./types"
// import { ChatHeader } from "./chat-header"
// import { EmptyState } from "./empty-state"
// import { MessageList } from "./message-list"
// import { TypingIndicator } from "./typing-indicator"
// import { SelectedCardPreview } from "./selected-card-preview"
// import { InputBar } from "./input-bar"
// import { useProductsData } from "./use-products-data"
// import { validateAndNormalizePhoneNumber, sendChatMessage } from "./functions"

// export function ChatInterface({
//   currentChatbot,
//   onNewChat,
//   sidebarWidth = 0,
//   sidebarOpen = false,
//   businessId,
// }: ChatInterfaceProps) {
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"))

//   const { loading, attractions, events } = useProductsData(businessId)

//   const [messages, setMessages] = useState<Message[]>([])
//   const [inputValue, setInputValue] = useState("")
//   const [isPhoneVerified, setIsPhoneVerified] = useState(false)
//   const [userPhoneNumber, setUserPhoneNumber] = useState<string | null>(null)
//   const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null)
//   const [isAIResponding, setIsAIResponding] = useState(false)
//   const [userName, setUserName] = useState<string | null>(null)
//   const [hasRejectedFirstInputAsName, setHasRejectedFirstInputAsName] = useState(false)
//   const [pendingCardIntent, setPendingCardIntent] = useState<SelectedCard | null>(null)
//   const [pendingAutoQuery, setPendingAutoQuery] = useState<string | null>(null)

//   useEffect(() => {
//     setMessages([])
//     setSelectedCard(null)
//     setInputValue("")

//     try {
//       const storedName = typeof window !== "undefined" ? localStorage.getItem("chat_user_name") : null
//       const storedPhone = typeof window !== "undefined" ? localStorage.getItem("chat_user_phone") : null
//       setUserName(storedName)
//       if (storedPhone) {
//         setIsPhoneVerified(true)
//         setUserPhoneNumber(storedPhone)
//       } else {
//         setIsPhoneVerified(false)
//         setUserPhoneNumber(null)
//       }
//     } catch {
//       setUserName(null)
//       setIsPhoneVerified(false)
//       setUserPhoneNumber(null)
//     }

//     setHasRejectedFirstInputAsName(false)
//   }, [currentChatbot.id])

//   const handleSelectCard = (card: AttractionCard | EventCard, type: "attraction" | "event") => {
//     setSelectedCard({
//       id: card.id,
//       title: card.title,
//       category: card.category,
//       image: card.image,
//       type,
//     })
//   }

//   const handleRemoveCard = () => setSelectedCard(null)

//   const send = async () => {
//     if (!inputValue.trim() && !selectedCard) return

//     const isCardSubmission = Boolean(selectedCard)
//     let composedQuery = inputValue.trim()
//       ? inputValue.trim()
//       : isCardSubmission && selectedCard?.title
//         ? `I want to buy this "${selectedCard.title}"`
//         : "I want to buy this"

   

//     if (selectedCard){
//       composedQuery = `${inputValue.trim()} ${selectedCard.title}`
//     }

//     console.log('composedQuery',composedQuery)

//     const newMessage: Message = {
//       id: Date.now().toString(),
//       content: composedQuery,
//       sender: "user",
//       timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       selectedCard: selectedCard,
//     }

//     const needsName = !userName
//     const needsPhone = !!userName && !isPhoneVerified
//     if (selectedCard && (needsName || needsPhone)) {
//       setPendingCardIntent(selectedCard)
//       setPendingAutoQuery(`I want to buy this "${selectedCard.title}"`)
//     }

//     setMessages((prev) => [...prev, newMessage])
//     const userInput = composedQuery
//     setInputValue("")
//     setSelectedCard(null)

//     if (!userName) {
//       if (!hasRejectedFirstInputAsName) {
//         setHasRejectedFirstInputAsName(true)
//         const askNameMessage: Message = {
//           id: (Date.now() + 1).toString(),
//           content: "Please enter your name to continue",
//           sender: "ai",
//           timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//         }
//         setTimeout(() => setMessages((prev) => [...prev, askNameMessage]), 300)
//         return
//       } else {
//         const name = userInput.trim()
//         setUserName(name)
//         try {
//           localStorage.setItem("chat_user_name", name)
//         } catch {}
//         const askPhoneMessage: Message = {
//           id: (Date.now() + 1).toString(),
//           content: `Thanks ${name}! What is your phone number?`,
//           sender: "ai",
//           timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//         }
//         setTimeout(() => setMessages((prev) => [...prev, askPhoneMessage]), 300)
//         return
//       }
//     }

//     if (!isPhoneVerified) {
//       const validation = validateAndNormalizePhoneNumber(userInput)
//       setTimeout(() => {
//         if (validation.isValid && validation.normalizedNumber) {
//           setIsPhoneVerified(true)
//           setUserPhoneNumber(validation.normalizedNumber)
//           try {
//             localStorage.setItem("chat_user_phone", validation.normalizedNumber)
//           } catch {}
//           const successMessage: Message = {
//             id: (Date.now() + 1).toString(),
//             content: "Perfect! Now you can chat with me",
//             sender: "ai",
//             timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//           }
//           setMessages((prev) => [...prev, successMessage])

//           if (pendingAutoQuery && pendingCardIntent) {
//             const autoUserMsg: Message = {
//               id: (Date.now() + 2).toString(),
//               content: pendingAutoQuery,
//               sender: "user",
//               timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//               selectedCard: pendingCardIntent,
//             }
//             setMessages((prev) => [...prev, autoUserMsg])
//             ;(async () => {
//               try {
//                 setIsAIResponding(true)
//                 const response = await sendChatMessage(
//                   validation.normalizedNumber!,
//                   userName ?? "",
//                   pendingAutoQuery,
//                   businessId
//                 )
//                 const aiResponse: Message = {
//                   id: (Date.now() + 3).toString(),
//                   content: response.reply,
//                   sender: "ai",
//                   timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//                 }
//                 setMessages((prev) => [...prev, aiResponse])
//               } catch (e) {
//                 console.error("[v0] Error sending auto intent:", e)
//                 const errMsg: Message = {
//                   id: (Date.now() + 4).toString(),
//                   content: "Sorry, I'm having trouble connecting right now. Please try again.",
//                   sender: "ai",
//                   timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//                 }
//                 setMessages((prev) => [...prev, errMsg])
//               } finally {
//                 setIsAIResponding(false)
//                 setPendingCardIntent(null)
//                 setPendingAutoQuery(null)
//               }
//             })()
//           }
//         } else {
//           const errorMessage: Message = {
//             id: (Date.now() + 1).toString(),
//             content: "Please enter your phone number to continue chatting",
//             sender: "ai",
//             timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//           }
//           setMessages((prev) => [...prev, errorMessage])
//         }
//       }, 500)
//       return
//     }

//     try {
//       setIsAIResponding(true)
//       const response = await sendChatMessage(userPhoneNumber!, userName ?? "", userInput, businessId)
//       const aiResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         content: response.reply,
//         sender: "ai",
//         timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       }
//       setMessages((prev) => [...prev, aiResponse])
//     } catch (e) {
//       console.error("[v0] Error getting AI response:", e)
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         content: "Sorry, I'm having trouble connecting right now. Please try again.",
//         sender: "ai",
//         timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       }
//       setMessages((prev) => [...prev, errorMessage])
//     } finally {
//       setIsAIResponding(false)
//     }
//   }

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         height: "calc(100vh - 120px)",
//         width: "100%",
//         maxWidth: "100vw",
//         overflow: "hidden",
//         pt: "45px",
//       }}
//     >
//       <ChatHeader currentChatbot={currentChatbot} show={messages.length > 0} sidebarOpen={sidebarOpen} />

//       <Box
//         sx={{
//           flex: 1,
//           overflow: "auto",
//           backgroundColor: "#f8f9fa",
//           p: isMobile ? 2 : 3,
//           width: "100%",
//           display: "flex",
//           flexDirection: "column",
//           pb: selectedCard ? "220px" : "100px",
//           pt: messages.length > 0 ? "100px" : 3,
//           scrollbarWidth: "none",
//           msOverflowStyle: "none",
//           "&::-webkit-scrollbar": { display: "none" },
//         }}
//       >
//         {messages.length === 0 ? (
//           <Box sx={{ width: "100%", maxWidth: "100%", mx: "auto", flex: 1, display: "flex", flexDirection: "column" }}>
//             <EmptyState
//               currentChatbot={currentChatbot}
//               loading={loading}
//               attractions={attractions}
//               events={events}
//               selectedCard={selectedCard}
//               onSelect={handleSelectCard}
//             />
//           </Box>
//         ) : (
//           <Box
//             sx={{
//               width: "100%",
//               maxWidth: "100%",
//               p: isMobile ? 1 : 2,
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <MessageList
//               messages={messages}
//               chatbotName={currentChatbot.name}
//               chatbotAvatar={currentChatbot.avatar}
//               isAIResponding={isAIResponding}
//               typingIndicator={
//                 <TypingIndicator avatar={currentChatbot.avatar} initial={currentChatbot.name.charAt(0)} />
//               }
//             />
//           </Box>
//         )}
//       </Box>

//       <Box
//         sx={{
//           mt: 3,
//           pt: 3,
//           borderTop: `1px solid ${theme.palette.divider}`,
//           backgroundColor: "white",
//           borderRadius: "12px",
//           p: 3,
//           boxShadow: "0 -2px 8px rgba(0,0,0,0.05)",
//           position: "fixed",
//           bottom: 1,
//           left: { xs: 20, md: sidebarOpen ? 320 : 80 },
//           right: 20,
//           width: {
//             xs: "calc(100vw - 40px)",
//             md: sidebarOpen ? "calc(100vw - 360px)" : "calc(100vw - 120px)",
//           },
//           maxWidth: { xs: "none", md: "6xl" },
//           zIndex: 1000,
//         }}
//       >
//         <SelectedCardPreview selectedCard={selectedCard} isMobile={Boolean(isMobile)} onRemove={handleRemoveCard} />
//         <InputBar
//           value={inputValue}
//           disabled={isAIResponding}
//           hasSelectedCard={Boolean(selectedCard)}
//           onChange={setInputValue}
//           onSend={send}
//         />
//       </Box>
//     </Box>
//   )
// }

"use client"
import { Box, useMediaQuery, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import type { AttractionCard, ChatInterfaceProps, EventCard, Message, SelectedCard } from "./types"
import { ChatHeader } from "./chat-header"
import { EmptyState } from "./empty-state"
import { MessageList } from "./message-list"
import { TypingIndicator } from "./typing-indicator"
import { SelectedCardPreview } from "./selected-card-preview"
import { InputBar } from "./input-bar"
import { useProductsData } from "./use-products-data"
import { validateAndNormalizePhoneNumber, sendChatMessage } from "./functions"

export function ChatInterface({
  currentChatbot,
  onNewChat,
  sidebarWidth = 0,
  sidebarOpen = false,
  businessId,
}: ChatInterfaceProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const { loading, attractions, events } = useProductsData(businessId)

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [userPhoneNumber, setUserPhoneNumber] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null)
  const [isAIResponding, setIsAIResponding] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [hasRejectedFirstInputAsName, setHasRejectedFirstInputAsName] = useState(false)
  const [pendingCardIntent, setPendingCardIntent] = useState<SelectedCard | null>(null)
  const [pendingAutoQuery, setPendingAutoQuery] = useState<string | null>(null)

  useEffect(() => {
    setMessages([])
    setSelectedCard(null)
    setInputValue("")

    try {
      const storedName = typeof window !== "undefined" ? localStorage.getItem("chat_user_name") : null
      const storedPhone = typeof window !== "undefined" ? localStorage.getItem("chat_user_phone") : null
      setUserName(storedName)
      if (storedPhone) {
        setIsPhoneVerified(true)
        setUserPhoneNumber(storedPhone)
      } else {
        setIsPhoneVerified(false)
        setUserPhoneNumber(null)
      }
    } catch {
      setUserName(null)
      setIsPhoneVerified(false)
      setUserPhoneNumber(null)
    }

    setHasRejectedFirstInputAsName(false)
  }, [currentChatbot.id])

  const handleSelectCard = (card: AttractionCard | EventCard, type: "attraction" | "event") => {
    setSelectedCard({
      id: card.id,
      title: card.title,
      category: card.category,
      image: card.image,
      type,
    })
  }

  const handleRemoveCard = () => setSelectedCard(null)

  const send = async () => {
    if (!inputValue.trim() && !selectedCard) return

    const isCardSubmission = Boolean(selectedCard)
    let composedQuery = inputValue.trim()
      ? inputValue.trim()
      : isCardSubmission && selectedCard?.title
        ? `I want to buy this "${selectedCard.title}"`
        : "I want to buy this"

   

    if (selectedCard){
      composedQuery = `${inputValue.trim()} ${selectedCard.title}`
    }

    console.log('composedQuery',composedQuery)

    const newMessage: Message = {
      id: Date.now().toString(),
      content: composedQuery,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      selectedCard: selectedCard,
    }

    const needsName = !userName
    const needsPhone = !!userName && !isPhoneVerified
    if (selectedCard && (needsName || needsPhone)) {
      setPendingCardIntent(selectedCard)
      setPendingAutoQuery(`I want to buy this "${selectedCard.title}"`)
    }

    setMessages((prev) => [...prev, newMessage])
    const userInput = composedQuery
    setInputValue("")
    setSelectedCard(null)

    if (!userName) {
      if (!hasRejectedFirstInputAsName) {
        setHasRejectedFirstInputAsName(true)
        const askNameMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Please enter your name to continue",
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setTimeout(() => setMessages((prev) => [...prev, askNameMessage]), 300)
        return
      } else {
        const name = userInput.trim()
        setUserName(name)
        try {
          localStorage.setItem("chat_user_name", name)
        } catch {}
        const askPhoneMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Thanks ${name}! What is your phone number?`,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setTimeout(() => setMessages((prev) => [...prev, askPhoneMessage]), 300)
        return
      }
    }

    if (!isPhoneVerified) {
      const validation = validateAndNormalizePhoneNumber(userInput)
      setTimeout(() => {
        if (validation.isValid && validation.normalizedNumber) {
          setIsPhoneVerified(true)
          setUserPhoneNumber(validation.normalizedNumber)
          try {
            localStorage.setItem("chat_user_phone", validation.normalizedNumber)
          } catch {}
          const successMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "Perfect! Now you can chat with me",
            sender: "ai",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
          setMessages((prev) => [...prev, successMessage])

          if (pendingAutoQuery && pendingCardIntent) {
            const autoUserMsg: Message = {
              id: (Date.now() + 2).toString(),
              content: pendingAutoQuery,
              sender: "user",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              selectedCard: pendingCardIntent,
            }
            setMessages((prev) => [...prev, autoUserMsg])
            ;(async () => {
              try {
                setIsAIResponding(true)
                const response = await sendChatMessage(
                  validation.normalizedNumber!,
                  userName ?? "",
                  pendingAutoQuery,
                  businessId
                )
                const aiResponse: Message = {
                  id: (Date.now() + 3).toString(),
                  content: response.reply,
                  sender: "ai",
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                }
                setMessages((prev) => [...prev, aiResponse])
              } catch (e) {
                console.error("[v0] Error sending auto intent:", e)
                const errMsg: Message = {
                  id: (Date.now() + 4).toString(),
                  content: "Sorry, I'm having trouble connecting right now. Please try again.",
                  sender: "ai",
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                }
                setMessages((prev) => [...prev, errMsg])
              } finally {
                setIsAIResponding(false)
                setPendingCardIntent(null)
                setPendingAutoQuery(null)
              }
            })()
          }
        } else {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "Please enter your phone number to continue chatting",
            sender: "ai",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
          setMessages((prev) => [...prev, errorMessage])
        }
      }, 500)
      return
    }

    try {
      setIsAIResponding(true)
      const response = await sendChatMessage(userPhoneNumber!, userName ?? "", userInput, businessId)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.reply,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (e) {
      console.error("[v0] Error getting AI response:", e)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsAIResponding(false)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
        pt: "45px",
      }}
    >
      <ChatHeader currentChatbot={currentChatbot} show={messages.length > 0} sidebarOpen={sidebarOpen} />

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          backgroundColor: "#f8f9fa",
          p: isMobile ? 2 : 3,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          pb: selectedCard ? "220px" : "100px",
          pt: messages.length > 0 ? "100px" : 3,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ width: "100%", maxWidth: "100%", mx: "auto", flex: 1, display: "flex", flexDirection: "column" }}>
            <EmptyState
              currentChatbot={currentChatbot}
              loading={loading}
              attractions={attractions}
              events={events}
              selectedCard={selectedCard}
              onSelect={handleSelectCard}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              p: isMobile ? 1 : 2,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <MessageList
              messages={messages}
              chatbotName={currentChatbot.name}
              chatbotAvatar={currentChatbot.avatar}
              isAIResponding={isAIResponding}
              typingIndicator={
                <TypingIndicator avatar={currentChatbot.avatar} initial={currentChatbot.name.charAt(0)} />
              }
            />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          mt: 3,
          pt: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: "white",
          borderRadius: "12px",
          p: 3,
          boxShadow: "0 -2px 8px rgba(0,0,0,0.05)",
          position: "fixed",
          bottom: 1,
          left: { xs: 20, md: sidebarOpen ? 320 : 80 },
          right: 20,
          width: {
            xs: "calc(100vw - 40px)",
            md: sidebarOpen ? "calc(100vw - 360px)" : "calc(100vw - 120px)",
          },
          maxWidth: { xs: "none", md: "6xl" },
          zIndex: 1000,
        }}
      >
        <SelectedCardPreview selectedCard={selectedCard} isMobile={Boolean(isMobile)} onRemove={handleRemoveCard} />
        <InputBar
          value={inputValue}
          disabled={isAIResponding}
          hasSelectedCard={Boolean(selectedCard)}
          onChange={setInputValue}
          onSend={send}
        />
      </Box>
    </Box>
  )
}

