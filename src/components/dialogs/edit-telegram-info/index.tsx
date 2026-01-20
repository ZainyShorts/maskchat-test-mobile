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
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import toast, { Toaster } from 'react-hot-toast'
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import { TelegramDataType } from '@/api/interface/telegramInterface'
import { updateTelegram } from '@/api/telegram'
import { FeedToChatGptType } from '@/api/interface/interfaceFeedToGPT'
import { getFeedToChatGpt } from '@/api/feedToChatGPT'
import { BusinessType } from '@/types/apps/businessTypes'
import { getAllBusiness } from '@/api/business'

type EditTelegramInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: TelegramDataType
  onTypeAdded?: any
}

const EditTelegramInfo = ({ open, setOpen, data, onTypeAdded }: EditTelegramInfoProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TelegramDataType>()

  const [feedToGptData, setFeedToGptData] = useState<FeedToChatGptType[]>([])
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const fetchFeedToChatGpt = async () => {
      try {
        const response = await getFeedToChatGpt()
        setFeedToGptData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch business')
      } finally {
        // setLoading(false)
      }
    }

    fetchFeedToChatGpt()
  }, [])

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

  const onSubmit = (data1: TelegramDataType, e: any) => {
    e.preventDefault()

    const id: number = data?.id ?? 0
    updateTelegram(id, data1)
      .then(res => {
        toast.success('Telegram Data Updated Successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        if (onTypeAdded) {
          onTypeAdded()
        }
        setOpen(false)
      })
      .catch(error => {
        console.log(error, 'error telegram Update api')
      })
      .finally(() => {
        // setLoading(false)
      })
  }

  return (
    <h1>h1</h1>
    // <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
    //   <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
    //     <i className='tabler-x' />
    //   </DialogCloseButton>
    //   <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
    //     Edit Telegram Information
    //     <Typography component='span' className='flex flex-col text-center'>
    //       Updating Telegram details will receive a privacy audit.
    //     </Typography>
    //   </DialogTitle>
    //   <form onSubmit={handleSubmit(onSubmit)}>
    //     <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
    //       <Grid container spacing={5}>
    //         <Grid item xs={12} sm={6}>
    //           <CustomTextField
    //             select
    //             fullWidth
    //             id='business'
    //             label='Select Business'
    //             defaultValue={data?.business || ''}
    //             inputProps={{ placeholder: 'Business', ...register('business') }}
    //             error={!!errors.business}
    //             helperText={errors.business?.message}
    //           >
    //             {userBusinessData &&
    //               userBusinessData?.map(business => (
    //                 <MenuItem key={business.id} value={business.id}>
    //                   {business.business_id}
    //                 </MenuItem>
    //               ))}
    //           </CustomTextField>
    //         </Grid>
    //         <Grid item xs={12} sm={6}>
    //           <CustomTextField
    //             fullWidth
    //             label='Name'
    //             defaultValue={data?.name || ''}
    //             {...register('name', {
    //               required: 'name is required'
    //             })}
    //           />
    //         </Grid>
    //         <Grid item xs={12} sm={6}>
    //           <CustomTextField
    //             fullWidth
    //             label='User Name'
    //             {...register('username', { required: 'User name is required' })}
    //             defaultValue={data?.username || ''}
    //             {...register('username', {
    //               required: 'User name is required'
    //             })}
    //           />
    //         </Grid>

    //         <Grid item xs={12} sm={6}>
    //           <CustomTextField
    //             select
    //             fullWidth
    //             id='Feed to gpt'
    //             label='Select feed to gpt'
    //             defaultValue={data?.feed_to_gpt || ''}
    //             inputProps={{ placeholder: 'feed_to_gpt', ...register('feed_to_gpt') }}
    //             error={!!errors.feed_to_gpt}
    //             helperText={errors.feed_to_gpt?.message}
    //           >
    //             {feedToGptData &&
    //               feedToGptData?.map(feed => (
    //                 <MenuItem key={feed.id} value={feed.id}>
    //                   {feed.name}
    //                 </MenuItem>
    //               ))}
    //           </CustomTextField>
    //         </Grid>

    //         <Grid item xs={12} sm={6}>
    //           <CustomTextField
    //             select
    //             fullWidth
    //             label='Status'
    //             defaultValue={data?.active ? 'true' : 'false'} // Map true to 'true' and false to 'false'
    //             {...register('active', { required: 'Status is required' })}
    //             error={!!errors.active}
    //             helperText={errors.active?.message}
    //           >
    //             <MenuItem value='' disabled>
    //               Select Status
    //             </MenuItem>
    //             <MenuItem value='true'>Active</MenuItem>
    //             <MenuItem value='false'>Inactive</MenuItem>
    //           </CustomTextField>
    //         </Grid>
    //       </Grid>
    //     </DialogContent>
    //     <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
    //       <Button variant='contained' type='submit'>
    //         Submit
    //       </Button>
    //       <Button variant='tonal' color='secondary' type='reset' onClick={handleClose}>
    //         Cancel
    //       </Button>
    //     </DialogActions>
    //   </form>
    //   <Toaster />
    // </Dialog>
  )
}

export default EditTelegramInfo
