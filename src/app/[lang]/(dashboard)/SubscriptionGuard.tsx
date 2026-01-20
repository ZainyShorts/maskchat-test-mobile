'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

interface Props {
  children: React.ReactNode
}

const SubscriptionGuard = ({ children }: Props) => {
  const router = useRouter()
  const { user } = useAuthStore()
    console.log('user in dashboard', user)
  
    if(user && user?.subscription == false){
      router.replace('/en/account-settings')
    }

//   if (loading) return <div className="text-center p-10">Loading...</div>

  return children
}

export default SubscriptionGuard
