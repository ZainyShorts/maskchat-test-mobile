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
import { createMenu, updateMenu } from '@/api/menu'
import toast, { Toaster } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { getAllResturants } from '@/api/resturant'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/types/apps/businessTypes'
import { ToppingDataType } from '@/api/interface/toppingInterface'
import { getAllFoodTypes, getAllFoodTypesOfSpecificBusiness } from '@/api/foodTypes'
import OpenDialogOnElementClick from '../OpenDialogOnElementClick'
import type { ButtonProps } from '@mui/material/Button'
import type { ThemeColor } from '@core/types'
import Loader from '@/components/loader/Loader'
import AddType from '@/components/dialogs/add-type'

type AddtMenuFormProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: MenuDataType
  onTypeAdded?: any
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

const AddtMenuForm = ({ open, setOpen, data, onTypeAdded }: AddtMenuFormProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [restosData, setRestosData] = useState<BusinessType[]>([])
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [FoodTypeData, setFoodTypeData] = useState<ToppingDataType[]>([])
  const [addType, setAddType] = useState<boolean>(false)
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [businessId, setBusinessId] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  // console.log(businessId, 'businessId')

  const handleRestaurantChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedRestaurant = restosData?.find(rest => rest.id === event.target.value)
    // console.log(selectedRestaurant, 'selectedRestaurant')
    setSelectedBrand(selectedRestaurant?.name || '')
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<MenuDataType>()

  const fetchFoodTypes = async () => {
    try {
      const response = await getAllFoodTypesOfSpecificBusiness(businessId)
      // console.log(response, 'response')

      setFoodTypeData(response?.data)
    } catch (error: any) {
      // Handle error
    }
  }

  useEffect(() => {
    if (businessId) {
      fetchFoodTypes()
    }
  }, [addType, businessId])

  const handleBusinessChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedBusiness = userBusinessData.find(b => b.id === event.target.value)
    if (selectedBusiness) {
      setBusinessId(selectedBusiness.business_id) // Store business.business_id in state
    } else {
      setBusinessId('')
    }
  }

  // States
  const onSubmit = (data: MenuDataType, e: any) => {
    e.preventDefault()
    setLoading(true)
    setAddType(false)

    const payload = {
      ...data,
      title: data.title,
      brand: selectedBrand,
      description: data.description,
      availability: 'in stock',
      condition: 'good',
      category: category,
      business: data.business,
      restaurant: data.restaurant,
      image_link: data.image_link,
      link: data.link,
      price: data.price,
      sku: data.sku,
      type: data.type,
      sale_price: data.sale_price
    }

    console.log(payload)
    console.log(payload, 'paload')
    createMenu(payload)
      .then(res => {
        toast.success('Catalouge created successfully', {
          duration: 5000 // Duration in milliseconds (5 seconds)
        })
        if (onTypeAdded) {
          onTypeAdded()
        }

        setAddType(true)
        reset()
        setOpen(false)
      })
      .catch(error => {
        console.log(error)
        if (error?.data && error?.data?.availability[0]) {
          toast.error(error?.data?.availability[0], {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        } else {
          toast.error('Error in creating Catalouge', {
            duration: 5000 // Duration in milliseconds (5 seconds)
          })
        }
      })
      .finally(() => {
        setLoading(false)
        reset()
      })
  }

  const handleReset = () => {
    // handleClose()
    setOpen(false)
    reset()
    setBusinessId('')
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

  const handleTypeAdded = () => {
    fetchFoodTypes()
  }
  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Add Catalouge Information
      </DialogTitle>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
            <Grid container spacing={5} alignItems='center'>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Title *'
                  fullWidth
                  placeholder='Enter Title'
                  {...register('title', { required: 'Title is required' })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Sku *'
                  fullWidth
                  placeholder='Enter sku'
                  // {...register('sku', { required: 'sku is required' })}
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
                  label='Price *'
                  fullWidth
                  placeholder='Enter  price '
                  {...register('price', {
                    required: 'Price is required',
                  })}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              </Grid>

               <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Sale Price *'
                  fullWidth
                  placeholder='Enter price'
                  {...register('sale_price')}
                  error={!!errors.sale_price}
                  helperText={errors.sale_price?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  fullWidth
                  id='business'
                  label='Select Business *'
                  {...register('business', { required: 'Business Id is required ' })}
                  error={!!errors.business}
                  helperText={errors.business?.message}
                  onChange={handleBusinessChange}
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
                  label='Description *'
                  fullWidth
                  placeholder='Enter Description '
                  {...register('description', { required: 'Description is required ' })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Product Link *'
                  fullWidth
                  placeholder='Enter Product link '
                  {...register('link', { required: 'Product Link is required ' })}
                  error={!!errors.link}
                  helperText={errors.link?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Image Link *'
                  fullWidth
                  placeholder='Enter Image Link '
                  {...register('image_link', { required: 'Image Link is required ' })}
                  error={!!errors.image_link}
                  helperText={errors.image_link?.message}
                />
              </Grid>
              {businessId && (
                <>
                  {/* <Grid item xs={12} sm={6}>
                    <CustomTextField
                      select
                      fullWidth
                      id='restaurant'
                      // label='Select Outlet (Optional)'
                      label='Select Outlet'
                      inputProps={{ placeholder: 'Outlet', ...register('restaurant') }}
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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CustomTextField
                        select
                        fullWidth
                        label='Select Type *'
                        {...register('type', {
                          required: 'Type is required'
                        })}
                        error={!!errors.business}
                        helperText={errors.business?.message}
                        style={{ flex: 1 }} // Takes up remaining space
                      >
                        {/* {FoodTypeData &&
                          FoodTypeData?.map(food => (
                            <MenuItem key={food.id} value={food.id}>
                              {food.name}
                            </MenuItem>
                          ))} */}
                        {FoodTypeData.length > 0 ? (
                          FoodTypeData.map(food => (
                            <MenuItem key={food.id} value={food.id}>
                              {food.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled value=''>
                            No type available
                          </MenuItem>
                        )}
                      </CustomTextField>

                      <div style={{ marginLeft: '10px', marginTop: errors.title ? '0px' : '17px', flex: '0 0 10%' }}>
                        <OpenDialogOnElementClick
                          element={Button}
                          elementProps={buttonProps('Add', 'primary', 'contained')}
                          dialog={AddType}
                          dialogProps={{}}
                          onTypeAdded={handleTypeAdded} // Pass the callback
                        />
                      </div>
                    </div>
                  </Grid>
                </>
              )}
            </Grid>
            <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16 mt-5'>
              <Button variant='contained' type='submit' disabled={loading}>
                Submit
              </Button>
              <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
                Cancel
              </Button>
            </DialogActions>

            {loading && <Loader />}
          </DialogContent>
        </form>

        <Toaster />
      </div>
    </Dialog>
  )
}

export default AddtMenuForm
