"use client"

import { useEffect, useState } from "react"
import { GetWhatsApp, getWhatsAppQRByContact } from "@/api/whatsapp"

export default function QRCodeDisplay() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any[]>([])
  const [selectedNumber, setSelectedNumber] = useState("")

  /** Fetch numbers */
  useEffect(() => {
    fetchWhatsAppFeed()
  }, [])

  const fetchWhatsAppFeed = async () => {
    try {
      const response = await GetWhatsApp()
      const results = response?.data?.results || []
      setData(results)

      /** 🔹 Auto-select first item */
      if (results.length > 0) {
        const firstNumber = results[0].phone_no
        setSelectedNumber(firstNumber)
        handleQRCodeClick(firstNumber)
      }
    } catch (err) {
      setError("Failed to fetch WhatsApp phone numbers.")
    }
  }

  /** Fetch QR */
  const handleQRCodeClick = async (contact_number: string) => {
    if (!contact_number || qrCodeUrl) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await getWhatsAppQRByContact(contact_number)
      const url = URL.createObjectURL(res.data)
      setQrCodeUrl(url)
    } catch (err) {
      setError("Failed to load QR code.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center max-h-[1220px] justify-center">

      {!qrCodeUrl && (
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          WhatsApp QR Code Viewer
        </h1>
      )}

      {/* 🔒 Dropdown disabled after QR generated */}
      {/* <select
        value={selectedNumber}
        disabled={isLoading || !!qrCodeUrl}
        className="p-3 rounded-lg border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
                   focus:outline-none focus:ring-2 focus:ring-green-500 w-80
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {data.map((item, index) => (
          <option key={index} value={item.phone_no}>
            {item.category}
          </option>
        ))}
      </select> */}

      {isLoading && (
        <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading QR Code...
        </div>
      )}

      {error && (
        <div className="text-lg font-medium text-red-500 text-center">
          {error}
        </div>
      )}

      {qrCodeUrl && !isLoading && (
        <div className=" border rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <img
            src={qrCodeUrl}
            alt="WhatsApp QR Code"
            className="w-80 h-120 object-conver"
          />
          <p className="mb-2 text-center text-gray-600 dark:text-gray-400">
            Scan to connect on WhatsApp
          </p>
        </div>
      )}
    </div>
  )
}
