// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { useParams, useRouter } from 'next/navigation'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { MenuItem } from '@mui/material'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'

import Loader from '@/components/loader/Loader'

import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/types/apps/businessTypes'

import { CreateChatGPT, getChatGpt } from '@/api/chatGpt'
import { ChatGptType } from '@/api/interface/interfaceChatGPT'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'

type Props = {
  open: boolean
  handleClose: () => void
}

const AddChatGptDrawer = ({ open, handleClose }: Props) => {
  const { lang: locale } = useParams()
  const [loading, setLoading] = useState<boolean>(false)
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [chatGptData, setChatGptData] = useState<ChatGptType[]>([])

  // States

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<ChatGptType>()

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
    const fetchChatGpt = async () => {
      try {
        const response = await getChatGpt()

        setChatGptData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch business')
      } finally {
        // setLoading(false)
      }
    }

    fetchChatGpt()
  }, [])

  //

  const onSubmit = (data: ChatGptType, e: any) => {
    e.preventDefault()
    setLoading(true)

    CreateChatGPT(data)
      .then(res => {
        toast.success('Chat Gpt created successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })

        handleClose()

        router.replace(getLocalizedUrl('/account-settings', locale as Locale))
      })
      .catch(error => {
        console.log(error, 'error in Chat Gpt')
      })
      .finally(() => {
        setLoading(false)
        reset() // Reset the form after submission
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
        <Typography variant='h5'> Chat GPT</Typography>
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
                <Grid item xs={12}>
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

                <Grid item xs={12}>
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
                    label='Gpt Api Key *'
                    fullWidth
                    {...register('gpt_api_key', { required: 'Gpt Api Key is required' })}
                    error={!!errors.gpt_api_key}
                    helperText={errors.gpt_api_key?.message}
                  />
                </Grid>
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

export default AddChatGptDrawer
