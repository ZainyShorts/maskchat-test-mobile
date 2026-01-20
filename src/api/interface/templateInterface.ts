export interface FaceBookTemplateDataType {
  id: number
  business: number
  flow: number
  type: number
  template_id: string
  template_name: string
  status: string
}

export interface FaceBookFlowDataType {
  id: number
  flow_id: string
  flow_name: string
  status: string
  is_menu_flow: false
  is_address_flow: true
  menu: null
  business: 3
  type: null
}
