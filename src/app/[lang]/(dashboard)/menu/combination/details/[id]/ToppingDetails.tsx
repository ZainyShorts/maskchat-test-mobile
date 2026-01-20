// MUI Imports
'use client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useEffect, useState } from 'react'
import { getToppingsById } from '@/api/toppings'
import { ToppingDataType, ToppingDataTypeWithObjects } from '@/api/interface/toppingInterface'

type ToppingDetailsProps = {
  id: string
}

// MenuDataType
const ToppingDetails = ({ id }: ToppingDetailsProps) => {
  const [toppingItemData, setToppingItemData] = useState<ToppingDataTypeWithObjects | null>(null)
  // Vars

  useEffect(() => {
    const fetchToppingsById = async () => {
      try {
        const response = await getToppingsById(Number(id))
        setToppingItemData(response?.data)
      } catch (error: any) {
        console.log(error?.data)
      }
    }
    fetchToppingsById()
  }, [id])

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div>
            <Typography variant='h5'>Topping Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Name:
                </Typography>
                <Typography>{toppingItemData && toppingItemData?.name}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Description:
                </Typography>
                <Typography>{toppingItemData && toppingItemData?.description}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business Id:
                </Typography>
                <Typography>{toppingItemData && toppingItemData?.business?.id}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Food Type:
                </Typography>
                <Typography>{toppingItemData && toppingItemData?.type?.name}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Additonal Price:
                </Typography>
                <Typography>{toppingItemData && toppingItemData?.additional_price}</Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default ToppingDetails
