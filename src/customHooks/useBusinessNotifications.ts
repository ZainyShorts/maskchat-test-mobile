// hooks/useBusinessNotifications.ts
import { getWebSocketUrl } from '@/api/vars/vars'
import { useState, useEffect, useCallback } from 'react'

export const useBusinessNotifications = (businessId: string | null) => {
  const [businessSocket, setBusinessSocket] = useState<WebSocket | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected')

  const connect = useCallback(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      console.log("[Business WS] No auth token found")
      return null
    }

    
    const wsUrl = `${getWebSocketUrl()}/ws/business/${businessId}/notifications/`

    console.log("[Business WS] Connecting:", wsUrl)
    setConnectionStatus('connecting')
    
    const socket = new WebSocket(wsUrl, ["token", token])
    
    socket.onopen = () => {
      console.log("[Business WS] Connected for business:", businessId)
      setConnectionStatus('connected')
    }
    
    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        console.log("[Business WS] Notification:", payload)
        
        // Add notification
        setNotifications(prev => [
          {
            id: Date.now(),
            ...payload,
            timestamp: new Date().toISOString(),
            read: false
          },
          ...prev.slice(0, 49) // Keep last 50 notifications
        ])
        
      } catch (err) {
        console.error("[Business WS] Parse error:", err)
      }
    }
    
    socket.onerror = (err) => {
      console.error("[Business WS] Error:", err)
      setConnectionStatus('disconnected')
    }
    
    socket.onclose = (event) => {
      console.log("[Business WS] Closed:", event.code, event.reason)
      setConnectionStatus('disconnected')
      
      // Auto-reconnect
      setTimeout(() => {
        connect()
      }, 5000)
    }
    
    return socket
  }, [businessId])

  useEffect(() => {
    const socket = connect()
    setBusinessSocket(socket)
    
    return () => {
      if (socket) {
        socket.close(1000, "Component unmount")
      }
    }
  }, [connect])

  const markAsRead = useCallback((notificationId: number) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    connectionStatus,
    markAsRead,
    clearNotifications,
    unreadCount: notifications.filter(n => !n.read).length
  }
}
