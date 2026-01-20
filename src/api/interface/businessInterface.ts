export interface CurrencyObject {
  id: number
  code: string
  label: string
  symbol: string
}

export interface BusinessDataTypeForAddBusiness {
  id?: number
  business_id: string
  business_address: string
  business_desc: string
  business_access_token: string
  whatsapp_varification_token: string
  business_doc: FileList
  contact_number: string
  first_name?: string
  user: number
  created_at: Date
  updated_at: Date
  business_initial: string
  app_code: string
  business_email: string
  name: string
  logo?: FileList
  mail_server?: string
  custom_mail_server?: string
  currency: CurrencyObject
  marketing_template_url: string
  feedback?: boolean
  client_id?: string
}

export interface BusinessDataType {
  id: number
  business_id: string
  business_address: string
  business_desc: string
  business_access_token: string
  whatsapp_varification_token: string
  business_doc: FileList
  contact_number: string
  first_name?: string
  user: UserInterfaceItem
}

export interface UserInterfaceItem {
  id: number
  name: string | null
}

// Interface for Business data
export interface BusinessTypeForGettingBussiness {
  business_address: string
  business_desc: string
  business_id: string
  business_initial: string
  contact_number: string
  created_at: string
  id: number
  updated_at: string
  user: UserType
}

// Interface for User data inside Business
interface UserType {
  createdAt: string
  email: string
  id: number
  name: string | null
  status: string
  user_id: string | null
}
