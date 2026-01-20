'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { useAuthStore } from '@/store/authStore'
// import toast, { Toaster } from 'react-hot-toast'
// import  { Toaster } from 'react-hot-toast'
import { toast as hotToast, Toaster } from 'react-hot-toast'
import { deletUser } from '@/api/user'
import { useRouter } from 'next/navigation'

const AccountDelete = () => {
  // States

  const { user } = useAuthStore()
  const router = useRouter()

  // console.log(user, 'user')

  const id: number = user?.id ?? 0

  // Hooks
  const {
    control,
    watch,
    handleSubmit,
    reset, // Destructure reset here,
    formState: { errors }
  } = useForm({ defaultValues: { checkbox: false } })

  // Vars
  const checkboxValue = watch('checkbox')

  const onSubmit = () => {
    deletUser(id.toString())
      .then(res => {
        console.log(res, 'User deleted')
        hotToast.success('User  deleted successfully')
        reset()

        router.replace('/home') // Optionally, redirect or refresh the page
      })
      .catch(error => {
        console.log(error, 'error in deleting User ')

        if (error?.data && error?.data?.detail) {
          hotToast.error(error?.data?.detail)
        } else {
          hotToast.error('Error in deleting User')
        }
      })
  }

  return (
    <Card>
      <CardHeader title='Delete Account' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl error={Boolean(errors.checkbox)} className='is-full mbe-6'>
            <Controller
              name='checkbox'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel control={<Checkbox {...field} />} label='I confirm my account deactivation' />
              )}
            />
            {errors.checkbox && <FormHelperText error>Please confirm you want to delete account</FormHelperText>}
          </FormControl>
          <Button variant='contained' color='error' type='submit' disabled={!checkboxValue}>
            Deactivate Account
          </Button>
        </form>
        <Toaster />
      </CardContent>
    </Card>
  )
}

export default AccountDelete
