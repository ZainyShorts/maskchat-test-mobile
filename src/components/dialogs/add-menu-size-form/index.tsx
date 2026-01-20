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
import { MenuDataType } from '@/api/interface/menuIterface'

import toast, { Toaster } from 'react-hot-toast'

import OpenDialogOnElementClick from '../OpenDialogOnElementClick'
import type { ButtonProps } from '@mui/material/Button'
import type { ThemeColor } from '@core/types'
import Loader from '@/components/loader/Loader'
import { createSize, getBusinessMenuesById } from '@/api/size'
import { BusinessMenusDataType, SizeDataTypeWithoutId } from '@/api/interface/sizeInterface'

type AddMenuFormSizeProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: MenuDataType
  onTypeAdded?: any
  onCreateSize: (isCreated: boolean) => void
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

const AddtMenuSizeForm = ({ open, setOpen, data, onTypeAdded, onCreateSize }: AddMenuFormSizeProps) => {
  const [BusinessMenuesData, setBusinessMenuesData] = useState<BusinessMenusDataType[]>([])

  const [loading, setLoading] = useState<boolean>(false)
  const [addSizeFlag, setAddSizeFlag] = useState<boolean>(false)
  const [selectedBusinessMenu, setSelectedBusinessMenu] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<SizeDataTypeWithoutId>()

  const onSubmit = (data: SizeDataTypeWithoutId, e: any) => {
    e.preventDefault()

    onCreateSize(false)
    setAddSizeFlag(false)

    if (selectedBusinessMenu === null) {
      toast.error('Please select a business menu')
      return
    }
    if (!data?.business) {
      toast.error('Please select a business menu to proceed')
      return
    }
    if (!data?.type) {
      toast.error('Please select a business to proceed')
      return
    }

    const payload = {
      name: data?.name,
      additional_price: data?.additional_price,
      description: data?.description,
      business: data?.business,
      menu: data?.menu,
      size: data?.size,
      type: data?.type
    }

    setLoading(true)
    createSize(payload)
      .then(res => {
        toast.success('Size saved successfully')
        onCreateSize(true)
        setAddSizeFlag(true)
        reset()
        setValue('menu', 0, { shouldValidate: true }) // Explicitly reset menu to 0
        setValue('business', 0, { shouldValidate: true }) // Also reset business
        setValue('type', 0, { shouldValidate: true }) // Also reset type
        setSelectedBusinessMenu(false) // Reset the business menu selection state
      })
      .catch(error => {
        console.log(error?.data, 'Size create error')
        if (error?.data && error?.data?.non_field_errors?.[0]) {
          toast.error(error?.data?.non_field_errors[0])
        } else if (error?.data && error?.data?.additional_price?.[0]) {
          toast.error(error?.data?.additional_price[0])
        } else if (error?.data && error?.data?.business?.[0]) {
          toast.error(error?.data?.business[0])
        } else {
          toast.error('Error in creating Size')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleReset = () => {
    setOpen(false)
    reset()
  }

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Add Catalouge Size Information
      </DialogTitle>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
            <Grid container spacing={5} alignItems='center'>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Name *'
                  fullWidth
                  placeholder='Enter  Name'
                  {...register('name', { required: 'Name is required' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Description *'
                  fullWidth
                  placeholder='Enter Description'
                  {...register('description', { required: 'Description is required' })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Price *'
                  fullWidth
                  type='number'
                  placeholder='Enter Price'
                  {...register('additional_price', {
                    required: 'Price is required',
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Only integers are allowed'
                    },
                    min: {
                      value: 0,
                      message: 'Price must be a non-negative number'
                    }
                  })}
                  error={!!errors.additional_price}
                  helperText={errors.additional_price?.message}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                {/* <CustomTextField
                  select
                  fullWidth
                  label='Menu*'
                  value={watch('menu') || 0} // Add this line to control the displayed value
                  {...register('menu', {
                    required: 'Business Menu is required',
                    validate: validateBusinessId,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      const selectedId = Number(e.target.value)
                      const selectedItem = BusinessMenuesData.find(item => item.id === selectedId)
                      if (selectedItem) {
                        setValue('business', Number(selectedItem.business), { shouldValidate: true })
                        setValue('type', selectedItem?.type?.id, { shouldValidate: true })
                      }
                    }
                  })}
                  error={!!errors.menu}
                  helperText={errors.menu?.message}
                >
                  <MenuItem key='Select menu' value={0}>
                    Select menu
                  </MenuItem>
                  {BusinessMenuesData &&
                    BusinessMenuesData?.map(bMenu => (
                      <MenuItem key={bMenu.id} value={bMenu.id}>
                        {bMenu.title}
                      </MenuItem>
                    ))}
                </CustomTextField> */}
              </Grid>
            </Grid>
            <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16 mt-5'>
              <Button variant='contained' type='submit' disabled={loading}>
                Submit
              </Button>
              <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
                Cancel
              </Button>
            </DialogActions>

            {loading && <Loader />}
          </DialogContent>
        </form>

        <Toaster />
      </div>
    </Dialog>
  )
}

export default AddtMenuSizeForm
