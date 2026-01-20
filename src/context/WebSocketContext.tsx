// contexts/WebSocketContext.tsx
"use client"

import { getWebSocketUrl } from "@/api/vars/vars"
import type React from "react"
import { createContext, useContext, useEffect, useRef, useCallback, useState } from "react"

interface WebSocketMessage {
  type: string
  data: any
}

interface WebSocketContextType {
  sendMessage: (message: WebSocketMessage) => void
  addEventListener: (eventType: string, callback: (data: any) => void) => void
  removeEventListener: (eventType: string, callback: (data: any) => void) => void
  isConnected: boolean
  reconnect: () => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider")
  }
  return context
}

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null)
  const eventListenersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map())
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const addEventListener = useCallback((eventType: string, callback: (data: any) => void) => {
    if (!eventListenersRef.current.has(eventType)) {
      eventListenersRef.current.set(eventType, new Set())
    }
    eventListenersRef.current.get(eventType)!.add(callback)
  }, [])

  const removeEventListener = useCallback((eventType: string, callback: (data: any) => void) => {
    const listeners = eventListenersRef.current.get(eventType)
    if (listeners) {
      listeners.delete(callback)
    }
  }, [])

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message))
    } else {
      console.warn("[WebSocket] Cannot send message, connection not open")
    }
  }, [])

  const connect = useCallback(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      console.log("[WebSocket] No auth token found")
      return
    }

    // Close existing connection
    if (socketRef.current) {
      socketRef.current.close(1000, "Reconnecting")
    }

    
    const wsUrl = `${getWebSocketUrl()}/ws/global/`

    console.log("[WebSocket] Connecting to global WebSocket:", wsUrl)

    const socket = new WebSocket(wsUrl, ["token", token])
    socketRef.current = socket

    socket.onopen = () => {
      console.log("[WebSocket] Connected to global WebSocket")
      setIsConnected(true)
      
      // Clear any reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    }

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        console.log("[WebSocket] Received message:", payload)

        // Notify all listeners for this event type
        const listeners = eventListenersRef.current.get(payload.type)
        if (listeners) {
          listeners.forEach((callback) => callback(payload.data))
        }

        // Also notify wildcard listeners
        const wildcardListeners = eventListenersRef.current.get("*")
        if (wildcardListeners) {
          wildcardListeners.forEach((callback) => callback(payload))
        }
      } catch (err) {
        console.error("[WebSocket] Parse error:", err)
      }
    }

    socket.onerror = (error) => {
      console.error("[WebSocket] Error:", error)
      setIsConnected(false)
    }

    socket.onclose = (event) => {
      console.log("[WebSocket] Closed:", event.code, event.reason)
      setIsConnected(false)

      // Auto-reconnect after 5 seconds
      if (event.code !== 1000) {
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("[WebSocket] Attempting to reconnect...")
          connect()
        }, 5000)
      }
    }
  }, [])

  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    connect()
  }, [connect])

  // Initial connection
  useEffect(() => {
    connect()

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmount")
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connect])

  const value = {
    sendMessage,
    addEventListener,
    removeEventListener,
    isConnected,
    reconnect,
  }

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
}
