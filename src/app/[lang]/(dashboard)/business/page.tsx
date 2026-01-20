import type { Metadata } from 'next'

import BusinessList from '@/views/Business'

export const metadata: Metadata = {
  title: 'Businesses',
  description: 'All Businesses'
}

const BusinessPage = () => {
  return <BusinessList />
}

export default BusinessPage
