// MUI Imports
'use client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useEffect, useState } from 'react'
import { ResturantDataType } from '@/api/interface/resturantInterface'
import { getRestaurantById } from '@/api/resturant'

type PreviewResturantDetailsProps = {
  id: string
}

// MenuDataType
const ResturantDetails = ({ id }: PreviewResturantDetailsProps) => {
  const [resturantItemData, setResturantItemData] = useState<ResturantDataType | null>(null)
  // Vars

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await getRestaurantById(Number(id))
        console.log(response?.data, 'response Of getRestaurantById------')
        setResturantItemData(response?.data)
        // setOrderAddress(response?.data?.address)
        // setOrderItemsData(response?.data?.order_items)
      } catch (error: any) {
        console.log(error, 'error')

        // Handle error
      }
    }
    fetchRestaurant()
  }, [id])

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div>
            <Typography variant='h5'>Resturant Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Name:
                </Typography>
                <Typography>{resturantItemData && resturantItemData.name}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  City:
                </Typography>
                <Typography>{resturantItemData && resturantItemData.city}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Catalog Link:
                </Typography>
                <Typography>{resturantItemData && resturantItemData.catalog_link}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Postal Code Delivery:
                </Typography>
                <Typography>{resturantItemData && resturantItemData.postal_code_delivery}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Cuisine Type :
                </Typography>
                <Typography>{resturantItemData && resturantItemData?.cuisine_type}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Contact Number
                </Typography>
                <Typography color='text.primary'>{resturantItemData && resturantItemData.contact_number}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Description:
                </Typography>
                <Typography color='text.primary'>{resturantItemData && resturantItemData.description}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business Id:
                </Typography>
                <Typography color='text.primary'>
                  {resturantItemData && resturantItemData.business?.business_id}
                </Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default ResturantDetails
