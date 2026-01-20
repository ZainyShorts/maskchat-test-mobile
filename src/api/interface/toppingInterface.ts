export interface BusinessObjectType {
  id: number
  name: string
  business_address: string
  business_desc: string
  business_doc: string
  business_id: number
  business_initial: string
  contact_number: string
}

export interface ToppingDataType {
  id: number
  name: string
  business: number
  // business: BusinessObjectType
  description: string
  additional_price: string
  active?: boolean
  // type?: ToppingTypeDataType
  type: number
}

export interface ToppingDataTypeWithObjects {
  id: number
  name: string
  // business: number
  business: BusinessObjectType
  description: string
  additional_price: string
  active?: boolean
  type?: ToppingTypeDataType
  // type: number
}

export interface ToppingTypeDataType {
  id: number
  name: string
  description: string
}
