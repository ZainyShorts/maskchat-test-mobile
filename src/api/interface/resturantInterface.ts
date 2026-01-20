interface User {
  id: number
  name: string | null
  email: string
  user_id: string | null
  status: string
  createdAt: string
}

interface Business {
  id: number
  user: User
  business_id: string
  business_address: string
  business_desc: string
  contact_number: string
  business_initial: string
  business_doc: string
  updated_at: string
  created_at: string
}

export interface ResturantDataType {
  id: number
  name: string
  postalcode_delivery?: string // Optional, but likely a typo (consider changing to postal_code_delivery)
  postal_code_delivery: string
  city: string
  cuisine_type: string
  contact_number: string
  description: string
  catalog_link: string
  menu?: string
  business: Business
  business_id: string
  openTime?: string
  closeTime?: string
  deliveryRadius: number
  active: boolean
  endBreakTime?: string
  startBreakTime?: string
}
