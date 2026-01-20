'use client'

// React Imports
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import { MenuDataType } from '@/api/interface/menuIterface'
import { updateMenu } from '@/api/menu'
import toast, { Toaster } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { getAllResturants } from '@/api/resturant'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/types/apps/businessTypes'

type EditMenuInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: MenuDataType
  onTypeAdded?: any
}

const EditMenuInfo = ({ open, setOpen, data, onTypeAdded }: EditMenuInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { lang: locale } = useParams()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<MenuDataType>()

  // States
  const [userData, setUserData] = useState<EditMenuInfoProps['data'] | null>(data || null)
  const [restosData, setRestosData] = useState<BusinessType[]>([])
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>('')

  const handleRestaurantChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedRestaurant = restosData?.find(rest => rest.id === event.target.value)
    setSelectedBrand(selectedRestaurant?.name || '')
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data1: MenuDataType, e: any) => {
    e.preventDefault()
    const submittedPayload = {
      ...data,
      title: data1.title,
      description: data1.description,
      availability: 'in stock',
      condition: 'good',
      business: data1.business,
      restaurant: data1.restaurant,
      image_link: data1.image_link,
      link: data1.link,
      price: data1.price,
      sku: data1.sku,
      sale_price: data1.sale_price
    }
    const id: number = data?.id ?? 0
    updateMenu(id, data1)
      .then(res => {
        toast.success('Menu Updated Successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        if (onTypeAdded) {
          onTypeAdded()
        }

        setOpen(false)
      })
      .catch(error => {
        console.log(error, 'error Menu Update api')
        if (error?.data) {
          toast.error(error?.data?.type[0], {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        } else {
          toast.error('error in updating Catalouge', {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

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
    const fetchResturants = async () => {
      try {
        const response = await getAllResturants()

        setRestosData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch users')
      } finally {
        // setLoading(false)
      }
    }

    fetchResturants()
  }, [])

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Edit Catalouge Information
        <Typography component='span' className='flex flex-col text-center'>
          Updating catalouge details will receive a privacy audit.
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Title'
                defaultValue={data?.title || ''}
                {...register('title', {
                  required: 'Title is required'
                })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Description'
                defaultValue={data?.description || ''}
                {...register('description', {
                  required: 'Description is required'
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Type'
                defaultValue={data?.type?.name || ''}
                // {...register('type', {
                //   required: 'Type is required'
                // })}
                inputProps={{
                  placeholder: 'Food Type',
                  readOnly: true // Set the field as read-only
                  // ...register('business_doc')
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='SKU'
                defaultValue={data?.sku || ''}
                {...register('sku', {
                  required: 'SKU is required',
                  // pattern: {
                  //   value: /^[a-z0-9_]+$/,
                  //   message: 'Only lowercase letters, numbers, and underscores are allowed'
                  // }
                })}
                error={!!errors.sku}
                helperText={errors.sku?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Status'
                defaultValue={data?.status}
                {...register('status', { required: 'Status is required' })}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value='' disabled>
                  Select Status
                </MenuItem>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='pending'>Pending</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Image link'
                placeholder={data && data?.image_link}
                defaultValue={data?.image_link}
                {...register('image_link', { required: 'Image link is required' })}
                error={!!errors.image_link}
                helperText={errors.image_link?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Link'
                placeholder={data && data?.image_link}
                defaultValue={data?.image_link}
                {...register('image_link', { required: 'link is required' })}
                error={!!errors.image_link}
                helperText={errors.image_link?.message}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='restaurant'
                label='Select Outlet'
                inputProps={{ placeholder: 'Outlet', ...register('restaurant') }}
                defaultValue={data?.restaurant || ''}
                onChange={handleRestaurantChange}
                error={!!errors.restaurant}
                helperText={errors.restaurant?.message}
              >
                {restosData &&
                  restosData?.map(rest => (
                    <MenuItem key={rest.id} value={rest.id}>
                      {rest.name}
                    </MenuItem>
                  ))}
              </CustomTextField>
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='business'
                label='Select Business'
                inputProps={{ placeholder: 'Business', ...register('business') }}
                defaultValue={data?.business || ''}
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
                label='Price(currency symbol)'
                fullWidth
                placeholder='Enter  price '
                defaultValue={data?.price || ''}
                {...register('price', {
                  required: 'Price is required'
                })}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Sale Price'
                fullWidth
                defaultValue={data?.sale_price || ''}
                placeholder='Enter price'
                {...register('sale_price')}
                error={!!errors.sale_price}
                helperText={errors.sale_price?.message}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Category'
                defaultValue={data?.category || ''}
                {...register('category', { required: 'Category is required' })}
                error={!!errors.category}
                helperText={errors.category?.message}
              >
                {['stitched', 'unstitched'].map(option => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid> */}

            
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            Submit
          </Button>
          <Button variant='tonal' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
      <Toaster />
    </Dialog>
  )
}

export default EditMenuInfo
