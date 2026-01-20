"use client"

import { useState } from "react"
import { Box } from "@mui/material"
import DashboardHeader from "./chatbot-header"
import DashboardContent from "./dashboard-content"

interface Agent {
  id: string
  name: string
  type: "faq" | "support" | "sales"
  enabled: boolean
  documents: string[]
  description: string
  conversations: number
  satisfaction: number
}

export default function ChatbotDashboard() {
  const [tokenBalance, setTokenBalance] = useState(1250)
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "FAQ Assistant",
      type: "faq",
      enabled: true,
      documents: ["faq-document.pdf"],
      description: "Handles frequently asked questions",
      conversations: 1247,
      satisfaction: 94,
    },
  ])

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <DashboardHeader agents={agents} tokenBalance={tokenBalance} />
      <DashboardContent
        // agents={agents}
        // setAgents={setAgents}
        // tokenBalance={tokenBalance}
        // setTokenBalance={setTokenBalance}
      />
    </Box>
  )
}
