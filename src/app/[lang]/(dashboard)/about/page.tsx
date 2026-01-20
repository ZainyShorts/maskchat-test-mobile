'use client'

// Store Hook Import
import useStore from '@/store/useStore'

export default function Page() {
  // Destructuring loggedInUser from useStore
  const { loggedInUser } = useStore()

  // Render the About page
  return <h1>About page!</h1>
}
