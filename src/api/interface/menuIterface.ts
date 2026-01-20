export interface TypeObject {
  id: number
  name: string
  description: string
}

export interface MenuDataType  {
  id: number
  type: TypeObject
  title: string
  availbility?: string // Typo in property name, should be corrected if intentional
  availability: string
  sku: string
  brand: string
  rating: number
  price: number
  condition: string
  description: string
  category: string
  link: string
  image_link: string
  restaurant?: number
  business?: number
  name?: string
  status?: string
  availability_circle_radius: number
  imageUrl?: string
  size?: string
  topping?: string
  quantity: number
  sale_price?: string
  feedback?: string
}

interface OrderItem {
  created_at: string // ISO 8601 date string
  description: string // Description of the product
  extra_toppings: string // Additional toppings selected
  id: number // Unique identifier for the order item
  instruction: string // Special instructions for the order
  name: string | null // Name of the product, nullable
  net_price: string // Net price as a string
  order: number // Order ID this item belongs to
  product_sku: string // SKU of the product
  quantity: number // Quantity of the item
  size: string // Size of the product
  spice_level: string // Spice level selected
  status: string // Current status of the order item
  tax_price: string // Tax amount as a string
  total_price: string // Total price as a string
  updated_at: string // ISO 8601 date string for last update
  resturant: number
}

export interface SearchedMenuItem {
  id: number
  sku: string
  title: string
  status: 'pending' | 'active' | 'inactive' // Assuming possible statuses
  description: string
  availability: 'in stock' | 'out of stock' | 'preorder' // Adjust as needed
  condition: 'New' | 'Used' | 'Refurbished' | string
  price: number // Changed to number for price representation
  link: string
  image_link: string
  brand: string
  updated_at: string // ISO date string
  created_at: string // ISO date string
  google_product_category?: string
  fb_product_category?: string
  quantity_to_sell_on_facebook: number
  sale_price?: number // Assuming sale_price is numeric
  sale_price_effective_date?: string // ISO date range or specific format
  item_group_id?: string
  gender: 'male' | 'female' | 'unisex' | string
  color?: string
  size?: string
  age_group: 'newborn' | 'infant' | 'toddler' | 'children' | 'all ages' | string
  material?: string
  pattern?: string
  shipping?: string
  shipping_weight: string // Consider using a more specific type or separate fields
  video_url?: string
  address_city?: string
  address_country?: string
  address_neighborhoods?: string
  address_postal_code?: string
  address_region?: string
  address_street_address?: string
  availability_polygon_coordinates_latitude: number[]
  availability_polygon_coordinates_longitude: number[]
  availability_circle_origin_latitude: number
  availability_circle_origin_longitude: number
  availability_circle_radius_unit: 'KM' | 'MILES' | string
  availability_circle_radius: number
  style?: string
  menu_number: string
  business: number
  restaurant?: number | null // Assuming restaurant is a number or null
  quantity: number
  order_number: string
  total_price: string
  delivery_type: string
  order_items: OrderItem[]
}

export interface SyncMenuDataType {
  business?: number
  id?: number
}

export interface Business {
  id: number
  user: User // User associated with the business
  business_id: string
  business_address: string
  business_desc: string
  created_at: string // ISO 8601 date string
  updated_at: string // ISO 8601 date string
}

export interface Restaurant {
  id: number
  name: string
  postal_code_delivery: string
  city: string
  cuisine_type: string
  created_at: string // ISO 8601 date string
  updated_at: string // ISO 8601 date string
}

export interface User {
  id: number
  name: string
  email: string
  user_id: string | null // Nullable user ID
  status: string // User status, e.g., "Active"
}

export interface OrderItem1 {
  created_at: string // ISO 8601 date string
  description: string // Description of the product
  extra_toppings: string // Additional toppings selected
  id: number // Unique identifier for the order item
  instruction: string // Special instructions for the order
  name: string | null // Name of the product, nullable
  net_price: string // Net price as a string
  order: number // Order ID this item belongs to
  product_sku: string // SKU of the product
  quantity: number // Quantity of the item
  size: string // Size of the product
  spice_level: string // Spice level selected
  status: string // Current status of the order item
  tax_price: string // Tax amount as a string
  total_price: string // Total price as a string
  updated_at: string // ISO 8601 date string for last update
}

export interface OrderInterface {
  id: number
  address: string // Delivery address
  business: Business // Associated business details
  cart_data: any | null // Cart data, nullable (can be refined if structure is known)
  created_at: string // ISO 8601 date string
  delivery_type: string // Delivery type, e.g., "delivery"
  net_price: string // Total net price of the order
  order_items: OrderItem1[] // Array of items in the order
  order_number: string // Unique order number
  restaurant: Restaurant // Associated restaurant details
  special_instruction: string // Special instructions for delivery
  status: string // Current status of the order
  tax_price: string // Tax amount for the order
  total_price: string // Total price of the order
  updated_at: string // ISO 8601 date string for last update
  user: User // Associated user details
}

export interface TemplateDataType {
  id: number
  name: string
  access_token: string
  category: string
  allow_category_change: boolean
  language: string
  flow_id: number
  waba_id: string
  type: number
  business_id: number

  // "name": "order_delivery_flow",
  // "category": "MARKETING",
  // "allow_category_change": true,
  // "language": "en_US",
  // "access_token":
  // "waba_id": "387308377791320",
  // "flow_id":1133683774973858,
  // "type":1,
  // "business_id":2
}

export interface FlowDataType {
  id: number
  access_token: string
  flow_type: string
  name: string
  categories: string
  waba_id: string
  type: number
  business_id: number
  // waba_id: '387308377791320'
  // "categories": ["OTHER"],
}
