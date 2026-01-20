import type { Metadata } from 'next'

import OrdersList from '@/views/Orders'

export const metadata: Metadata = {
  title: 'Orders',
  description: 'All Orders'
}

const OrdersPage = () => {
  return <OrdersList />
}

export default OrdersPage
