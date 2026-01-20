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
import EditMenuInfo from '@components/dialogs/edit-menu-info'
import EditWhatsAppInfo from '@components/dialogs/edit-whatsApp-info'
import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import CustomAvatar from '@core/components/mui/Avatar'
import { useEffect, useState } from 'react'
import { getMenuById } from '@/api/menu'
import { MenuDataType } from '@/api/interface/menuIterface'
import { WhatsAppDataType } from '@/api/interface/whatsappInterface'
import { getWhatsAppById } from '@/api/whatsapp'

type PreviewWhatsAppProps = {
  id: string
}

// MenuDataType
const WhatsAppDetails = ({ id }: PreviewWhatsAppProps) => {
  const [whatsAppItemData, setWhatsAppItemData] = useState<WhatsAppDataType | null>(null)
  // Vars
  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  useEffect(() => {
    const fetchWhats = async () => {
      try {
        const response = await getWhatsAppById(Number(id))
        // console.log(response?.data, 'response Of Single Whats App------')
        setWhatsAppItemData(response?.data)

        // setOrderAddress(response?.data?.address)
        // setOrderItemsData(response?.data?.order_items)
      } catch (error: any) {
        // Handle error
      }
    }
    fetchWhats()
  }, [id])

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div>
            <Typography variant='h5'>Whast App Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business
                </Typography>
                <Typography>{whatsAppItemData && whatsAppItemData.business}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Phone ID
                </Typography>
                <Typography>{whatsAppItemData && whatsAppItemData.phone_id}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Access Token
                </Typography>
                <Typography>{whatsAppItemData && whatsAppItemData.access_token}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Status
                </Typography>
                <Typography color='text.primary'>
                  {whatsAppItemData && whatsAppItemData.active ? 'active' : ''}
                </Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Web Hook Token
                </Typography>
                <Typography color='text.primary'>{whatsAppItemData && whatsAppItemData.webhook_token}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  WhatsApp Account Id
                </Typography>
                <Typography color='text.primary'>{whatsAppItemData && whatsAppItemData.whatsapp_account_id}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Catalog Id
                </Typography>
                <Typography color='text.primary'>{whatsAppItemData && whatsAppItemData.catalog_id}</Typography>
              </div>
            </div>
          </div>
          {/* <div className='flex gap-4 justify-center'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Edit', 'primary', 'contained')}
              dialog={EditWhatsAppInfo}
              dialogProps={{ data: whatsAppItemData }}
            />
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Suspend', 'error', 'tonal')}
              dialog={ConfirmationDialog}
              dialogProps={{ type: 'suspend-account' }}
            />
          </div> */}
        </CardContent>
      </Card>
    </>
  )
}

export default WhatsAppDetails
