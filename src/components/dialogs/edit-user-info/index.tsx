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

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

import { useParams, useRouter } from 'next/navigation'
import { User } from '@/api/interface/userInterface'
import { getUserTypes, updateUser } from '@/api/user'

type EditUserInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: User
  onTypeAdded?: any
}

const EditUserInfo = ({ open, setOpen, data, onTypeAdded }: EditUserInfoProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<User>()

  const [userTypes, setUserTypes] = useState<UserRole[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchUserTypes = async () => {
      setLoading(true)

      try {
        const response = await getUserTypes()
        setUserTypes(response?.data || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUserTypes()
  }, [])

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data1: User, e: any) => {
    e.preventDefault()

    const id: number = data?.id ?? 0
    updateUser(id, data1)
      .then(res => {
        toast.success('User Updated Successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        if (onTypeAdded) {
          onTypeAdded()
        }
      })
      .catch(error => {
        console.log(error, 'error User Update api')
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
        Edit User Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating User details will receive a privacy audit.
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Company Name'
                defaultValue={data?.name || ''}
                {...register('name', { required: 'Company name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='First Name'
                defaultValue={data?.first_name || ''}
                {...register('first_name', { required: 'First name is required' })}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Last Name'
                defaultValue={data?.last_name || ''}
                {...register('last_name', { required: 'Last name is required' })}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Email'
                defaultValue={data?.email || ''}
                {...register('email', { required: 'Email is required' })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Mobile'
                defaultValue={data?.mobile || ''}
                {...register('mobile', { required: 'Mobile number is required' })}
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='user_type'
                label='Select User Type'
                defaultValue={data?.user_type || ''}
                inputProps={{ placeholder: 'User Type', ...register('user_type') }}
                error={!!errors.user_type}
                helperText={errors.user_type?.message}
              >
                {userTypes &&
                  userTypes?.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.type}
                    </MenuItem>
                  ))}
              </CustomTextField>
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Country'
                defaultValue={data?.country || ''}
                {...register('country', { required: 'Country is required' })}
                error={!!errors.country}
                helperText={errors.country?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='City'
                defaultValue={data?.city || ''}
                {...register('city', { required: 'City is required' })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Address'
                defaultValue={data?.address || ''}
                {...register('address', { required: 'Address is required' })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Postal Code'
                placeholder='Enter postal code'
                defaultValue={data?.postalCode || ''}
                {...register('postalCode', { required: 'Postal code is required' })}
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message}
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
      {/* <Toaster /> */}
    </Dialog>
  )
}

export default EditUserInfo
