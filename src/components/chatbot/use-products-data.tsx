"use client"
import { useEffect, useState } from "react"
import { fetchTopProducts } from "./product-api"
import type { AttractionCard, EventCard } from "./types"
import { getAllBusiness } from "@/api/business"

function normalizeTags(tags?: string | null, productType?: string | null) {
  const parts = (tags || "").split(",").map((s) => s.trim())
  const filtered = parts.filter(Boolean)
  return filtered.length ? filtered.join(", ") : productType || ""
}

function firstImage(images?: any[]) {
  const DEFAULT_IMG =
    "https://bedfantasy.pk/cdn/shop/files/WhatsAppImage2025-02-20at8.00.06PM_6.jpg?v=1741809335&width=1445"
  const img0 = images && images.length ? images[0] : null
  if (!img0) return DEFAULT_IMG
  if (typeof img0 === "string") return img0
  return img0?.src || img0?.url || DEFAULT_IMG
}

export function useProductsData(businessId: string) {
  const [loading, setLoading] = useState(true)
  const [attractions, setAttractions] = useState<AttractionCard[]>([])
  const [events, setEvents] = useState<EventCard[]>([])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        

          const products = await fetchTopProducts(businessId)
          const first20 = products.slice(0, 20)

        const attractionsCards: AttractionCard[] = first20.slice(0, 10).map((p: any) => ({
          id: String(p.id),
          title: p.title || "",
          category: normalizeTags(p.tags, p.product_type),
          location: "",
          image: firstImage(p.images),
        }))

        const eventsCards: EventCard[] = first20.slice(10, 20).map((p: any) => ({
          id: String(p.id),
          title: p.title || "",
          category: normalizeTags(p.tags, p.product_type),
          location: "",
          date: "",
          month: "",
          year: "",
          image: firstImage(p.images),
        }))

        if (active) {
          setAttractions(attractionsCards)
          setEvents(eventsCards)
          setLoading(false)
        }
      } catch (e) {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return { loading, attractions, events }
}
