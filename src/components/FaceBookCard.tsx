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

import { FeedWhatsApp } from '@/api/whatsapp'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import { BusinessType } from '@/types/apps/businessTypes'
import { getAllBusiness } from '@/api/business'
import MenuItem from '@mui/material/MenuItem'
import { getFeedToChatGpt } from '@/api/feedToChatGPT'
import { FeedToChatGptType } from '@/api/interface/interfaceFeedToGPT'
import toast, { Toaster } from 'react-hot-toast'
import { FaceBook } from '@/api/facebook'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'

type FaceBookDataType = {
  business?: number | string
  facebook_id?: string
  access_token?: string
  webhook_token?: string
  facebook_account_id?: number
  catalog_id?: string
  feed_to_gpt?: number | string
  active?: boolean
}

const FaceBookCard = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [feedToGptData, setFeedToGptData] = useState<FeedToChatGptType[]>([])

  const router = useRouter()
  const { lang: locale } = useParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<FaceBookDataType>()

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

  useEffect(() => {
    const fetchFeedToChatGpt = async () => {
      try {
        const response = await getFeedToChatGpt()

        console.log(response?.data?.results, 'All getFeedToChatGpt Data')

        setFeedToGptData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch business')
      } finally {
        // setLoading(false)
      }
    }

    fetchFeedToChatGpt()
  }, [])

  //

  const onSubmit = (data: any, e: any) => {
    e.preventDefault()
    setLoading(true)
    // console.log(data, 'data')

    FaceBook(data)
      .then(res => {
        // console.log(res, 'create FeedWhatsApp')
        toast.success('FaceBook created successfully')
        // router.replace('/home')
        router.replace(getLocalizedUrl('/home', locale as Locale))
      })
      .catch(error => {
        console.log(error, 'error in FeedWhatsApp')
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
          <CardHeader title='FaceBook' subheader='Display content from your connected accounts on your site' />
          <CardContent className='flex flex-col gap-4'>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='facebook_id'
                  fullWidth
                  placeholder='Enter facebook_id'
                  {...register('facebook_id', { required: 'facebook_id is required' })}
                  error={!!errors.facebook_id}
                  helperText={errors.facebook_id?.message}
                />
              </Grid>
              {/*  */}
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Access Token'
                  fullWidth
                  placeholder='Enter Access Token'
                  {...register('access_token', { required: 'Access Token is required' })}
                  error={!!errors.access_token}
                  helperText={errors.access_token?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Webhook Token'
                  fullWidth
                  {...register('webhook_token', { required: 'Webhook Token is required' })}
                  error={!!errors.webhook_token}
                  helperText={errors.webhook_token?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* <CustomTextField
                label='WhatsApp Account ID'
                fullWidth
                {...register('whatsapp_account_id', { required: 'WhatsApp Account ID is required' })}
                error={!!errors.whatsapp_account_id}
                helperText={errors.whatsapp_account_id?.message}
              /> */}
                <CustomTextField
                  label='facebook_account_id'
                  fullWidth
                  type='number' // Set the input type to 'number'
                  {...register('facebook_account_id', {
                    required: 'facebook_account_id is required',
                    valueAsNumber: true // This ensures the value is parsed as a number
                  })}
                  error={!!errors.facebook_account_id}
                  helperText={errors.facebook_account_id?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Catalog ID'
                  fullWidth
                  {...register('catalog_id', { required: 'Catalog ID is required' })}
                  error={!!errors.catalog_id}
                  helperText={errors.catalog_id?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* <CustomTextField
                  label='Feed to GPT'
                  fullWidth
                  {...register('feed_to_gpt', { required: 'Feed to GPT is required' })}
                  error={!!errors.feed_to_gpt}
                  helperText={errors.feed_to_gpt?.message}
                /> */}
                <CustomTextField
                  select
                  fullWidth
                  id='feed_to_gpt'
                  label='Select feed_to_gpt'
                  inputProps={{ placeholder: 'feed_to_gpt', ...register('feed_to_gpt') }}
                  error={!!errors.feed_to_gpt}
                  helperText={errors.feed_to_gpt?.message}
                >
                  {feedToGptData &&
                    feedToGptData?.map(feed => (
                      <MenuItem key={feed.id} value={feed.business}>
                        {feed.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
              {/* business */}
              {/* name */}
              <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
                <FormControl error={!!errors.active}>
                  <FormControlLabel
                    control={
                      <Checkbox {...register('active', { required: 'Active must be checked' })} color='primary' />
                    }
                    label='Active'
                  />
                  {errors.active && <FormHelperText>{errors.active.message}</FormHelperText>}
                </FormControl>
              </Grid>
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

export default FaceBookCard
