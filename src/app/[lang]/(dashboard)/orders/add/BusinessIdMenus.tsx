'use client'
// this is backup of  new updated Api for foodTypes using businessId
// will have to implement it by tomorrow
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Tabs, Tab, Box, Typography, Button, Card, IconButton, MenuItem, Divider } from '@mui/material'
import { ToppingDataType } from '@/api/interface/toppingInterface'
import { getAllFoodTypes, getAllFoodTypesOfSpecificBusiness } from '@/api/foodTypes'
import { getAllMenuesByBusinessId, getAllMenues } from '@/api/menu'
import { MenuDataType } from '@/api/interface/menuIterface'
import MenuCard from './MenuCard'
import CustomTextField from '@/@core/components/mui/TextField'

import { CreateOrder } from '@/api/interface/orderInterface'
import { useForm } from 'react-hook-form'
import { getAllResturants } from '@/api/resturant'
import toast, { Toaster } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import Loader from '@/components/loader/Loader'
import { createOrder } from '@/api/order'
import { RestaurantType } from '@/types/apps/restoTypes'

const OrderMenuBar = () => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateOrder>()

  const [restoData, setRestoData] = useState<RestaurantType[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<string | number>('')
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | number>('')
  const [selectedRestoData, setSelectedRestoData] = useState<RestaurantType>()
  const [selectedRestoId, setSelectedRestoId] = useState<number>(0)
  const [selectedRestoUserId, setSelectedRestoUserId] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [value, setValue] = useState(0)
  const [foodTypeData, setFoodTypeData] = useState<ToppingDataType[]>([])
  const [id, setId] = useState<number | null>(null)
  const [allMenus, setAllMenus] = useState<MenuDataType[]>([])
  const [filteredMenus, setFilteredMenus] = useState<MenuDataType[]>([])

  const [order, setOrder] = useState<
    { id: number; sku: string; size: string; description: string; name: string; price: number; quantity: number }[]
  >([])
  const [subtotal, setSubtotal] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    const selectedFood = foodTypeData[newValue]
    if (selectedFood) {
      setId(selectedFood.id)
    }
  }

  useEffect(() => {
    const fetchResturants = async () => {
      try {
        const response = await getAllResturants()
        const restos = response?.data?.results || []
        setRestoData(restos)
      } catch (err: any) {
        console.error('Error fetching businesses:', err)
        // toast.error(err.message || 'Failed to fetch businesses')
      }
    }

    fetchResturants()
  }, [])

  const handleRestoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const restoId = Number(event.target.value)

    setSelectedRestoId(restoId)
    const restoObj = restoData.find(b => b.id === restoId)
    if (restoObj) {
      // console.log(restoObj?.business, 'restoObj?.business?.business_id')
      setSelectedBusinessId(restoObj?.business?.business_id)
      setSelectedBusiness(restoObj?.business?.id)
      setSelectedRestoUserId(restoObj?.business?.user?.id)
      setSelectedRestoData(restoObj)
    } else {
      setSelectedRestoUserId(0)
      setSelectedBusiness(0)
    }
  }

  // const fetchFoodTypesUsingBusinessId = async () => {
  //   try {
  //     // const response = await getAllFoodTypes()
  //     const response = await getAllFoodTypesOfSpecificBusiness(selectedBusinessId)

  //     const results = response?.data?.results
  //     setFoodTypeData(results)
  //   } catch (error) {
  //     console.error('Error fetching data:', error)
  //   }
  // }

  // useEffect(() => {
  //   if (selectedBusinessId) {
  //     fetchFoodTypesUsingBusinessId()
  //   }
  // }, [selectedBusinessId])

  const fetchFoodTypesUsingBusinessId = async () => {
    try {
      // const response = await getAllFoodTypes()
      const response = await getAllFoodTypesOfSpecificBusiness(selectedBusinessId)

      const results = response?.data
      console.log(response, 'fetchFoodTypesUsingBusinessId')
      setFoodTypeData(results)

      const menuData = await getAllMenuesByBusinessId(selectedBusinessId.toString())
      const menuResults: MenuDataType[] = menuData?.data?.results
      console.log('fod---- types', menuResults)
      setAllMenus(menuResults)

      if (results?.length > 0) {
        const firstId = results[0].id
        setId(firstId)
        setFilteredMenus(menuResults.filter(menu => menu.type === firstId))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (selectedBusinessId) {
      fetchFoodTypesUsingBusinessId()
    }
  }, [selectedBusinessId])

  useEffect(() => {
    if (id) {
      setFilteredMenus(allMenus.filter(menu => menu?.type?.id === id))
    }
  }, [id, allMenus])

  // Calculate totals whenever order changes
  useEffect(() => {
    const calculateTotals = () => {
      const subTotalCalc = order.reduce((acc, item) => acc + Number(item.price || 0) * item.quantity, 0)
      setSubtotal(subTotalCalc)
      setTotal(subTotalCalc) // Since tax is 0
    }

    calculateTotals()
  }, [order])

  const addToOrder = (item: MenuDataType) => {
    setOrder(prev => {
      const existingItem = prev.find(orderItem => orderItem.id === item.id)
      if (existingItem) {
        return prev.map(orderItem =>
          orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem
        )
      }
      return [
        ...prev,
        {
          id: item.id,
          sku: item.sku,
          size: item.size || 'Default Size', // Ensure size exists
          description: item.description,
          name: item.title || 'Unknown', // Ensure name exists
          price: item.price,
          quantity: 1
        }
      ]
    })
  }

  const incrementQuantity = (id: number) => {
    setOrder(prev => prev.map(item => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
  }

  const decrementQuantity = (id: number) => {
    setOrder(prev =>
      prev
        .map(item => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
        .filter(item => item.quantity > 0)
    )
  }

  const deleteItem = (id: number) => {
    setOrder(prev => prev.filter(item => item.id !== id))
  }

  const onSubmit = (data: any, e: any) => {
    e.preventDefault()

    if (!order || order.length === 0) {
      toast.error('Please add some menu items to proceed.')
      return
    }

    setLoading(true)

    const orderItems = order.map(item => ({
      product_sku: item.sku,
      quantity: item.quantity,
      description: item.description,
      size: item.size || 'Default Size',
      spice_level: 'Medium',
      extra_toppings: 'Cheese',
      instruction: 'Extra crispy',
      tax_price: '0.00',
      net_price: item.price,
      total_price: `${(Number(item.price) * item.quantity).toFixed(2)}`
    }))

    const submissionData = {
      ...data,
      restaurant: selectedRestoId,
      user: selectedRestoUserId,
      business: selectedBusiness,
      tax_price: 0.0,
      net_price: subtotal,
      total_price: total,
      order_items: orderItems
    }

    // console.log(submissionData, ' submissionData')

    // Add your order submission API call here
    createOrder(submissionData)
      .then(res => {
        setLoading(false)
        toast.success('Order created successfully')
        router.replace(getLocalizedUrl('/orders', locale as Locale))
      })
      .catch(error => {
        console.error('Error creating order:', error)
        toast.error('Error creating order')
      })
      .finally(() => {
        setLoading(false)
        reset()
      })
  }

  return (
    <div>
      <Box sx={{ bgcolor: 'background.paper' }} className='mb-5'>
        <div className='p-6 rounded'>
          <div className='flex justify-between gap-4 flex-col sm:flex-row'>
            <div className='flex flex-col gap-6'>
              <div className='flex items-center gap-2.5'>
                <Typography variant='h5' className='min-is-[95px]'>
                  Select Outlet:
                </Typography>
                <CustomTextField
                  className='w-full sm:w-auto'
                  select
                  fullWidth
                  value={selectedRestoId}
                  onChange={handleRestoChange}
                  variant='outlined'
                >
                  {restoData.length > 0 ? (
                    restoData.map(resto => (
                      <MenuItem key={resto.id} value={resto.id}>
                        {resto.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value='' disabled>
                      No outlet available
                    </MenuItem>
                  )}
                </CustomTextField>
              </div>

              <div>
                <Typography color='text.primary'>{selectedRestoData?.city}</Typography>
                <Typography color='text.primary'>{selectedRestoData?.contact_number}</Typography>
              </div>
              <div className='flex items-center'>
                <CustomTextField
                  label='Enter Special Instruction *'
                  fullWidth
                  multiline
                  rows={3}
                  placeholder='Enter Special Instruction'
                  {...register('special_instruction', { required: 'Special Instruction is required' })}
                  error={!!errors.special_instruction}
                  helperText={errors.special_instruction?.message}
                />
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-4'>
                <Typography variant='h5' className='min-is-[95px]'>
                  Resturant Details:
                </Typography>
              </div>
              <div className='flex items-center'>
                <Typography className='min-is-[95px] mie-4' color='text.primary'>
                  Resturant Status:
                </Typography>
                <Typography className='min-is-[95px] mie-4' color='text.primary'>
                  {selectedRestoData?.active ? 'Active' : 'In Active'}
                </Typography>
              </div>
              <div className='flex items-center'>
                <CustomTextField
                  select
                  fullWidth
                  id='delivery_type'
                  label='Select Delivery Type *'
                  {...register('delivery_type', {
                    required: 'Delivery Type is required'
                  })}
                  error={!!errors.delivery_type}
                  helperText={errors.delivery_type?.message}
                >
                  <MenuItem value='delivery'>Delivery</MenuItem>
                  <MenuItem value='pickup'>Pick Up</MenuItem>
                </CustomTextField>
              </div>
              <div className='flex items-center'>
                <CustomTextField
                  label='Enter Address *'
                  fullWidth
                  multiline
                  rows={3}
                  placeholder='Enter Address'
                  {...register('address', { required: 'Address is required' })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </div>
            </div>
          </div>
        </div>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, width: '100%' }}>
        <Box sx={{ width: '75%', bgcolor: 'background.paper', textAlign: 'left' }}>
          <Tabs value={value} onChange={handleChange} variant='scrollable' scrollButtons allowScrollButtonsMobile>
            {foodTypeData?.map((food, index) => (
              <Tab label={food.name} key={food.id} value={index} sx={{ fontWeight: 'bold' }} />
            ))}
          </Tabs>
          <Box className='m-5' style={{ display: 'flex', gap: '8px' }}>
            {filteredMenus.length > 0 ? (
              filteredMenus.map((product, index) => (
                <MenuCard key={index} product={product} onAdd={() => addToOrder(product)} />
              ))
            ) : (
              <Typography variant='h6' color='text.secondary' className='m-5'>
                No menu available
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ width: '25%', bgcolor: 'background.paper' }}>
          <Card sx={{ p: 2 }}>
            <Typography variant='h6' className='mb-4'>
              Current Order
            </Typography>

            {order.map(item => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  p: 1,
                  borderBottom: '1px solid #eee'
                }}
              >
                <Box>
                  <Typography variant='body1'>{item.name}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton size='small' onClick={() => decrementQuantity(item.id)} sx={{ border: '1px solid #ddd' }}>
                    -
                  </IconButton>
                  <Typography component='span' mx={1}>
                    {item.quantity}
                  </Typography>
                  <IconButton size='small' onClick={() => incrementQuantity(item.id)} sx={{ border: '1px solid #ddd' }}>
                    +
                  </IconButton>
                  <IconButton size='small' color='error' onClick={() => deleteItem(item.id)}>
                    ×
                  </IconButton>
                </Box>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax:</Typography>
                <Typography>$0.00</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <Typography>Total:</Typography>
                <Typography>${total.toFixed(2)}</Typography>
              </Box>
            </Box>

            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={handleSubmit(onSubmit)}
              disabled={loading || order.length === 0}
            >
              Process Order
            </Button>
          </Card>
        </Box>
      </Box>

      {loading && <Loader />}
      <Toaster />
    </div>
  )
}

export default OrderMenuBar
