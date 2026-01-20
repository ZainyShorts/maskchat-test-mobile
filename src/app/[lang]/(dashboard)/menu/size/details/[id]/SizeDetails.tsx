// MUI Imports
'use client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useEffect, useState } from 'react'
import { getMenuSizeById } from '@/api/size'
import { SizeDataType } from '@/api/interface/sizeInterface'

type SizeDetailsProps = {
  id: string
}

// MenuDataType
const SizeDetails = ({ id }: SizeDetailsProps) => {
  const [menuSizeItemData, setMenuSizeItemData] = useState<SizeDataType | null>(null)
  // Vars

  useEffect(() => {
    const fetchMenuSize = async () => {
      try {
        const response = await getMenuSizeById(Number(id))

        setMenuSizeItemData(response?.data)
      } catch (error: any) {
        console.log(error?.data)

        // Handle error
      }
    }
    fetchMenuSize()
  }, [id])

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div>
            <Typography variant='h5'>Size Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Size :
                </Typography>
                <Typography>{menuSizeItemData && menuSizeItemData?.name}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Menu :
                </Typography>
                <Typography>{menuSizeItemData && menuSizeItemData?.menu?.title}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Additional Price:
                </Typography>
                <Typography>{menuSizeItemData && menuSizeItemData?.additional_price}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Description:
                </Typography>
                <Typography>{menuSizeItemData && menuSizeItemData?.description}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Status:
                </Typography>
                <Typography>{menuSizeItemData && menuSizeItemData?.active ? 'Active' : 'InActive'}</Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default SizeDetails
