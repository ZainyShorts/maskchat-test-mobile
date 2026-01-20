// MUI Imports
'use client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import type { ThemeColor } from '@core/types'

import { useEffect, useState } from 'react'
import { getFeedToGptById } from '@/api/feedToChatGPT'
import { FeedToChatGptType } from '@/api/interface/interfaceFeedToGPT'

type PreviewWhatsAppProps = {
  id: string
}

// MenuDataType
const FeedToGptDetails = ({ id }: PreviewWhatsAppProps) => {
  const [feedToGptItemData, setFeedToGptItemData] = useState<FeedToChatGptType | null>(null)
  // Vars
  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  useEffect(() => {
    const fetchFeedToGpt = async () => {
      try {
        const response = await getFeedToGptById(Number(id))
        console.log(response?.data, 'response Of fetchFeedToGpt------')
        setFeedToGptItemData(response?.data)
        // setOrderAddress(response?.data?.address)
        // setOrderItemsData(response?.data?.order_items)
      } catch (error: any) {
        console.log(error, 'error')

        // Handle error
      }
    }
    fetchFeedToGpt()
  }, [id])

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div>
            <Typography variant='h5'>Feed to gpt Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business
                </Typography>
                <Typography>{feedToGptItemData && feedToGptItemData.business}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Name
                </Typography>
                <Typography>{feedToGptItemData && feedToGptItemData.name}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Website Url
                </Typography>
                <Typography>{feedToGptItemData && feedToGptItemData.website_url}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Api Url
                </Typography>
                <Typography color='text.primary'>{feedToGptItemData && feedToGptItemData.api_url}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Description
                </Typography>
                <Typography color='text.primary'>{feedToGptItemData && feedToGptItemData.desc}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  User Name
                </Typography>
                <Typography color='text.primary'>{feedToGptItemData && feedToGptItemData.user_name}</Typography>
              </div>
              {/* <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Catalog Id
                </Typography>
                <Typography color='text.primary'>{feedToGptItemData && feedToGptItemData.catalog_id}</Typography>
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default FeedToGptDetails
