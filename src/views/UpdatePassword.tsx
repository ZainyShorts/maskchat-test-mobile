'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

import { useParams, useRouter } from 'next/navigation'

import toast, { Toaster } from 'react-hot-toast'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import classnames from 'classnames'

import type { ThemeColor, SystemMode } from '@core/types'

// Third-party Imports

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'
import type { updateUserPasswordData } from '@/api/interface/userInterface'
import { updateUserPassword } from '@/api/user'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'

// Styled Custom Components
const ResetPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 650,
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
  maxBlockSize: 330,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

// Vars
const darkImg = '/images/pages/auth-mask-dark.png'
const lightImg = '/images/pages/auth-mask-light.png'
const darkIllustration = '/images/illustrations/auth/v2-reset-password-dark.png'
const lightIllustration = '/images/illustrations/auth/v2-reset-password-light.png'

const UpdatePassword = ({ mode }: { mode: SystemMode }) => {
  const router = useRouter()
  const { lang: locale } = useParams() as { lang: Locale }

  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Hooks
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<updateUserPasswordData>()

  const onSubmit = (data: updateUserPasswordData, e: any) => {
    e.preventDefault()

    setLoading(true)
    updateUserPassword(data)
      .then(res => {
        if (res?.status === 200) {
          toast.success(res?.data?.message, {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
          // router.push('/login')
          router.push(getLocalizedUrl('/login', locale))
        }
      })
      .catch(error => {
        toast.error(error?.data?.error || 'An error occurred while updating the password.', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <ResetPasswordIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && (
          <MaskImg
            alt='mask'
            src={authBackground}
            className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
          />
        )}
      </div>

      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Update Password 🔒</Typography>
            <Typography>Your new password must be different from previously used passwords</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <CustomTextField
              autoFocus
              fullWidth
              label='Old Password'
              {...register('old_password', { required: 'Old Password is required' })}
              error={!!errors.old_password}
              helperText={errors.old_password?.message}
              type={isPasswordShown ? 'text' : 'password'}
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
              fullWidth
              label='New Password'
              {...register('new_password', { required: 'New password is required' })}
              error={!!errors.new_password}
              helperText={errors.new_password?.message}
              type={isConfirmPasswordShown ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              Set New Password
            </Button>
            <Typography className='flex justify-center items-center' color='primary'>
              <Link href={getLocalizedUrl('/login', locale)} className='flex items-center gap-1.5'>
                <DirectionalIcon
                  ltrIconClass='tabler-chevron-left'
                  rtlIconClass='tabler-chevron-right'
                  className='text-xl'
                />
                <span>Back to login</span>
              </Link>
            </Typography>
          </form>
          <Toaster />
        </div>
      </div>
    </div>
  )
}

export default UpdatePassword
