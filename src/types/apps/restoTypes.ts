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

export type ResturantsType = {
  id: number
  business: Business
  catalog_link: string
  city: string
  contact_number: string
  cuisine_type?: string
  description: string
  name: string
  postalcode_delivery?: string
  postal_code_delivery: string
  // price_range: string
  // rating: string
}

export interface UserType {
  id: number
  name: string | null
  email: string
  user_id: string | null
  status: string
  createdAt: string // ISO date string
}

export interface BusinessType {
  id: number
  user: UserType
  business_id: string
  business_address: string
  business_desc: string
  contact_number: string
  business_initial: string
  business_doc: string
  updated_at: string // ISO date string
  created_at: string // ISO date string
}

export interface RestaurantType {
  id: number
  business: BusinessType
  name: string
  postal_code_delivery: string
  city: string
  cuisine_type: string
  contact_number: string
  description: string
  catalog_link: string
  menu: any | null // Update this if you have a menu interface
  active: boolean
  updated_at: string // ISO date string
  created_at: string // ISO date string
}
