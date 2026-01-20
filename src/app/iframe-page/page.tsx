"use client"

import { iframeURL } from "@/api/vars/vars"

export default function IframePage() {
  return (
      <iframe
      src={`${iframeURL()}/chatbot-Iframe`}
      style={{
        position: "fixed",
        top: "60px",
        left: 0,
        width: "100vw",
        height: "calc(100vh - 60px)",
        border: "none",
        margin: 0,
        padding: 0,
        display: "block",
      }}
    />
  )
}
