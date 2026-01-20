'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import type { SelectChangeEvent } from '@mui/material/Select'
import { toast as hotToast, Toaster } from 'react-hot-toast'
// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { useAuthStore } from '@/store/authStore'
import { getUserTypes, updateUser } from '@/api/user'
import { useForm } from 'react-hook-form'
import { User } from '@/api/interface/userInterface'
import { useParams, useRouter } from 'next/navigation'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { getAllBusiness } from '@/api/business'

type Data = {
  name: string
  first_name: string
  last_name: string
  email: string
  organization: string
  phoneNumber: number | string
  address: string
  state: string
  mobile: number | string
  postalCode: string
  country: string
  city: string
  language: string
  timezone: string
  currency: string
}

// Vars
const initialData: Data = {
  name: 'Pizza crust',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  organization: 'Pixinvent',
  mobile: '+1 (917) 543-9876',
  phoneNumber: '+1 (917) 543-9876',
  address: '123 Main St, New York, NY 10001',
  state: 'New York',
  postalCode: '634880',
  country: 'usa',
  city: 'London',
  language: 'english',
  timezone: 'gmt-12',
  currency: 'usd'
}

const AccountDetails = () => {
  // States
  const [formData, setFormData] = useState<Data>(initialData)
  const [fileInput, setFileInput] = useState<string>('')
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')
  const [language, setLanguage] = useState<string[]>(['English'])
  const [roleType, setRoleType] = useState<number>(1)
  const { user } = useAuthStore()
  const [userTypes, setUserTypes] = useState<UserRole[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { lang: locale } = useParams()

  // console.log(user?.user_type, 'user')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<User>()

  const handleDelete = (value: string) => {
    setLanguage(current => current.filter(item => item !== value))
  }

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    setLanguage(event.target.value as string[])
  }

  const handleFormChange = (field: keyof Data, value: Data[keyof Data]) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleFileInputChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement

    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setFileInput(reader.result as string)
      }
    }
  }

  const handleFileInputReset = () => {
    setFileInput('')
    setImgSrc('/images/avatars/1.png')
  }

  const onSubmit = (data1: User, e: any) => {
    e.preventDefault()
    // console.log(data1, 'data1')
    // console.log(data, 'data')
    const id: number = user?.id ?? 0
    updateUser(id, data1)
      .then(res => {
        console.log(res, 'response of Update User Api-----------')
        hotToast.success('User Updated Successfully')

        router.replace(getLocalizedUrl('/home', locale as Locale))
      })
      .catch(error => {
        console.log(error, 'error User Update api')
      })
      .finally(() => {
        setLoading(false)
      })
    // router.push('/menu')
  }

  useEffect(() => {
    const fetchUserTypes = async () => {
      setLoading(true)

      try {
        const response = await getUserTypes()

        // console.log(response?.data, 'All Users Types')
        if (user?.user_type && response?.data) {
          const userTypeObj = response.data.find((userType: any) => userType.type === user.user_type)
          if (userTypeObj) {
            setRoleType(userTypeObj.id)
          }
        }
        setUserTypes(response?.data || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUserTypes()
  }, [user])

  const [businessLogo,setBusinessLogo] = useState<string | null>(null)
    useEffect(() => {
        const fetchBusiness = async () => {
          try {
            const response = await getAllBusiness()
            setBusinessLogo(response?.data?.results[0].logo || null)
          } catch (err: any) {
            // setError(err.message || 'Failed to fetch business')
          } finally {
            // setLoading(false)
          }
        }
        fetchBusiness()
      }, [])

  return (
    <Card>
      <CardContent className='mbe-4'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <img height={100} width={100} className='rounded' src={businessLogo ?? imgSrc} alt='Profile' />
          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
            </div>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Company Name'
                defaultValue={user?.name || ''}
                {...register('name', { required: 'Company name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Email'
                defaultValue={user?.email || ''}
                {...register('email', { required: 'Email is required' })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='First Name'
                defaultValue={user?.first_name || ''}
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
                defaultValue={user?.last_name || ''}
                {...register('last_name', { required: 'Last name is required' })}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Address'
                defaultValue={user?.address || ''}
                {...register('address', { required: 'Address is required' })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Mobile'
                defaultValue={user?.mobile || ''}
                {...register('mobile', { required: 'Mobile number is required' })}
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
              />
            </Grid>
            
            
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Country'
                defaultValue={user?.country || ''}
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
                defaultValue={user?.city || ''}
                {...register('city', { required: 'City is required' })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                autoFocus
                fullWidth
                label='Postal Code'
                placeholder='Enter postal code'
                defaultValue={user?.postalCode || ''}
                {...register('postalCode', { required: 'Postal code is required' })}
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message}
              />
            </Grid>

            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit'>
                Save Changes
              </Button>
              
            </Grid>
          </Grid>
        </form>
        <Toaster />
      </CardContent>
    </Card>
  )
}

export default AccountDetails
