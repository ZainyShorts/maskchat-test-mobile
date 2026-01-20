export type OrdersType = {
  id: number
  status: string
  delivery_type: string
  address: string
  cart_data: string
  special_instruction: string
  tax_price: string
  net_price: string
  total_price: string
  user: number
  restaurant: number
  order_number: number
  created_at: string
  updated_at: string
}

// types.ts (Create this file to hold your types)

export type OrderItems = {
  id: number
  name: string
  instruction: string
  net_price: string
  tax_price: string
  total_price: string
  quantity: number
  status: string
  order: number
  created_at: string
  updated_at: string
}

export type OrderUserObject = {
  id: number
  name: string
  email: string
  status: string
  user_id: number
  created_at: string
  updated_at: string
  account_id: string
}

// Other types...
