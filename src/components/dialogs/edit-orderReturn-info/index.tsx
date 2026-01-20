'use client'

// React Imports
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import Typography from '@mui/material/Typography'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import toast, { Toaster } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { getAllOrders } from '@/api/order'
import { getAllUsers } from '@/api/user'
import { getAllBusiness } from '@/api/business'
import { UsersType } from '@/types/apps/userTypes'
import { BusinessType } from '@/types/apps/businessTypes'
import { OrdersType } from '@/types/apps/orderTypes'
import { OrderReturnDataType } from '@/api/interface/orderReturnInterface'
import { MenuItem } from '@mui/material'
import { updateOrderReturns } from '@/api/orderReturns'

type EditOrderReturnInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: OrderReturnDataType
  onTypeAdded?: any
}

const EditOrderReturnInfo = ({ open, setOpen, data, onTypeAdded }: EditOrderReturnInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [businessData, setBusinessData] = useState<BusinessType[]>([])
  const [usersData, setUsersData] = useState<UsersType[]>([])
  const [ordersData, setOrdersData] = useState<OrdersType[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<OrderReturnDataType>()

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()

        setBusinessData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
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

  const onSubmit = (data1: OrderReturnDataType, e: any) => {
    e.preventDefault()

    const id: number = data?.id ?? 0
    updateOrderReturns(id, data1)
      .then(res => {
        toast.success('Order Returns Updated Successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        if (onTypeAdded) {
          onTypeAdded()
        }

        setOpen(false)
      })
      .catch(error => {
        console.log(error, 'error Order Returns Update api')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Edit Order Return Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating Order Return details will receive a privacy audit.
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Return Order Number'
                fullWidth
                placeholder='Enter Return order number'
                defaultValue={data?.return_order_number}
                {...register('return_order_number', { required: 'Return order number is required' })}
                error={!!errors.return_order_number}
                helperText={errors.return_order_number?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='order_status'
                label='Select Order Status'
                defaultValue={data?.order_status}
                inputProps={{ placeholder: 'Order Status', ...register('order_status') }}
                error={!!errors.order_status}
                helperText={errors.order_status?.message}
              >
                <MenuItem value='wrong_order'>Wrong Order</MenuItem>
                <MenuItem value='wrong_address'>Wrong Address</MenuItem>
                <MenuItem value='late_shipping'>Late Shiping</MenuItem>
                <MenuItem value='wrong_item'>Wrong Item</MenuItem>
                <MenuItem value='wrong_price'>Wrong Price</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='delivery_type'
                label='Select Delivery Type'
                defaultValue={data?.delivery_type}
                inputProps={{ placeholder: 'Delivery type', ...register('delivery_type') }} // Register the field with hook form
                error={!!errors.delivery_type}
                helperText={errors.delivery_type?.message}
              >
                <MenuItem value='delivery'>Delivery</MenuItem>
                <MenuItem value='pickup'>Pick Up</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Special Instructions'
                fullWidth
                placeholder='Enter Special Instructions'
                defaultValue={data?.special_instruction}
                {...register('special_instruction', { required: 'Special Instruction is required' })}
                error={!!errors.special_instruction}
                helperText={errors.special_instruction?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Tax Price'
                fullWidth
                placeholder='Enter Tax Price'
                defaultValue={data?.tax_price}
                {...register('tax_price', { required: 'Tax Price is required' })}
                error={!!errors.tax_price}
                helperText={errors.tax_price?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Net Price'
                fullWidth
                placeholder='Enter Net Price'
                defaultValue={data?.net_price}
                {...register('net_price', { required: 'Net Price is required' })}
                error={!!errors.net_price}
                helperText={errors.net_price?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Total Price'
                fullWidth
                placeholder='Enter Total Price'
                defaultValue={data?.total_price}
                {...register('total_price', { required: 'Total Price is required' })}
                error={!!errors.total_price}
                helperText={errors.total_price?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='order'
                label='Select Order'
                defaultValue={data?.order?.id}
                inputProps={{ placeholder: 'Select order', ...register('order') }}
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            Submit
          </Button>
          <Button variant='tonal' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
      <Toaster />
    </Dialog>
  )
}

export default EditOrderReturnInfo
