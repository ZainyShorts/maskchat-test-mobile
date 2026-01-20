// MUI Imports
'use client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import EditUserInfo from '@components/dialogs/edit-user-info'
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import CustomAvatar from '@core/components/mui/Avatar'
import { useEffect, useState } from 'react'
import { getMenuById } from '@/api/menu'
import { MenuDataType } from '@/api/interface/menuIterface'
import { getFeedToChatGpt } from '@/api/feedToChatGPT'
import { GetWhatsApp } from '@/api/whatsapp'
import { WhatsAppDataType } from '@/api/interface/whatsappInterface'
import WhatsppAppListTable from '@/views/apps/user/list/WhatsAppListTable'

type PreviewMenuProps = {
  id: string
}
// Vars
const userData = {
  firstName: 'Seth',
  lastName: 'Hallam',
  title: '@shallamb',
  description: 'best burger',
  availability: 'yes',
  status: 'active',
  role: 'Subscriber',
  brand: 'Olx',
  condition: 'Good',
  business: 3,
  link: 'https://localhost',
  price: 300,
  sku: 'hello',
  image_link: 'tr',
  contact: '+1 (234) 464-0600',
  language: ['English'],
  country: 'France',
  useAsBillingAddress: true
}

// MenuDataType
// { id }: PreviewMenuProps
const WhatssAppDetails = () => {
  const [whatsAppFeedData, setWhatsAppFeedData] = useState<WhatsAppDataType | null>(null)
  // Vars
  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  useEffect(() => {
    const fetchWhatsAppFeed = async () => {
      try {
        const response = await GetWhatsApp()
        // console.log(response?.data?.results, 'response Of getFeedToChatGpt ------')
        setWhatsAppFeedData(response?.data?.results[0])

        // setOrderAddress(response?.data?.address)
        // setOrderItemsData(response?.data?.order_items)
      } catch (error: any) {
        // Handle error
      }
    }
    fetchWhatsAppFeed()
  }, [])

  // console.log(whatsAppFeedData, 'wuuuuu-------')

  return (
    <>
      <WhatsppAppListTable />
      {/* <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div>
            <Typography variant='h5'>Whatss App Details </Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business:
                </Typography>
                <Typography>{whatsAppFeedData && whatsAppFeedData.business}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Phone Id:
                </Typography>
                <Typography>{whatsAppFeedData && whatsAppFeedData.phone_id}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Access Token:
                </Typography>
                <Typography>{whatsAppFeedData && whatsAppFeedData.access_token}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Webhook Token
                </Typography>
                <Typography>{whatsAppFeedData && whatsAppFeedData.webhook_token}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Whatsapp Account Id:
                </Typography>
                <Typography>{whatsAppFeedData && whatsAppFeedData.whatsapp_account_id}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  catalog_id:
                </Typography>
                <Typography>{whatsAppFeedData && whatsAppFeedData.catalog_id}</Typography>
              </div>
            </div>
          </div>
          <div className='flex gap-4 justify-center'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Edit', 'primary', 'contained')}
              dialog={EditUserInfo}
              dialogProps={{ data: whatsAppFeedData }}
            />
           
          </div>
        </CardContent>
      </Card> */}
    </>
  )
}

export default WhatssAppDetails
