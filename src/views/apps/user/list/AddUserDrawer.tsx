// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import { InputAdornment, MenuItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useForm, Controller } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import type { User } from '@/api/interface/userInterface'
import { createUser, getUserTypes } from '@/api/user'
import Loader from '@/components/loader/Loader'

type Props = {
  open: boolean
  handleClose: () => void
}

const AddUserDrawer = ({ open, handleClose }: Props) => {
  // States

  const [formError, setFormError] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<User>()

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [userTypes, setUserTypes] = useState<UserRole[]>([])

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

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

  const onSubmit = (data: User, e: any) => {
    e.preventDefault()
    setLoading(true)

    const submissionData = {
      ...data,
      status: 'Pending'
    }

   

    createUser(submissionData)
      .then(res => {
        toast.success(res?.data.message, {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        handleClose()
      })
      .catch(error => {
        if (error?.email) {
          toast.error(error?.email[0])
        } else {
          toast.error('An error occurred in creating user', {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        }
      })
      .finally(() => {
        setLoading(false)
        reset()
      })
  }

  const handleReset = () => {
    handleClose()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Add New User</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form
          // onSubmit={handleSubmit}
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-6 p-6'
        >
          <CustomTextField
            autoFocus
            fullWidth
            label='Company Name *'
            placeholder='Enter company name'
            {...register('name', { required: 'Company name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <CustomTextField
            autoFocus
            fullWidth
            label='First Name *'
            placeholder='Enter your first name'
            {...register('first_name', { required: 'First name is required' })}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
          />
          <CustomTextField
            autoFocus
            fullWidth
            label='Last Name *'
            placeholder='Enter your last name'
            {...register('last_name', { required: 'Last name is required' })}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
          />
          <CustomTextField
            fullWidth
            label='Email *'
            placeholder='Enter your email'
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <CustomTextField
            autoFocus
            fullWidth
            label='Mobile *'
            placeholder='Enter your mobile'
            {...register('mobile', { required: 'Mobile number is required' })}
            error={!!errors.mobile}
            helperText={errors.mobile?.message}
          />

          <CustomTextField
            fullWidth
            label='Password *'
            placeholder='············'
            type={isPasswordShown ? 'text' : 'password'}
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                    <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <CustomTextField
            select
            fullWidth
            id='user_type'
            label='Select User Type *'
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

          <CustomTextField
            autoFocus
            fullWidth
            label='Country *'
            placeholder='Enter Your Country'
            {...register('country', { required: 'country is required' })}
            error={!!errors.country}
            helperText={errors.country?.message}
          />
          <CustomTextField
            autoFocus
            fullWidth
            label='City *'
            placeholder='Enter Your City'
            {...register('city', { required: 'City is required' })}
            error={!!errors.city}
            helperText={errors.city?.message}
          />
          <CustomTextField
            autoFocus
            fullWidth
            label='Address *'
            placeholder='Enter Your Address'
            {...register('address', { required: 'address is required' })}
            error={!!errors.address}
            helperText={errors.address?.message}
          />
          <CustomTextField
            autoFocus
            fullWidth
            label='Postal Code *'
            placeholder='Enter Postal Code '
            {...register('postalCode', { required: 'Postal Code is required' })}
            error={!!errors.postalCode}
            helperText={errors.postalCode?.message}
          />

          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit' disabled={loading}>
              Submit
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
          {loading && <Loader />}
        </form>
        <Toaster />
      </div>
    </Drawer>
  )
}

export default AddUserDrawer
