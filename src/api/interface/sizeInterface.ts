export interface SizeDataType {
  id: number
  name: string
  description: string
  additional_price: string
  size: string
  menu: SizeMenuType
  type: number
  business: number
  active?: boolean
  title?: string
}

export interface SizeMenuType {
  id: number
  title: string
  name: string
  description: string
}

export interface SizeMenuDataTypeObject {
  id: number
}

export interface SizeDataTypeWithoutId {
  id?: number
  name: string
  description: string
  additional_price: string
  menu: number
  type: number
  size: string
  business: number
  active?: boolean
  title?: string
}

export interface BusinessMenusDataType {
  address_city: string
  address_country: string
  address_neighborhoods: string
  address_postal_code: string
  address_region: string
  address_street_address: string
  age_group: 'all ages' | string // You can specify more age groups if known
  availability: 'in stock' | string // Extend with other availability statuses as needed
  availability_circle_origin_latitude: number
  availability_circle_origin_longitude: number
  availability_circle_radius: number
  availability_circle_radius_unit: 'KM' | string // Extend units if necessary
  availability_polygon_coordinates_latitude: number[]
  availability_polygon_coordinates_longitude: number[]
  brand: string
  business: number
  color: string
  condition: 'good' | string // Extend conditions if necessary
  created_at: string // ISO date string
  description: string
  fb_product_category: string
  gender: 'unisex' | string // Extend genders if necessary
  google_product_category: string
  id: number
  image_link: string
  item_group_id: string
  link: string
  material: string
  menu_number: string
  pattern: string
  price: string // Consider using a number if possible
  quantity_to_sell_on_facebook: number
  restaurant: number
  sale_price: string
  sale_price_effective_date: string
  shipping: string
  shipping_weight: string // Consider using a more specific type if possible
  size: string
  sku: string
  status: 'pending' | string // Extend statuses if necessary
  style: string
  title: string
  type: SizeMenuDataTypeObject
  updated_at: string // ISO date string
  video_url: string
}
