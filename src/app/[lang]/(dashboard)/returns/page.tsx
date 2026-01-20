import type { Metadata } from 'next'

import ReturnOrderListTable from '@/views/apps/user/list/ReturnOrderListTable'

export const metadata: Metadata = {
  title: 'Return',
  description: 'All Returns'
}

const ReturnPage = () => {
  return <ReturnOrderListTable />
}

export default ReturnPage
