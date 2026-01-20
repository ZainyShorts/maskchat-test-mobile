'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { useForm } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BusinessType } from '@/types/apps/businessTypes'
import { getAllBusiness } from '@/api/business'
import MenuItem from '@mui/material/MenuItem'

import { FeedToChatGptType } from '@/api/interface/interfaceFeedToGPT'
import { postalCodesDataType } from '@/api/interface/postalCodesInterface'
import { FeedPostalCodes } from '@/api/postalCodes'
import toast, { Toaster } from 'react-hot-toast'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'

const PostalCodesComp = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])

  const router = useRouter()
  const { lang: locale } = useParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<postalCodesDataType>()

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()

        // console.log(response?.data?.results, 'All Business Data')

        setUserBusinessData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch business')
      } finally {
        // setLoading(false)
      }
    }

    fetchBusiness()
  }, [])

  //

  const onSubmit = (data: postalCodesDataType, e: any) => {
    e.preventDefault()
    setLoading(true)
    // console.log(data, 'data')

    FeedPostalCodes(data)
      .then(res => {
        toast.success('Postal Code added successfully')
        // router.replace('/home')
        router.replace(getLocalizedUrl('/home', locale as Locale))

        // Redirect or perform any other actions on success
        // router.replace('/menu')
      })
      .catch(error => {
        console.log(error, 'error in FeedPostalCodes')
      })
      .finally(() => {
        setLoading(false)
        reset() // Reset the form after submission
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader
            title='Postal Codes'
            subheader='Display postal codes of business from your connected accounts on your site'
          />
          <CardContent className='flex flex-col gap-4'>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  id='business'
                  label='Select Business'
                  inputProps={{ placeholder: 'Business', ...register('business') }}
                  error={!!errors.business}
                  helperText={errors.business?.message}
                >
                  {userBusinessData &&
                    userBusinessData?.map(business => (
                      <MenuItem key={business.id} value={business.id}>
                        {business.business_id}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label='City'
                fullWidth
                placeholder='Enter City'
                {...register('city', { required: 'City is required' })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label='Codes'
                fullWidth
                placeholder='Enter Code'
                {...register('code', { required: 'Code is required' })}
                error={!!errors.code}
                helperText={errors.code?.message}
              />
            </Grid>
            <Box display='flex' justifyContent='center' mt={3}>
              <Button type='submit' variant='contained' color='primary' disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </form>
      <Toaster />
    </>
  )
}

export default PostalCodesComp
