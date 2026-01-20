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

import { updateFaceBook } from '@/api/facebook'
import { useParams, useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/types/apps/businessTypes'

type FaceBookDataType = {
  id?: number,
  business?: number | string
  facebook_id?: string
  access_token?: string
  webhook_token?: string
  facebook_account_id?: number
  catalog_id?: string
  feed_to_gpt?: number | string
  active?: boolean
}

type EditFaceBookInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: FaceBookDataType
  onTypeAdded?: any
}

const EditFaceBookInfo = ({ open, setOpen, data, onTypeAdded }: EditFaceBookInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { lang: locale } = useParams()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FaceBookDataType>()

  // States
  const [whatsAppData, setWhatsAppData] = useState<EditFaceBookInfoProps['data'] | null>(data || null)
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])

  const handleClose = () => {
    setOpen(false)
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

  const onSubmit = (data1: any, e: any) => {
    e.preventDefault()

    const id: number = data?.id ?? 0
    updateFaceBook(id, data1)
      .then(res => {
        toast.success('Facebook Updated Successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        if (onTypeAdded) {
          onTypeAdded()
        }
        setOpen(false)
      })
      .catch(error => {
        console.log(error, 'error Facebook Update api')
        if (error?.data?.business) {
          toast.error(error?.data?.business[0], {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        } else if (error?.data?.active) {
          toast.error(error?.data?.active[0], {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        } else {
          toast.error('Error In Updating Facebook Feed', {
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
        Edit faceBook Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating faceBook details will receive a privacy audit.
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
                label='FaceBook Id'
                defaultValue={data?.facebook_id || ''}
                {...register('facebook_id', {
                  required: 'facebook_id is required'
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Access Token'
                {...register('access_token', { required: 'access_token is required' })}
                defaultValue={data?.access_token || ''}
                {...register('access_token', {
                  required: 'access_token is required'
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='facebook_account_id'
                {...register('facebook_account_id', { required: 'facebook_account_id is required' })}
                defaultValue={data?.facebook_account_id || ''}
                {...register('facebook_account_id', {
                  required: 'facebook_account_id is required'
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Feed to gpt'
                {...register('feed_to_gpt', { required: 'Feed to gpt is required' })}
                defaultValue={data?.feed_to_gpt || ''}
                {...register('feed_to_gpt', {
                  required: 'Feed to gpt is required'
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Catalog Id'
                {...register('catalog_id', { required: 'Catalog Id is required' })}
                defaultValue={data?.catalog_id || ''}
                {...register('catalog_id', {
                  required: 'Catalog Id is required'
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Web Hook Token'
                defaultValue={data?.webhook_token || ''}
                {...register('webhook_token', {
                  required: 'Web Hook Token is required'
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

export default EditFaceBookInfo
