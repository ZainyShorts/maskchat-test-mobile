// MUI Imports
'use client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Component Imports

import { useEffect, useState } from 'react'
import { getMenuById } from '@/api/menu'
import { MenuDataType } from '@/api/interface/menuIterface'

type PreviewMenuProps = {
  id: string
}

const MenuDetails = ({ id }: PreviewMenuProps) => {
  const [menuItemData, setMenuItemData] = useState<MenuDataType | null>(null)
  // Vars

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await getMenuById(Number(id))

        setMenuItemData(response?.data)
      } catch (error: any) {
        // Handle error
      }
    }
    fetchMenu()
  }, [id])

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div>
            <Typography variant='h5'>Catalouge Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Title:
                </Typography>
                <Typography>{menuItemData && menuItemData.title}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Description:
                </Typography>
                <Typography>{menuItemData && menuItemData.description}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Availability:
                </Typography>
                <Typography>{menuItemData && menuItemData.availability}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Status:
                </Typography>
                <Typography color='text.primary'>{menuItemData && menuItemData.status}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Category:
                </Typography>
                <Typography color='text.primary'>{menuItemData && menuItemData.category}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Price:
                </Typography>
                <Typography color='text.primary'>{menuItemData && menuItemData.price}</Typography>
              </div>

              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Brand:
                </Typography>
                <Typography color='text.primary'>{menuItemData && menuItemData.brand}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Sku:
                </Typography>
                <Typography color='text.primary'>{menuItemData && menuItemData.sku}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Business:
                </Typography>
                <Typography color='text.primary'>{menuItemData && menuItemData.business}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Link:
                </Typography>
                <Typography color='text.primary'>{menuItemData && menuItemData.link}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Image link:
                </Typography>
                <Typography color='text.primary'>{menuItemData && menuItemData.image_link}</Typography>
              </div>
            </div>
          </div>
          <div className='flex gap-4 justify-center'></div>
        </CardContent>
      </Card>
    </>
  )
}

export default MenuDetails
