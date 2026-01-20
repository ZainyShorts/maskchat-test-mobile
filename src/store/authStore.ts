import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Define the shape of the user object
interface User {
  id: number
  first_name: string
  last_name: string
  address: string
  email: string
  isLoggedIn: boolean
  createdAt: string
  deleted: boolean
  postalCode: string
  status: string
  user_type: string
  name: string
  country: string
  city: string
  mobile: number | string
  phoneNumber: number | string
  subscription: boolean
}

// Define the shape of the AuthState
interface AuthState {
  editFlag: boolean
  token: string | null
  user: User | null
  whatsAppData: any
  facebookData: any
  instagramData: any
  telegramData: any
  feedgptData: any
  chatGptData: any
  businessData: any
  menuData: any
  toppingData: any
  resturantData: any
  orderData: any
  postalCodesData: any
  returnOrderData: any
  userData: any
  menuSizeData: any
  setEditFlag: (editFlag: boolean) => void
  setToken: (token: string) => void
  setUser: (user: User) => void
  clearAuth: () => void
  whatsAppAction: (whatsAppData: any) => void
  facebookAction: (facebookData: any) => void
  instagramAction: (instagramData: any) => void
  telegramAction: (telegramData: any) => void
  feedgptAction: (feedgptData: any) => void
  chatGptAction: (chatGptData: any) => void
  businessAction: (businessData: any) => void
  menuAction: (menuData: any) => void
  menuSizeAction: (menuSizeData: any) => void
  toppingAction: (toppingData: any) => void
  resturantAction: (resturantData: any) => void
  orderAction: (orderData: any) => void
  postalCodesAction: (postalCodesData: any) => void
  returnOrderAction: (returnOrderData: any) => void
  userAction: (userData: any) => void
}



// Create the store with persistence for both token and user
export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      editFlag: false,
      token: null,
      user: null,
      whatsAppData: [],
      facebookData: [],
      instagramData: [],
      telegramData: [],
      feedgptData: [],
      chatGptData: [],
      businessData: [],
      menuData: [],
      menuSizeData: [],
      resturantData: [],
      orderData: [],
      postalCodesData: [],
      returnOrderData: [],
      userData: [],
      toppingData: [],
      setEditFlag: (editFlag: boolean) => ({ editFlag }),
      setToken: (token: string) => set(() => ({ token })),
      setUser: (user: User) => set(() => ({ user })),
      clearAuth: () => set(() => ({ token: null, user: null })),
      whatsAppAction: (whatsAppData: any) => set(() => ({ whatsAppData })),
      facebookAction: (facebookData: any) => set(() => ({ facebookData })),
      instagramAction: (instagramData: any) => set(() => ({ instagramData })),
      telegramAction: (telegramData: any) => set(() => ({ telegramData })),
      feedgptAction: (feedgptData: any) => set(() => ({ feedgptData })),
      chatGptAction: (chatGptData: any) => set(() => ({ chatGptData })),
      businessAction: (businessData: any) => set(() => ({ businessData })),
      menuAction: (menuData: any) => set(() => ({ menuData })),
      menuSizeAction: (menuSizeData: any) => set(() => ({ menuSizeData })),
      toppingAction: (toppingData: any) => set(() => ({ toppingData })),
      resturantAction: (resturantData: any) => set(() => ({ resturantData })),
      orderAction: (orderData: any) => set(() => ({ orderData })),
      postalCodesAction: (postalCodesData: any) => set(() => ({ postalCodesData })),
      returnOrderAction: (returnOrderData: any) => set(() => ({ returnOrderData })),
      userAction: (userData: any) => set(() => ({ userData }))
    }),
    {
      name: 'auth-storage', // Name of the localStorage key
      storage: createJSONStorage(() => localStorage) // Use createJSONStorage for JSON handling
    }
  )
)
