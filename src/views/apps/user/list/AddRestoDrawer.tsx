// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { useRouter } from 'next/navigation'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Component Imports
import { useForm } from 'react-hook-form'

import toast, { Toaster } from 'react-hot-toast'

import CustomTextField from '@core/components/mui/TextField'
import type { ResturantDataType } from '@/api/interface/resturantInterface'
import { createResturant } from '@/api/resturant'

import Loader from '@/components/loader/Loader'
import { getAllBusiness } from '@/api/business'
import type { BusinessType } from '@/types/apps/businessTypes'

type Props = {
  open: boolean
  handleClose: () => void
  // dictionary: any
}

const AddRestoDrawer = ({ open, handleClose }: Props) => {
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<BusinessType[]>([])
  const [menuData, setMenuData] = useState<BusinessType[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<ResturantDataType>()

  // States
  const onSubmit = (data: ResturantDataType, e: any) => {
    e.preventDefault()

    setLoading(true)

    createResturant(data)
      .then(res => {
        console.log(res, 'register restorant')
        toast.success('Outlet registerd successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        handleClose()
        reset()
        // router.replace('/home')
      })
      .catch(error => {
        console.log(error, 'error in register resto')
        toast.error(error?.data?.detail, {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
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

        setData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
      } finally {
        // setLoading(false)
      }
    }

    fetchBusiness()
  }, [])

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
        <Typography variant='h5'>Add Outlet</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
          <CustomTextField
            label='Name *'
            fullWidth
            placeholder='Enter Resturant Name'
            {...register('name', { required: 'Name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <CustomTextField
            label='Postal Code Delivery *'
            fullWidth
            placeholder='Enter Postalcode Delivery'
            {...register('postal_code_delivery', { required: 'Postal Code Delivery is required' })}
            error={!!errors.postal_code_delivery}
            helperText={errors.postal_code_delivery?.message}
          />
          <CustomTextField
            label='City *'
            fullWidth
            placeholder='Enter City Name'
            {...register('city', { required: 'city is required' })}
            error={!!errors.city}
            helperText={errors.city?.message}
          />

          <CustomTextField
            label='Cuisine Type *'
            fullWidth
            placeholder='Enter Cuisine Type'
            {...register('cuisine_type', { required: 'Cuisine Type is required' })}
            error={!!errors.cuisine_type}
            helperText={errors.cuisine_type?.message}
          />

          <CustomTextField
            label='Contact number *'
            type='number'
            fullWidth
            placeholder='(397) 294-5153'
            {...register('contact_number', { required: 'Contact number is required' })}
            error={!!errors.contact_number}
            helperText={errors.contact_number?.message}
          />
          <CustomTextField
            label='Description *'
            fullWidth
            placeholder='Enter description'
            {...register('description', { required: 'Description is required' })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <CustomTextField
            label='Catalog link *'
            fullWidth
            placeholder='Enter Catalog Link'
            {...register('catalog_link', { required: 'Catalog Link is required' })}
            error={!!errors.catalog_link}
            helperText={errors.catalog_link?.message}
          />

          <CustomTextField
            select
            fullWidth
            id='business'
            label='Select Business *'
            inputProps={{ placeholder: 'Select Business', ...register('business') }}
            error={!!errors.business}
            helperText={errors.business?.message}
          >
            {data &&
              data?.map(user => (
                <MenuItem key={user.business_id} value={user.id}>
                  {user.business_id}
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

export default AddRestoDrawer
