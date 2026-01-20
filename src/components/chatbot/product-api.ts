import { getBaseUrl } from "@/api/vars/vars"

export interface Product {
  id: number | string
  title: string
  tags?: string | null
  product_type?: string | null
  images?: any[] // images may be [], or objects with src/url
}



// const TOP_PRODUCTS_URL = `${getBaseUrl()}products/top/1005255797441315/`

export async function fetchTopProducts(b_id: string): Promise<Product[]> {
  const TOP_PRODUCTS_URL = `${getBaseUrl()}products/top/${b_id}/`
  const res = await fetch(TOP_PRODUCTS_URL, { cache: "no-store" })
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`)
  }
  const data = (await res.json()) as Product[] 
  console.log("Products Array",data)
  return Array.isArray(data) ? data : []
}

// Helper functions
function normalizeTags(tags?: string | null, productType?: string | null) {
  const parts = (tags || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  return parts.length ? parts.join(", ") : productType || ""
}

function firstImage(images?: any[]) {
  const img0 = images && images.length ? images[0] : null
  // Provided default if images not available
  const DEFAULT_IMG =
    "https://bedfantasy.pk/cdn/shop/files/WhatsAppImage2025-02-20at8.00.06PM_6.jpg?v=1741809335&width=1445"
  if (!img0) return DEFAULT_IMG
  if (typeof img0 === "string") return img0
  return img0?.src || img0?.url || DEFAULT_IMG
}

// Fetch functions
// export async function fetchAttractions(b_id: string) {
//   const products = await fetchTopProducts(b_id)
//   const first20 = products.slice(0, 20)
//   return first20.slice(0, 10).map((p) => ({
//     id: String(p.id),
//     title: p.title || "",
//     category: normalizeTags(p.tags, p.product_type),
//     location: "",
//     image: firstImage(p.images),
//   }))
// }

// export async function fetchEvents(b_id: string) {
//   const products = await fetchTopProducts(b_id)
//   const first20 = products.slice(0, 20)
//   return first20.slice(10, 20).map((p) => ({
//     id: String(p.id),
//     title: p.title || "",
//     category: normalizeTags(p.tags, p.product_type),
//     location: "",
//     date: "",
//     month: "",
//     year: "",
//     image: firstImage(p.images),
//   }))
// }
