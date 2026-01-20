'use client'

import dynamic from 'next/dynamic'
// Khurram
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default Chart

