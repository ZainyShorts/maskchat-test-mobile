export interface ChatGptType {
  id: number
  business: number
  gpt_api_key: string
  desc?: string // Typo in property name, should be corrected if intentional
  active?: boolean
}
