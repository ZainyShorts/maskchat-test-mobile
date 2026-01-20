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
import { ResturantDataType } from '@/api/interface/resturantInterface'
import { updateResturant } from '@/api/resturant'
import { updatePostalCodes } from '@/api/postalCodes'
import { postalCodesDataType } from '@/api/interface/postalCodesInterface'
import { BusinessType } from '@/types/apps/businessTypes'
import { MenuItem } from '@mui/material'
import { getAllBusiness } from '@/api/business'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'

type EditPostalCodesInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: postalCodesDataType
  onTypeAdded?: any
}

const EditPostalCodesInfo = ({ open, setOpen, data, onTypeAdded }: EditPostalCodesInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<postalCodesDataType>()

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

  const onSubmit = (data1: postalCodesDataType, e: any) => {
    e.preventDefault()

    const id: number = data?.id ?? 0
    updatePostalCodes(id, data1)
      .then(res => {
        toast.success('PostalCodes Updated Successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        if (onTypeAdded) {
          onTypeAdded()
        }
        setOpen(false)
      })
      .catch(error => {
        console.log(error, 'error PostalCodes Update api')
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
        Edit Postal Codes Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating Postal Codes details will receive a privacy audit.
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
                label='Postal Codes'
                defaultValue={data?.code || ''}
                {...register('code', {
                  required: 'Postal Codes is required'
                })}
                error={!!errors.code}
                helperText={errors.code?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='City'
                defaultValue={data?.city || ''}
                {...register('city', {
                  required: 'city is required'
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

export default EditPostalCodesInfo
