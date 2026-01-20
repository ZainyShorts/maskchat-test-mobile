import React from 'react'
import PrintPageClient from '@/components/PrintPageClient'

interface PageProps {
  params: {
    id: string
  }
}

const Page = ({ params }: PageProps) => {
  return <PrintPageClient id={params.id} />
}

export default Page
