// React Imports

// MUI Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import type { ButtonProps } from '@mui/material/Button'
import type { ThemeColor } from '@core/types'

// Component Imports

import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import CustomTextField from '@core/components/mui/TextField'
import type { MenuDataType } from '@/api/interface/menuIterface'
import { createMenu } from '@/api/menu'
import Loader from '@/components/loader/Loader'
import { getAllResturants } from '@/api/resturant'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/types/apps/businessTypes'
import AddType from '@/components/dialogs/add-type'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import { getAllFoodTypes } from '@/api/foodTypes'
import { ToppingDataType } from '@/api/interface/toppingInterface'

type Props = {
  open: boolean
  handleClose: () => void
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

const AddMenuDrawer = ({ open, handleClose }: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [restosData, setRestosData] = useState<BusinessType[]>([])
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [FoodTypeData, setFoodTypeData] = useState<ToppingDataType[]>([])
  const [addType, setAddType] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<MenuDataType>()

  const fetchFoodTypes = async () => {
    try {
      const response = await getAllFoodTypes()

      setFoodTypeData(response?.data?.results)
    } catch (error: any) {
      // Handle error
    }
  }

  useEffect(() => {
    fetchFoodTypes()
  }, [addType])

  // States
  const onSubmit = (data: MenuDataType, e: any) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...data,
      title: data.title,
      brand: data.brand,
      description: data.description,
      availability: 'in stock',
      condition: 'good',
      business: data.business,
      restaurant: data.restaurant,
      image_link: data.image_link,
      link: data.link,
      price: data.price,
      sku: data.sku,
      type: data.type
    }

    createMenu(payload)
      .then(res => {
        toast.success('Menu created successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        handleClose()
        setAddType(true)
        reset()
      })
      .catch(error => {
        if (error?.data && error?.data?.availability[0]) {
          toast.error(error?.data?.availability[0], {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        } else {
          toast.error('Error in creating Menu', {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        }
      })
      .finally(() => {
        setLoading(false)
        reset()
      })
  }

  const handleReset = () => {
    handleClose()
    reset()
  }

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()

        setUserBusinessData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch business')
      } finally {
        // setLoading(false)
      }
    }

    fetchBusiness()
  }, [])

  useEffect(() => {
    const fetchResturants = async () => {
      try {
        const response = await getAllResturants()

        setRestosData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
      } finally {
        // setLoading(false)
      }
    }

    fetchResturants()
  }, [])

  const handleTypeAdded = () => {
    fetchFoodTypes()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Add Menu</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
          <CustomTextField
            label='Title *'
            fullWidth
            placeholder='Enter Title'
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <CustomTextField
            label='sku *'
            fullWidth
            placeholder='Enter sku'
            {...register('sku', { required: 'sku is required' })}
            error={!!errors.sku}
            helperText={errors.sku?.message}
          />

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CustomTextField
              select
              fullWidth
              label='Select Food Type *'
              {...register('type', {
                required: 'Food Type is required'
              })}
              error={!!errors.business}
              helperText={errors.business?.message}
              style={{ flex: 1 }} // Takes up remaining space
            >
              {FoodTypeData &&
                FoodTypeData?.map(food => (
                  <MenuItem key={food.id} value={food.id}>
                    {food.name}
                  </MenuItem>
                ))}
            </CustomTextField>

            <div style={{ marginLeft: '10px', marginTop: errors.title ? '15px' : '15px', flex: '0 0 10%' }}>
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps('Add', 'primary', 'contained')}
                dialog={AddType}
                dialogProps={{}}
                onTypeAdded={handleTypeAdded} // Pass the callback
              />
            </div>
          </div>

          <CustomTextField
            label='Brand *'
            fullWidth
            placeholder='Enter Brand Name'
            {...register('brand', { required: 'Brand Name is required' })}
            error={!!errors.brand}
            helperText={errors.brand?.message}
          />

          <CustomTextField
            label='Price *'
            fullWidth
            placeholder='Enter  price '
            {...register('price', {
              required: 'Price is required',
              pattern: {
                // This pattern allows:
                // 1. Optional currency symbol at start or end
                // 2. Numbers with up to 2 decimal places
                // 3. Optional thousands separators (both , and .)
                // 4. Spaces between currency symbol and number
                value:
                  /^(?:[\p{Sc}$€¥£₹₽₪₱₩₫₭₮₯₰₲₳₴₵₶₷₸₺₻₼₾₿]?\s*[0-9]{1,3}(?:[,.][0-9]{3})*(?:\.[0-9]{1,2})?\s*(?:[\p{Sc}$€¥£₹₽₪₱₩₫₭₮₯₰₲₳₴₵₶₷₸₺₻₼₾₿]|[A-Za-z]{3})?)$/u,
                message: 'Please enter a valid price with an optional currency symbol or abbreviation'
              }
            })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />

          <CustomTextField
            label='Description *'
            fullWidth
            placeholder='Enter Description '
            {...register('description', { required: 'Description is required ' })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <CustomTextField
            label='Product Link *'
            fullWidth
            placeholder='Enter Product link '
            {...register('link', { required: 'Product Link is required ' })}
            error={!!errors.link}
            helperText={errors.link?.message}
          />
          <CustomTextField
            label='Image link *'
            fullWidth
            placeholder='Enter Image link '
            {...register('image_link', { required: 'Image link is required ' })}
            error={!!errors.image_link}
            helperText={errors.image_link?.message}
          />

          <CustomTextField
            select
            fullWidth
            id='restaurant'
            label='Select restaurant (Optional)'
            inputProps={{ placeholder: 'Restaurant', ...register('restaurant') }}
          >
            {restosData &&
              restosData?.map(rest => (
                <MenuItem key={rest.id} value={rest.id}>
                  {rest.name}
                </MenuItem>
              ))}
          </CustomTextField>

          <CustomTextField
            select
            fullWidth
            id='business'
            label='Select Business *'
            // inputProps={{ placeholder: 'Business', ...register('business') }}
            {...register('business', { required: 'Business Id is required ' })}
            error={!!errors.business}
            helperText={errors.business?.message}
          >
            {userBusinessData &&
              userBusinessData?.map(business => (
                <MenuItem key={business.id} value={business.id}>
                  {business.business_id}
                </MenuItem>
              ))}
          </CustomTextField>

          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit' disabled={loading}>
              Submit
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
          {loading && <Loader />}
        </form>
        <Toaster />
      </div>
    </Drawer>
  )
}

export default AddMenuDrawer
