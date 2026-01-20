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

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import { toast, Toaster } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { BusinessType } from '@/types/apps/businessTypes'
import { getAllBusiness } from '@/api/business'
import { ChatGptType } from '@/api/interface/interfaceChatGPT'
import { updateChatGPT } from '@/api/chatGpt'

type EditChatGptInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: ChatGptType
  onTypeAdded?: any
}

const EditChatGptInfo = ({ open, setOpen, data, onTypeAdded }: EditChatGptInfoProps) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [loading, setLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ChatGptType>()

  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])

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

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data1: ChatGptType, e: any) => {
    e.preventDefault()

    const id: number = data?.id ?? 0
    updateChatGPT(id, data1)
      .then(res => {
        toast.success('Chat Gpt Updated Successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        if (onTypeAdded) {
          onTypeAdded()
        }
        setOpen(false)
      })
      .catch(error => {
        if (error?.data?.business) {
          toast.error(error?.data?.business[0], {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        } else if (error?.data?.active) {
          toast.error(error?.data?.active[0], {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        } else {
          toast.error('Error In Updating  Chat Gpt', {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        }
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
        Edit Chat Gpt Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating Chat Gpt details will receive a privacy audit.
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='business'
                label='Select Business'
                defaultValue={data?.business || ''}
                inputProps={{ placeholder: 'Business', ...register('business') }}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Gpt api key'
                {...register('gpt_api_key', { required: 'Gpt api key is required' })}
                defaultValue={data?.gpt_api_key || ''}
                {...register('gpt_api_key', {
                  required: 'Gpt api key is required'
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Status'
                defaultValue={data?.active ? 'true' : 'false'} // Map true to 'true' and false to 'false'
                {...register('active', { required: 'Status is required' })}
                error={!!errors.active}
                helperText={errors.active?.message}
              >
                <MenuItem value='' disabled>
                  Select Status
                </MenuItem>
                <MenuItem value='true'>Active</MenuItem>
                <MenuItem value='false'>Inactive</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Description'
                defaultValue={data?.desc || ''}
                {...register('desc', {
                  required: 'Description is required'
                })}
              />
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

export default EditChatGptInfo
