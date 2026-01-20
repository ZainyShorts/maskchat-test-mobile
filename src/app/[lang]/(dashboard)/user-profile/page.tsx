import type { Metadata } from 'next'

import UserProfilePage from '@/views/UserProfile'

export const metadata: Metadata = {
  title: 'User Profile',
  description: 'User Profile'
}

const UserProfile = () => {
  return <UserProfilePage />
}

export default UserProfile
