export interface FeedToChatGptType {
  id: number
  business: number
  name: string
  website_url?: string // Typo in property name, should be corrected if intentional
  api_url: string
  file: FileList
  user_name: string
  password: string
  desc: string
  is_file?: boolean
  username: string
}

export interface FeedToChatGptFileType {
  id: number
  business: number
  name: string
  website_url?: string // Typo in property name, should be corrected if intentional
  api_url: string
  file: string
  user_name: string
  password: string
  desc: string
  is_file?: boolean
  username: string
}
