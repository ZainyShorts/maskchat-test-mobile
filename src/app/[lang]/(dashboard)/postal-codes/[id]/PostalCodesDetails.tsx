// MUI Imports
'use client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import { useEffect, useState } from 'react'

import { getPostalCodeById } from '@/api/postalCodes'
import { postalCodesDataType } from '@/api/interface/postalCodesInterface'

type PostalCodesDetailsProps = {
  id: string
}

// MenuDataType
const PostalCodesDetails = ({ id }: PostalCodesDetailsProps) => {
  const [postalCodeItemData, setPostalCodesItemData] = useState<postalCodesDataType | null>(null)
  // Vars

  useEffect(() => {
    const fetchPostalCode = async () => {
      try {
        const response = await getPostalCodeById(Number(id))
        console.log(response?.data, 'response Of Single getPostalCodeById------')
        setPostalCodesItemData(response?.data)

        // setOrderAddress(response?.data?.address)
        // setOrderItemsData(response?.data?.order_items)
      } catch (error: any) {
        // Handle error
      }
    }
    fetchPostalCode()
  }, [id])

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div>
            <Typography variant='h5'>Postal Codes Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business:
                </Typography>
                <Typography>{postalCodeItemData && postalCodeItemData?.business}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  City:
                </Typography>
                <Typography>{postalCodeItemData && postalCodeItemData?.city}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Postal Code:
                </Typography>
                <Typography>{postalCodeItemData && postalCodeItemData?.code}</Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default PostalCodesDetails
