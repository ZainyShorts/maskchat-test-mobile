'use client'

import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import { useParams, useRouter } from 'next/navigation'

import toast, { Toaster } from 'react-hot-toast'

import { useForm } from 'react-hook-form'

import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Typography,
  useMediaQuery
} from '@mui/material'

import { styled, useTheme } from '@mui/material/styles'

import classnames from 'classnames'

import CustomTextField from '@/@core/components/mui/TextField'

import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Third-party Imports

// Type Imports
import type { SystemMode } from '@/@core/types'
import type { User } from '@/api/interface/userInterface'
import { createUser, getUserTypes, registerUser } from '@/api/user'
import Loader from '@/components/loader/Loader'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

// Vars
const darkImg = '/images/pages/auth-mask-dark.png'
const lightImg = '/images/pages/auth-mask-light.png'
const darkIllustration = '/images/illustrations/auth/v2-register-dark.png'
const lightIllustration = '/images/illustrations/auth/v2-register-light.png'
const borderedDarkIllustration = '/images/illustrations/auth/v2-register-dark-border.png'
const borderedLightIllustration = '/images/illustrations/auth/v2-register-light-border.png'

// Styled Custom Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 600,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 345,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

// Component
const Register = ({ mode }: { mode: SystemMode }) => {
  const { lang: locale } = useParams() as { lang: Locale }
  const [formError] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<User>()

  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [userTypes, setUserTypes] = useState<UserRole[]>([])

  const handleClose = () => setOpen(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Hooks
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  useEffect(() => {
    const fetchUserTypes = async () => {
      setLoading(true)

      try {
        const response = await getUserTypes()

        setUserTypes(response?.data || [])
      } catch (err: any) {
        // Handle error
      } finally {
        setLoading(false)
      }
    }

    fetchUserTypes()
  }, [])

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit = (data: User, e: any) => {
    e.preventDefault()

    if (!isChecked) {
      toast.error('You must agree to the terms and conditions to proceed.')
      return
    }

    const user_type = userTypes.find(user => user.type == "businessowner")

    if(!user_type) {
      toast.error('Type businessowner missing', {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
      }

    setLoading(true)

    const submissionData = {
      ...data,
      status: 'Active',
      user_type: user_type!.id
      // image: 'http://localhost:8000/documents/adriotlogo.png'
    }

    registerUser(submissionData)
      .then(res => {
        console.log(res, 'res')
        toast.success(res?.data?.message, {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        // router.replace('/login')
        router.replace(getLocalizedUrl('/login', locale))
      })
      .catch(error => {
        console.log(error, 'error')
        // if (error?.response?.data) {
        //   toast.error(error?.response?.data?.email[0])
        // } else {
        //   toast.error('An error occurred while registering')
        // }
        // console.log(error?.response?.data, 'error')

        if (error?.email) {
          toast.error(error?.email[0], {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        } else {
          toast.error('An error occurred while registering', {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <div className='flex bs-full justify-center'>
        <div
          className={classnames(
            'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
            {
              'border-ie': settings.skin === 'bordered'
            }
          )}
        >
          <RegisterIllustration src={characterIllustration} alt='character-illustration' />
          {!hidden && <MaskImg alt='mask' src={authBackground} />}
        </div>

        {formError && <p className='text-red-600'>{formError}</p>}

        <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
          <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
            <Logo />
          </div>
          <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
            <div className='flex flex-col gap-1'>
              <Typography variant='h4'>Adventure starts here 🚀</Typography>
              <Typography>Make your app management easy and fun!</Typography>
            </div>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
              <CustomTextField
                autoFocus
                fullWidth
                label='Company Name'
                placeholder='Enter company name'
                {...register('name', { required: 'Company name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <CustomTextField
                autoFocus
                fullWidth
                label='First Name'
                placeholder='Enter your first name'
                {...register('first_name', { required: 'First name is required' })}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
              />
              <CustomTextField
                autoFocus
                fullWidth
                label='Last Name'
                placeholder='Enter your last name'
                {...register('last_name', { required: 'Last name is required' })}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
              />
              <CustomTextField
                fullWidth
                label='Email'
                placeholder='Enter your email'
                {...register('email', { required: 'Email is required' })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <CustomTextField
                autoFocus
                fullWidth
                label='Mobile'
                placeholder='Enter your mobile'
                {...register('mobile', { required: 'Mobile number is required' })}
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
              />
              <CustomTextField
                fullWidth
                label='Password'
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
              {/* <CustomTextField
                select
                fullWidth
                id='user_type'
                label='Select user type'
                inputProps={{ placeholder: 'User', ...register('user_type') }}
                error={!!errors.user_type}
                helperText={errors.user_type?.message}
              >
                {userTypes &&
                  userTypes?.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.type}
                    </MenuItem>
                  ))}
              </CustomTextField> */}

              <CustomTextField
                autoFocus
                fullWidth
                label='Country'
                placeholder='Enter your country'
                {...register('country', { required: 'Country is required' })}
                error={!!errors.country}
                helperText={errors.country?.message}
              />
              <CustomTextField
                autoFocus
                fullWidth
                label='City'
                placeholder='Enter your city'
                {...register('city', { required: 'City is required' })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
              <CustomTextField
                autoFocus
                fullWidth
                label='Address'
                placeholder='Enter your address'
                {...register('address', { required: 'Address is required' })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
              <CustomTextField
                autoFocus
                fullWidth
                label='Postal Code'
                placeholder='Enter postal code'
                {...register('postalCode', { required: 'Postal code is required' })}
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message}
              />
              <FormControlLabel
                control={<Checkbox checked={isChecked} onChange={e => setIsChecked(e.target.checked)} />}
                label={
                  <>
                    <span>I agree to </span>
                    <Link className='text-primary' href='/' onClick={e => e.preventDefault()}>
                      privacy policy & terms
                    </Link>
                  </>
                }
              />
              <Button fullWidth variant='contained' type='submit' disabled={loading}>
                Sign Up
              </Button>
              {loading && <Loader />}
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>Already have an account?</Typography>
                <Link href={getLocalizedUrl('/login', locale)}>
                  <Typography color='primary'>Sign in instead</Typography>
                </Link>
              </div>
            </form>
            <Toaster />
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
