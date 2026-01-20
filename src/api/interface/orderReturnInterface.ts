// Main interface representing the entire object
export interface ReturnOrder {
  id: number
  user: User
  business: Business
  order: Order
  return_order_number: string
  order_status: string
  address: string
  delivery_type: string
  special_instruction: string
  tax_price: string
  net_price: string
  total_price: string
  updated_at: string // Consider using Date if you plan to parse this string
  created_at: string // Consider using Date if you plan to parse this string
  status: string
}

// Interface for the User object within the main object
export interface User {
  id: number
  name: string | null
  email: string
  user_id: string | null
  status: string
  createdAt: string // Consider using Date if you plan to parse this string
}

// Interface for the Business object
export interface Business {
  id: number
  user: BusinessUser
  business_id: string
  business_address: string
  business_desc: string
  contact_number: string
  business_initial: string
  business_doc: string // URL as string
  updated_at: string // Consider using Date if you plan to parse this string
  created_at: string // Consider using Date if you plan to parse this string
}

// Interface for the User object within the Business object
export interface BusinessUser {
  id: number
  name: string | null
  email: string
  user_id: string | null
  status: string
  createdAt: string // Consider using Date if you plan to parse this string
}

// Interface for the Order object
export interface Order {
  id: number
  order_items: OrderItem[] // Assuming order_items is an array of OrderItem objects
  order_number: string
  status: string
  delivery_type: string
  address: string
  cart_data: any | null // Replace 'any' with a more specific type if available
  special_instruction: string
  tax_price: string
  net_price: string
  total_price: string
  updated_at: string // Consider using Date if you plan to parse this string
  created_at: string // Consider using Date if you plan to parse this string
  user: number // Assuming this is a reference ID
  restaurant: number // Assuming this is a reference ID
  business: number // Assuming this is a reference ID
}

// Interface for items within the Order
interface OrderItem {
  id: number
  name: string
  description: string
  product_sku: string
  quantity: number
  size: 'small' | 'medium' | 'large' // Assuming these are the possible sizes
  spice_level: 'mild' | 'normal' | 'hot' // Assuming possible spice levels
  extra_toppings?: string // Optional field
  instruction?: string // Optional field
  net_price: string // Consider using number if possible
  tax_price: string // Consider using number if possible
  total_price: string // Consider using number if possible
  order: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' // Assuming possible statuses
  created_at: string // ISO 8601 date string
  updated_at: string // ISO 8601 date string
}

// Interface for individual return items

export interface ReturnItem {
  id: number
  name: string
  quantity: number
  status: string
  tax_price: string
  net_price: string
  total_price: string
  return_order: number
  created_at: string
  updated_at: string
  // Optional field example
  notes?: string
}

export interface OrderReturnDataType {
  id: number
  return_items?: ReturnItem[]
  return_order_number: string
  order_status: 'wrong_order' | 'pending' | 'completed' | string // Add specific statuses as needed
  address: string
  delivery_type: 'pickup' | 'delivery' | string // Add specific types as needed
  special_instruction: string
  tax_price: string // Consider using number if appropriate
  net_price: string // Consider using number if appropriate
  total_price: string // Consider using number if appropriate
  order: Order
  user: User
  business: Business
  created_at: string
  updated_at: string
}

export interface OrderReturnDataTypeWithObjects {
  id: number
  return_items?: ReturnItem[]
  return_order_number: string
  order_status: 'wrong_order' | 'pending' | 'completed' | string // Add specific statuses as needed
  address: string
  delivery_type: 'pickup' | 'delivery' | string // Add specific types as needed
  special_instruction: string
  tax_price: string // Consider using number if appropriate
  net_price: string // Consider using number if appropriate
  total_price: string // Consider using number if appropriate
  order: Order
  user: User
  business: Business
  created_at: string
  updated_at: string
}
