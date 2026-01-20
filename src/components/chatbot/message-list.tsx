// "use client"
// import { Box } from "@mui/material"
// import type React from "react"

// import { useRef, useEffect } from "react"
// import type { Message } from "./types"
// import { MessageBubble } from "./message-bubble"

// export function MessageList({
//   messages,
//   chatbotName,
//   chatbotAvatar,
//   isAIResponding,
//   typingIndicator,
// }: {
//   messages: Message[]
//   chatbotName: string
//   chatbotAvatar: string
//   isAIResponding: boolean
//   typingIndicator: React.ReactNode
// }) {
//   const endRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages, isAIResponding])

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
//       {messages.map((m) => (
//         <MessageBubble key={m.id} message={m} chatbotName={chatbotName} chatbotAvatar={chatbotAvatar} />
//       ))}
//       {isAIResponding ? typingIndicator : null}
//       <div ref={endRef} />
//     </Box>
//   )
// }

"use client"
import { Box } from "@mui/material"
import type React from "react"

import { useRef, useEffect } from "react"
import type { Message } from "./types"
import { MessageBubble } from "./message-bubble"

export function MessageList({
  messages,
  chatbotName,
  chatbotAvatar,
  isAIResponding,
  typingIndicator,
}: {
  messages: Message[]
  chatbotName: string
  chatbotAvatar: string
  isAIResponding: boolean
  typingIndicator: React.ReactNode
}) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isAIResponding])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} chatbotName={chatbotName} chatbotAvatar={chatbotAvatar} />
      ))}
      {isAIResponding ? typingIndicator : null}
      <div ref={endRef} />
    </Box>
  )
}
