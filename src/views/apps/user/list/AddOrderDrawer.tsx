// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { useParams, useRouter } from 'next/navigation'
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
import type { OrderDataType } from '@/api/interface/orderInterface'
import { createResturant, getAllResturants } from '@/api/resturant'
import { createOrder } from '@/api/order'
import Loader from '@/components/loader/Loader'
import { getAllUsers } from '@/api/user'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'

type Props = {
  open: boolean
  handleClose: () => void
}

const AddOrderDrawer = ({ open, handleClose }: Props) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<OrderDataType[]>([])
  const [restosData, setRestosData] = useState<OrderDataType[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<OrderDataType>()

  // States
  const onSubmit = (data: OrderDataType, e: any) => {
    e.preventDefault()

    setLoading(true)

    createOrder(data)
      .then(res => {
        toast.success('Order created successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })

        router.replace(getLocalizedUrl('/home', locale as Locale))
      })
      .catch(error => {
        if (error?.data && error?.data?.restaurant[0]) {
          toast.error(error?.data?.restaurant[0], {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        } else if (
          (error?.data && error?.data?.user[0],
          {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        ) {
          toast.error(error?.data?.user[0], {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        } else {
          toast.error('Error in creating order', {
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
    const fetchUsers = async () => {
      setLoading(true)

      try {
        const response = await getAllUsers()

        setData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchResturants = async () => {
      setLoading(true)

      try {
        const response = await getAllResturants()

        setRestosData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchResturants()
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
        <Typography variant='h5'>Add New Order</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
          <CustomTextField
            select
            fullWidth
            id='status'
            label='Select Status *'
            inputProps={{ placeholder: 'Status', ...register('status') }}
            error={!!errors.status}
            helperText={errors.status?.message}
          >
            <MenuItem value='pending'>Pending</MenuItem>
            <MenuItem value='confirmed'>Confirmed</MenuItem>
            <MenuItem value='cancelled'>Cancelled</MenuItem>
            <MenuItem value='ready_for_pickup'>Ready for pick up</MenuItem>
            <MenuItem value='picked_up'>Picked Up</MenuItem>
            <MenuItem value='out_for_delivery'>Out of delivery</MenuItem>
            <MenuItem value='delivered'>Delivered</MenuItem>
            <MenuItem value='failed'>Failed</MenuItem>
          </CustomTextField>

          <CustomTextField
            select
            fullWidth
            id='delivery_type'
            label='Select Delivery Type *'
            inputProps={{ placeholder: 'Delivery Type', ...register('delivery_type') }} // Register the field with hook form
            error={!!errors.delivery_type}
            helperText={errors.delivery_type?.message}
          >
            <MenuItem value='delivery'>Delivery</MenuItem>
            <MenuItem value='pickup'>Pick Up</MenuItem>
          </CustomTextField>
          <CustomTextField
            label='Address *'
            fullWidth
            placeholder='Enter Address'
            {...register('address', { required: 'Address is required' })}
            error={!!errors.address}
            helperText={errors.address?.message}
          />
          <CustomTextField
            label='Special Instruction *'
            fullWidth
            placeholder='Enter Special Instruction'
            {...register('special_instruction', { required: 'Special Instruction is required' })}
            error={!!errors.special_instruction}
            helperText={errors.special_instruction?.message}
          />
          <CustomTextField
            label='Tax Price *'
            fullWidth
            placeholder='Enter Tax Price'
            {...register('tax_price', { required: 'Tax Price is required' })}
            error={!!errors.tax_price}
            helperText={errors.tax_price?.message}
          />
          <CustomTextField
            label='Net Price *'
            fullWidth
            placeholder='Enter Net Price'
            {...register('net_price', { required: 'Net Price is required' })}
            error={!!errors.net_price}
            helperText={errors.net_price?.message}
          />
          <CustomTextField
            label='Total Price *'
            fullWidth
            placeholder='Enter Total Price '
            {...register('total_price', { required: 'Total Price is required' })}
            error={!!errors.total_price}
            helperText={errors.total_price?.message}
          />

          <CustomTextField
            select
            fullWidth
            id='user'
            label='Select User *'
            inputProps={{ placeholder: 'User', ...register('user') }}
            error={!!errors.user}
            helperText={errors.user?.message}
          >
            {data &&
              data?.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.first_name}
                </MenuItem>
              ))}
          </CustomTextField>

          <CustomTextField
            select
            fullWidth
            id='restaurant'
            label='Select restaurant *'
            inputProps={{ placeholder: 'Restaurant', ...register('restaurant') }}
            error={!!errors.restaurant}
            helperText={errors.restaurant?.message}
          >
            {restosData &&
              restosData?.map(rest => (
                <MenuItem key={rest.id} value={rest.id}>
                  {rest.name}
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

export default AddOrderDrawer
