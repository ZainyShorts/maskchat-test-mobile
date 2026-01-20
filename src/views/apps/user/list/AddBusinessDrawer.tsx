// React Imports

// MUI Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Component Imports
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import CustomTextField from '@core/components/mui/TextField'
import type { BusinessDataTypeForAddBusiness } from '@/api/interface/businessInterface'
import { createBusiness, getAllBusiness } from '@/api/business'
import Loader from '@/components/loader/Loader'
import type { BusinessType } from '@/types/apps/businessTypes'
import { getAllUsers } from '@/api/user'
import { useAuthStore } from '@/store/authStore'

type Props = {
  open: boolean
  handleClose: () => void
}

const AddBusinessDrawer = ({ open, handleClose }: Props) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const { user } = useAuthStore()

  const [data, setData] = useState<BusinessType[]>([])
  const [userData, setUserData] = useState<BusinessType[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<BusinessDataTypeForAddBusiness>()

  const onSubmit = (data: BusinessDataTypeForAddBusiness, e: any) => {
    setLoading(true)

    const formData: any = new FormData()

    formData.append('business_address', data.business_address)
    formData.append('business_desc', data.business_desc)
    formData.append('contact_number', data.contact_number)
    formData.append('business_initial', data.business_initial)
    formData.append('client_id', data.client_id)
    

    if (user && user?.user_type === 'admin') {
      formData.append('user', data?.user)
    } else {
      formData.append('user', user?.id)
    }

    formData.append('business_desc', data.business_desc)

    formData.append('business_id', data.business_id)

    if (data.business_doc && data.business_doc.length > 0) {
      formData.append('business_doc', data.business_doc[0])
    }

    createBusiness(formData)
      .then(res => {
        // toast.success('Business created successfully')
        toast.success('Business created successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        handleClose()
        reset()
      })
      .catch(error => {
        // console.log(error, 'error in creation Business')
        // if (error?.data && error?.data?.user[0]) {
        //   toast.error(error?.data?.user[0])
        // } else {
        //   toast.error('Error in creating business')
        // }
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

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()

        setData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
      } finally {
        // setLoading(false)
      }
    }

    fetchBusiness()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)

      try {
        const response = await getAllUsers()

        setUserData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

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
        <Typography variant='h5'>Add New Business</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6' encType='multipart/form-data'>
          <CustomTextField
            label='Business Meta Id *'
            fullWidth
            placeholder='Enter business Meta Id'
            {...register('business_id', { required: 'Business Meta Id is required' })}
            error={!!errors.business_id}
            helperText={errors.business_id?.message}
          />
          <CustomTextField
            label='Business address *'
            fullWidth
            placeholder='Enter business address '
            {...register('business_address', { required: 'Business address is required' })}
            error={!!errors.business_address}
            helperText={errors.business_address?.message}
          />
          <CustomTextField
            label='Business description *'
            fullWidth
            placeholder='Enter business description'
            {...register('business_desc', { required: 'Business description is required' })}
            error={!!errors.business_desc}
            helperText={errors.business_desc?.message}
          />
          <CustomTextField
            type='file' // Input type as 'file'
            label='Business Document *'
            fullWidth
            inputProps={{
              accept: '*' // Accept any file type
            }}
            {...register('business_doc', { required: 'Business document is required' })}
            error={!!errors.business_doc}
            helperText={errors.business_doc?.message}
          />

          <CustomTextField
            fullWidth
            label='Business Initial *'
            placeholder='Enter business Initial'
            {...register('business_initial', {
              required: 'Business initial is required',
              pattern: {
                value: /^[A-Z]{1,5}$/,
                message: 'Only up to 5 capital letters are allowed'
              }
            })}
            error={!!errors.business_initial}
            helperText={errors.business_initial?.message}
          />
          <CustomTextField
            label='Contact number *'
            fullWidth
            placeholder='Enter contact number'
            {...register('contact_number', { required: 'contact number is required' })}
            error={!!errors.contact_number}
            helperText={errors.contact_number?.message}
          />
          {user && user?.user_type === 'admin' && (
            <CustomTextField
              select
              fullWidth
              id='user'
              label='Select user *'
              inputProps={{ placeholder: 'User', ...register('user') }}
              error={!!errors.user}
              helperText={errors.user?.message}
            >
              {userData &&
                userData.map((item: any) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {item?.first_name}
                  </MenuItem>
                ))}
            </CustomTextField>
          )}
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
      </div>
    </Drawer>
  )
}

export default AddBusinessDrawer
