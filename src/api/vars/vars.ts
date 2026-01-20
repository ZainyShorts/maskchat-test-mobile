export function getBaseUrl(): string {
  // const baseUrl = 'https://kosmosbackend.themaskchat.com/api/'
  // const baseUrl = 'http://127.0.0.1:8000/api/' 
  const baseUrl = 'http://192.168.18.55:8000/api/' 
  // const baseUrl = 'https://l8wlljm3-8000.inc1.devtunnels.ms/api/'
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
}

export function getWebSocketUrl(): string {
  // return 'wss://kosmosbackend.themaskchat.com'
  return 'ws://127.0.0.1:8001'
}

export function iframeURL(): string{
  // if(getBaseUrl() == 'https://kosmosbackend.themaskchat.com/api/'){
    return 'https://kosmos.themaskchat.com'
  // }else{
    // return 'http://127.0.0.1:3000'
  // }
}

export function getBaseUrlForOAuth(): string {
  const baseUrl = 'https://kosmosbackend.themaskchat.com/api/'
  // const baseUrl = 'https://l8wlljm3-8000.inc1.devtunnels.ms/api/'
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
}


export const ENDPOINTS = {
  import_csv: 'import-csv',
  paypal_confirm_subscription: 'paypal_confirm_subscription',
  renewSubscription: 'renew-subscription',
  cancelSubscription: 'cancel-subscription',
  subscription: 'subscription',
  invoices: 'invoices',
  stripeCheckout: 'create-checkout-session',
  login: 'login',
  logout: 'logout',
  register: 'register',
  user: 'user',
  verify: 'verify',
  posuser: 'posuser',
  users: 'users',
  restaurants: 'restaurants',
  restaurant: 'restaurant',
  orders: 'orders',
  createOrder: 'orders/create',
  userbusinesses: 'userbusinesses',
  menus: 'menus',
  products: 'products',
  forgotPassword: 'forgot-password',
  resetPassword: 'reset-password',
  updatePassword: 'update-password',
  userTypes: 'user-types',
  syncMenuMeta: 'save-changes',
  whatsapp: 'whatsapp',
  feedToChatGPT: 'feed-to-gpt',
  postalCodes: 'postal-codes',
  instagram: 'instagram',
  facebook: 'messenger',
  telegram: 'telegram',
  whatsAppQR: 'whatsapp-qr',
  chatgpt: 'chatgpt',
  returnOrders: 'return-orders',
  menuSearch: 'menu-search',
  orderSearch: 'order-search',
  returnOrder: 'return-order',
  topping: 'toppings',
  toppings: 'toppings/by-business',
  toppingsize: 'sizes/by-business',
  types: 'food-types',
  foodTypesByBusiness: 'food-types/by-business',
  businessMenues: 'menus/filter_by_business_and_type',
  sizes: 'sizes',
  createFlow: 'create-flow',
  createTemplate: 'create-template',
  facebookTemplates: 'facebook-templates/by-business',
  facebookFlows: 'facebook-flows/by-business',
  currencies: 'currencies',
  shopify: 'shopify',
  getCustomer:'customer',
  syncShopifyData:'sync'
}
