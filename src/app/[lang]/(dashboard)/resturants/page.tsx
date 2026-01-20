import type { Metadata } from 'next'

import ResturantsList from '@/views/Resturants'

export const metadata: Metadata = {
  title: 'Resturants',
  description: 'All Resturants'
}

const ResturantsPage = () => {
  return <ResturantsList />
}

export default ResturantsPage
