// React Imports
import { useEffect, useRef, useState } from 'react'

// MUI Imports
import { useParams, useRouter } from 'next/navigation'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { InputAdornment, MenuItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

import Loader from '@/components/loader/Loader'

import { CreateFeedToGPT, getFeedToChatGpt } from '@/api/feedToChatGPT'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/types/apps/businessTypes'
import { FeedToChatGptType } from '@/api/interface/interfaceFeedToGPT'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'

type Props = {
  open: boolean
  handleClose: () => void
}

const AddFeedToGptDrawer = ({ open, handleClose }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [feedToGptData, setFeedToGptData] = useState<FeedToChatGptType[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const router = useRouter()
  const { lang: locale } = useParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<FeedToChatGptType>()

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()

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

  const onSubmit = (data: FeedToChatGptType, e: any) => {
    e.preventDefault()
    setLoading(true)
    // console.log(data, 'data')

    const formData: any = new FormData()

    formData.append('business', data.business)
    formData.append('name', data.name)
    formData.append('user_name', data.user_name)
    formData.append('website_url', data.website_url)
    formData.append('api_url', data.api_url)
    formData.append('password', data.password)
    formData.append('desc', data.desc)

    if (data.file && data.file.length > 0) {
      formData.append('file', data.file[0]) // Assuming single file upload
    }

    CreateFeedToGPT(formData)
      .then(res => {
        toast.success('Feed To GPT created successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        handleClose()

        router.replace(getLocalizedUrl('/account-settings', locale as Locale))

        reset()
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      })
      .catch(error => {
        console.log(error, 'error in creation Feed To GPT')
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
        <Typography variant='h5'> Feed To GPT</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
          <Card>
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    id='business'
                    label='Select Business *'
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
                    label='Name *'
                    fullWidth
                    placeholder='Enter name '
                    {...register('name', { required: 'name is required' })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>
                {/*  */}
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Website url *'
                    fullWidth
                    placeholder='Enter Website url'
                    {...register('website_url', { required: 'Website url is required' })}
                    error={!!errors.website_url}
                    helperText={errors.website_url?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Api url *'
                    fullWidth
                    {...register('api_url', { required: 'Api url is required' })}
                    error={!!errors.api_url}
                    helperText={errors.api_url?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='User name *'
                    fullWidth
                    {...register('user_name', {
                      required: 'User name is required'
                    })}
                    error={!!errors.user_name}
                    helperText={errors.user_name?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Password *'
                    placeholder='············'
                    {...register('password', { required: 'Password is required' })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    id='outlined-adornment-password'
                    type={isPasswordShown ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Description *'
                    fullWidth
                    {...register('desc', { required: 'Description is required' })}
                    error={!!errors.desc}
                    helperText={errors.desc?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    type='file' // Input type as 'file'
                    label='Business Document *'
                    fullWidth
                    inputProps={{
                      accept: '*' // Accept any file type
                    }}
                    {...register('file', {
                      required: 'File document is required',
                      validate: value => (value && value.length > 0) || 'File document is required'
                    })}
                    error={!!errors.file}
                    helperText={errors.file?.message}
                  />
                </Grid>
              </Grid>

              <div className='flex items-center gap-4'>
                <Button variant='contained' type='submit' disabled={loading}>
                  Submit
                </Button>
                <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
                  Cancel
                </Button>
              </div>
              {loading && <Loader />}
            </CardContent>
          </Card>
        </form>
        <Toaster />
      </div>
    </Drawer>
  )
}

export default AddFeedToGptDrawer
