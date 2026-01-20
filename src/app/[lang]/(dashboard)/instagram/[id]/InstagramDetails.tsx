// MUI Imports
'use client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import Divider from '@mui/material/Divider'

import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports

import { useEffect, useState } from 'react'

import { InstagramDataType } from '@/api/interface/instagramInterface'
import { getInstgramById } from '@/api/instagram'

type PreviewInstagramProps = {
  id: string
}

// MenuDataType
const InstagramDetails = ({ id }: PreviewInstagramProps) => {
  const [instagramItemData, setInstagramItemData] = useState<any | null>(null)
  // Vars
  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  useEffect(() => {
    const fetchInstaGram = async () => {
      try {
        const response = await getInstgramById(Number(id))
        // console.log(response?.data, 'response Of Single Whats App------')
        setInstagramItemData(response?.data)

        // setOrderAddress(response?.data?.address)
        // setOrderItemsData(response?.data?.order_items)
      } catch (error: any) {
        // Handle error
      }
    }
    fetchInstaGram()
  }, [id])

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div>
            <Typography variant='h5'>Instagram Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business
                </Typography>
                <Typography>{instagramItemData && instagramItemData.business}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Instagram Id
                </Typography>
                <Typography>{instagramItemData && instagramItemData?.instagram_id}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Account Id
                </Typography>
                <Typography>{instagramItemData && instagramItemData?.account_id}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Feed to gpt
                </Typography>
                <Typography color='text.primary'>{instagramItemData && instagramItemData?.feed_to_gpt}</Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default InstagramDetails
