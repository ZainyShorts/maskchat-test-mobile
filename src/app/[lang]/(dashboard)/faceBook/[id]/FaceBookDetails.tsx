// MUI Imports
'use client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Type Imports
import type { ThemeColor } from '@core/types'

import { useEffect, useState } from 'react'

import { getFaceBookById } from '@/api/facebook'
import { MessengerDataType } from '@/api/interface/facebookInterface'

type PreviewFaceBookProps = {
  id: string
}

// MenuDataType
const FaceBookDetails = ({ id }: PreviewFaceBookProps) => {
  const [faceBookItemData, setFaceBookItemData] = useState<any | null>(null)
  // Vars

  useEffect(() => {
    const fetchFaceBookData = async () => {
      try {
        const response = await getFaceBookById(Number(id))
        // console.log(response?.data, 'response Of Single Whats App------')
        setFaceBookItemData(response?.data)

        // setOrderAddress(response?.data?.address)
        // setOrderItemsData(response?.data?.order_items)
      } catch (error: any) {
        // Handle error
      }
    }
    fetchFaceBookData()
  }, [id])

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div>
            <Typography variant='h5'>FaceBook Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business
                </Typography>
                <Typography>{faceBookItemData && faceBookItemData.business}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  FaceBook Id
                </Typography>
                <Typography>{faceBookItemData && faceBookItemData.facebook_id}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Access Token
                </Typography>
                <Typography>{faceBookItemData && faceBookItemData.access_token}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Status
                </Typography>
                <Typography color='text.primary'>
                  {faceBookItemData && faceBookItemData.active ? 'active' : ''}
                </Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Web Hook Token
                </Typography>
                <Typography color='text.primary'>{faceBookItemData && faceBookItemData.webhook_token}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  FaceBook Account Id
                </Typography>
                <Typography color='text.primary'>{faceBookItemData && faceBookItemData.facebook_account_id}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Catalog Id
                </Typography>
                <Typography color='text.primary'>{faceBookItemData && faceBookItemData.catalog_id}</Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default FaceBookDetails
