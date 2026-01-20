export interface WhatsAppDataType {
  id: number
  business: number
  name?: string
  api_url?: string
  desc?: string
  website_url?: string
  user_name?: string
  phone_id: string
  access_token?: string // Typo in property name, should be corrected if intentional
  webhook_token: string
  whatsapp_account_id: number
  catalog_id: string
  feed_to_gpt: number
  active: boolean
  category?: string
  primary_agent?: boolean
  phone_no?: boolean
}
