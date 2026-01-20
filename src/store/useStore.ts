

import { create } from 'zustand'

import type { UserFromLocalStorage } from '@/api/interface/userInterface'

// Define the state types
interface StoreState {
  loggedInUser: UserFromLocalStorage | null
  setLoggedInUser: (loggedInUser: UserFromLocalStorage | null) => void
}

// Create the store
const useStore = create<StoreState>(set => ({
  loggedInUser: null,
  setLoggedInUser: (loggedInUser: UserFromLocalStorage | null) => set({ loggedInUser })
}))

export default useStore
