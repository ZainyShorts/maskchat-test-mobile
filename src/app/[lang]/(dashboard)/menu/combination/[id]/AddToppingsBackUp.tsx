// MUI Imports
'use client'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import CustomTextField from '@core/components/mui/TextField'
import { useForm } from 'react-hook-form'
import MenuItem from '@mui/material/MenuItem'
import Loader from '@/components/loader/Loader'
import { createToppings, getTopping, getToppingsByBusinessId } from '@/api/toppings'
import { getAllBusiness } from '@/api/business'
import { BusinessType } from '@/types/apps/businessTypes'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import type { ButtonProps } from '@mui/material/Button'
import type { ThemeColor } from '@core/types'
import AddType from '@/components/dialogs/add-type'
import { getAllFoodTypes } from '@/api/foodTypes'
import { ToppingDataType } from '@/api/interface/toppingInterface'

type PreviewToppingsProps = {
  id: string
  isCreated: boolean
  onCreateTopping: (isCreated: boolean) => void
}
const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

// MenuDataType

const AddToppings = ({ id, isCreated, onCreateTopping }: PreviewToppingsProps) => {
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [BusinessToppingsData, setBusinessToppingsData] = useState<ToppingDataType[]>([])
  const [FoodTypeData, setFoodTypeData] = useState<ToppingDataType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [addType, setAddType] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ToppingDataType>()

  const onSubmit = (data: ToppingDataType, e: any) => {
    e.preventDefault()
    onCreateTopping(false)
    setLoading(true)

    createToppings(data)
      .then(res => {
        toast.success('Topping saved successfully')
        onCreateTopping(true)
        setAddType(true)
        reset()
        reset({
          business: 0,
          type: 0
        })
      })
      .catch(error => {
        console.log(error, 'topping create error')

        if (error?.data && error?.data?.name[0]) {
          toast.error(error?.data?.name[0])
        } else {
          toast.error('Error in creating order')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    const fetchFoodTypes = async () => {
      try {
        const response = await getAllFoodTypes()
        setFoodTypeData(response?.data?.results)
      } catch (error: any) {
        // Handle error
      }
    }
    fetchFoodTypes()
  }, [id, addType])

  //
  const fetchTopping = async () => {
    try {
      const response = await getTopping(Number(id))

      setBusinessToppingsData(response?.data)
    } catch (error: any) {
      // Handle error
    }
  }
  useEffect(() => {
    fetchTopping()
  }, [id, addType])

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
  const handleTypeAdded = () => {
    fetchTopping()
  }

  return (
    <>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
          <Grid container spacing={5} alignItems='center'>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Topping Name *'
                fullWidth
                placeholder='Enter Topping Name'
                {...register('name', { required: 'Topping Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='business'
                label='Select Business*'
                value={watch('business') || 0} // Add this line to control the displayed value
                {...register('business', {
                  required: 'Business ID is required',
                  validate: value => (value !== 0 ? true : 'Business ID is required')
                })}
                error={!!errors.business}
                helperText={errors.business?.message}
              >
                <MenuItem key='Select Business' value={0}>
                  Select Business
                </MenuItem>
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
                label='Topping Description *'
                fullWidth
                placeholder='Enter Topping Description'
                {...register('description', { required: 'Topping Description is required' })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Additional Price *'
                fullWidth
                type='number'
                placeholder='Enter Additional Price'
                inputProps={{ step: 'any', min: '0' }} // Allows precise decimal values
                {...register('additional_price', {
                  required: 'Additional Price is required',
                  pattern: {
                    value: /^(0\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?|\d)$/, // Accepts positive integers & decimals, prevents leading zeros
                    message: 'Only positive integers or decimal values are allowed'
                  },
                  min: {
                    value: 0, // Ensures greater than 0
                    message: 'Value must be at least 0'
                  }
                })}
                error={!!errors.additional_price}
                helperText={errors.additional_price?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CustomTextField
                  select
                  fullWidth
                  id='business'
                  label='Select Food Type *'
                  value={watch('type') || 0}
                  {...register('type', {
                    required: 'Food Type is required',
                    validate: value => (value !== 0 ? true : 'Food Type is required')
                  })}
                  error={!!errors.type}
                  helperText={errors.type?.message}
                  style={{ flex: 1 }} // Takes up remaining space
                >
                  <MenuItem key='Select Food Type' value={0}>
                    Select Food Type
                  </MenuItem>
                  {FoodTypeData &&
                    FoodTypeData?.map(food => (
                      <MenuItem key={food.id} value={food.id}>
                        {food.name}
                      </MenuItem>
                    ))}
                </CustomTextField>

                <div style={{ marginLeft: '10px', marginTop: errors.description ? '0px' : '15px', flex: '0 0 10%' }}>
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

            <Grid item xs={12} sm={6}>
              <div className='flex items-center gap-4' style={{ marginTop: errors.description ? '0px' : '15px' }}>
                <Button variant='contained' type='submit' disabled={loading}>
                  Save Topping
                </Button>
              </div>
              {loading && <Loader />}
            </Grid>
          </Grid>
        </form>
        <Toaster />
      </Card>
    </>
  )
}

export default AddToppings
