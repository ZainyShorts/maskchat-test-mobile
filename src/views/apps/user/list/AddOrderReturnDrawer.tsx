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
import { OrderReturnDataType } from '@/api/interface/orderReturnInterface'
import { createOrderReturns } from '@/api/orderReturns'
import { getAllUsers } from '@/api/user'
import { UsersType } from '@/types/apps/userTypes'
import { getAllOrders } from '@/api/order'
import { OrdersType } from '@/types/apps/orderTypes'

type Props = {
  open: boolean
  handleClose: () => void
}

const AddOrderReturnDrawer = ({ open, handleClose }: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<BusinessType[]>([])
  const [usersData, setUsersData] = useState<UsersType[]>([])
  const [ordersData, setOrdersData] = useState<OrdersType[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<OrderReturnDataType>()

  // States
  const onSubmit = (data: OrderReturnDataType, e: any) => {
    e.preventDefault()

    setLoading(true)

    createOrderReturns(data)
      .then(res => {
        toast.success('Order Return registerd successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        handleClose()
        reset()
      })
      .catch(error => {
        console.log(error, 'error in register Order Return')
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
      } finally {
        // setLoading(false)
      }
    }

    fetchBusiness()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)

      try {
        const response = await getAllUsers()
        setUsersData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders()

        setOrdersData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
      } finally {
        // setLoading(false)
      }
    }

    fetchOrders()
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
        <Typography variant='h5'>Add New Order Return</Typography>
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
            id='order'
            label='Select Order *'
            inputProps={{ placeholder: 'Select Order', ...register('order') }}
            error={!!errors.order}
            helperText={errors.order?.message}
          >
            {ordersData &&
              ordersData?.map(order => (
                <MenuItem key={order.id} value={order.id}>
                  {order.order_number}
                </MenuItem>
              ))}
          </CustomTextField>
          <CustomTextField
            select
            fullWidth
            id='order_status'
            label='Select Order Status *'
            inputProps={{ placeholder: 'Order Status', ...register('order_status') }}
            error={!!errors.order_status}
            helperText={errors.order_status?.message}
          >
            <MenuItem value='wrong_order'>Wrong Order</MenuItem>
            <MenuItem value='wrong_address'>Wrong Address</MenuItem>
            <MenuItem value='late_shipping'>Late Shiping</MenuItem>
            <MenuItem value='wrong_item'>Wrong Item</MenuItem>
            <MenuItem value='wrong_price'>Picked Up</MenuItem>
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
            label='Special Instructions *'
            fullWidth
            placeholder='Enter Special Instructions '
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
            placeholder='Enter Total Price'
            {...register('total_price', { required: 'Total Price is required' })}
            error={!!errors.total_price}
            helperText={errors.total_price?.message}
          />

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

export default AddOrderReturnDrawer
