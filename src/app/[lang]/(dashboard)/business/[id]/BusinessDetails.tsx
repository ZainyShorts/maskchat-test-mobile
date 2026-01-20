// MUI Imports
'use client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useEffect, useState } from 'react'
import { BusinessType, BusinessTypeForFile } from '@/types/apps/businessTypes'
import { getBusinessById } from '@/api/business'

type PreviewChatGptProps = {
  id: string
}

// MenuDataType
const BusinessDetails = ({ id }: PreviewChatGptProps) => {
  const [businessItemData, setBusinessItemData] = useState<BusinessTypeForFile | null>(null)
  // Vars

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getBusinessById(Number(id))
        // console.log(response?.data, 'response Of BusinessById------')
        setBusinessItemData(response?.data)
        // setOrderAddress(response?.data?.address)
        // setOrderItemsData(response?.data?.order_items)
      } catch (error: any) {
        console.log(error, 'error')

        // Handle error
      }
    }
    fetchBusiness()
  }, [id])

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div>
            <Typography variant='h5'>Business Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business Meta Id:
                </Typography>
                <Typography>{businessItemData && businessItemData.business_id}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business Document :
                </Typography>
                <Typography>{businessItemData && businessItemData?.business_doc}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business Initails :
                </Typography>
                <Typography>{businessItemData && businessItemData?.business_initial}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Contact Number :
                </Typography>
                <Typography>{businessItemData && businessItemData?.contact_number}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business Address:
                </Typography>
                <Typography color='text.primary'>{businessItemData && businessItemData.business_address}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business Description:
                </Typography>
                <Typography color='text.primary'>{businessItemData && businessItemData.business_desc}</Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default BusinessDetails
