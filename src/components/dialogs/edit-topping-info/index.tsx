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

import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/types/apps/businessTypes'

import { updateTopping } from '@/api/toppings'
import { ToppingDataType, ToppingDataTypeWithObjects } from '@/api/interface/toppingInterface'

type EditToppingInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: ToppingDataTypeWithObjects
  onTypeAdded?: any
}

const EditToppingInfo = ({ open, setOpen, data, onTypeAdded }: EditToppingInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ToppingDataType>()

  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data1: ToppingDataType, e: any) => {
    e.preventDefault()

    const id: number = data?.id ?? 0
    updateTopping(id, data1)
      .then(res => {
        toast.success('Combination Updated Successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        if (onTypeAdded) {
          onTypeAdded()
        }
        setOpen(false)
      })
      .catch(error => {
        console.log(error, 'error Combination Update api')
      })
      .finally(() => {
        setLoading(false)
      })
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

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Edit Combination Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating Combination details will receive a privacy audit.
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Combination Name'
                defaultValue={data?.name || ''}
                {...register('name', {
                  required: 'Combination name is required'
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Combination Description'
                defaultValue={data?.description || ''}
                {...register('description', {
                  required: 'Combination description is required'
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Additional Price *'
                fullWidth
                type='number'
                placeholder='Enter Additional Price'
                defaultValue={data?.additional_price}
                inputProps={{ step: 'any', min: '0.1' }} // Allows precise decimal values
                {...register('additional_price', {
                  required: 'Additional Price is required',
                  pattern: {
                    value: /^(0\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?|\d)$/, // Accepts positive integers & decimals, prevents leading zeros
                    message: 'Only positive integers or decimal values are allowed'
                  },
                  min: {
                    value: 0.1, // Ensures greater than 0
                    message: 'Value must be at least 0.1'
                  }
                })}
                error={!!errors.additional_price}
                helperText={errors.additional_price?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Business'
                InputProps={{ readOnly: true }}
                defaultValue={data?.business?.id || ''}
              ></CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Type'
                InputProps={{ readOnly: true }}
                defaultValue={data?.type?.name || ''}
              ></CustomTextField>
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

export default EditToppingInfo
