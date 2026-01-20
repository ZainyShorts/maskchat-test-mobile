'use client'

// React Imports
import { useState } from 'react'
import { useForm } from 'react-hook-form'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import toast, { Toaster } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { OrderDataType } from '@/api/interface/orderInterface'
import { updateOrder } from '@/api/order'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'

type EditOrderInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: OrderDataType
  onTypeAdded?: any
}

const EditOrderInfo = ({ open, setOpen, data, onTypeAdded }: EditOrderInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { lang: locale } = useParams()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<OrderDataType>()
  // console.log(data, 'order Data----------')

  // States
  const [userData, setUserData] = useState<EditOrderInfoProps['data'] | null>(data || null)

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data1: OrderDataType, e: any) => {
    e.preventDefault()

    const id: number = data?.id ?? 0
    // console.log(id, 'id')

    updateOrder(id, data1)
      .then(res => {
        // console.log(res, 'res of Update Order Api-----------')
        toast.success('Order Updated Successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        if (onTypeAdded) {
          onTypeAdded()
        }

        setOpen(false)
      })
      .catch(error => {
        console.log(error, 'error Order Update api')
        toast.error(error?.data?.detail, {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Dialog open={open} scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Edit Order Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating Order details will receive a privacy audit.
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label='Status'
                defaultValue={data?.status || ''}
                {...register('status', { required: 'Status is required' })}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value='' disabled>
                  Select Status
                </MenuItem>

                <MenuItem value='pending'>Pending</MenuItem>
                <MenuItem value='confirmed'>Confirmed</MenuItem>
                <MenuItem value='cancelled'>Cancelled</MenuItem>
                <MenuItem value='ready_for_pickup'>Ready for Pickup</MenuItem>
                <MenuItem value='picked_up'>Picked Up</MenuItem>
                <MenuItem value='out_for_delivery'>Out for Delivery</MenuItem>
                <MenuItem value='delivered'>Delivered</MenuItem>
                <MenuItem value='failed'>Failed</MenuItem>
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

export default EditOrderInfo
