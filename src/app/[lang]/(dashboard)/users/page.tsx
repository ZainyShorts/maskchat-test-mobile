import type { Metadata } from 'next'

import Users from '@/views/Users'

export const metadata: Metadata = {
  title: 'Users',
  description: 'All Users'
}

const UsersPage = () => {
  return <Users />
}

export default UsersPage
