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
import Typography from '@mui/material/Typography'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import toast, { Toaster } from 'react-hot-toast'

import { SizeDataType } from '@/api/interface/sizeInterface'
import { updateMenuSize } from '@/api/size'

type EditSizeInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: SizeDataType
  onTypeAdded?: any
  id?: string
}

const EditSizeInfo = ({ open, setOpen, data, id, onTypeAdded }: EditSizeInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SizeDataType>()

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data1: SizeDataType, e: any) => {
    e.preventDefault()

    const id: number = data?.id ?? 0
    updateMenuSize(id, data1)
      .then(res => {
        toast.success('Catalouge Size Updated Successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        if (onTypeAdded) {
          onTypeAdded()
        }
        setOpen(false)
      })
      .catch(error => {
        console.log(error, 'error Catalouge Size Update api')
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
        Edit Catalouge Size Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating Catalouge Size details will receive a privacy audit.
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Name'
                defaultValue={data?.name || ''}
                {...register('name', {
                  required: 'Name is required'
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Description'
                defaultValue={data?.description || ''}
                {...register('description', {
                  required: 'Description is required'
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Price'
                defaultValue={data?.additional_price}
                {...register('additional_price', { required: 'Price is required' })}
                error={!!errors.additional_price}
                helperText={errors.additional_price?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Catalouge'
                InputProps={{ readOnly: true }}
                defaultValue={data?.menu?.title || ''}
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

export default EditSizeInfo
