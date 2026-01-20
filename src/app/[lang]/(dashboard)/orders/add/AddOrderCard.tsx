'use client'

// React Imports
import { useEffect, useState, useRef } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'

import CustomTextField from '@core/components/mui/TextField'
import { SearchedMenuItem } from '@/api/interface/menuIterface'
import { createOrderUsingMenuSearch, searchMenu } from '@/api/order'
import useDebounce from '@/customHooks/useDebounce'
import '@/components/InputStyle.css'
import { BusinessType } from '@/types/apps/businessTypes'

import { CreateOrder } from '@/api/interface/orderInterface'
import { getAllResturants } from '@/api/resturant'
import { ResturantDataType } from '@/api/interface/resturantInterface'
import Loader from '@/components/loader/Loader'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { useParams, useRouter } from 'next/navigation'

const AddOrderCard = () => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [userBusinessesData, setUserBusinessesData] = useState<BusinessType[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<string | number>('')
  const [selectedBusinessData, setSelectedBusinessData] = useState<BusinessType | null>(null)
  const [selectedBusinessId, setSelectedBusinessId] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchResults, setSearchResults] = useState<SearchedMenuItem[]>([])
  const [selectedItems, setSelectedItems] = useState<SearchedMenuItem[]>([])
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [menuData, setMenuData] = useState<SearchedMenuItem[]>([])
  const [subtotal, setSubtotal] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    const calculateTotals = () => {
      const subTotalCalc = selectedItems.reduce(
        (acc, item) => acc + Number(item.price || 0) * (item.quantity_to_sell_on_facebook || 1),
        0
      )
      setSubtotal(subTotalCalc)
      setTotal(subTotalCalc) // Since tax is 0
    }

    calculateTotals()
  }, [selectedItems])

  const orderItems = selectedItems.map(item => ({
    product_sku: item.sku,
    quantity: 1, // Default quantity
    description: item.description,
    size: item.size || 'Default Size', // Use value or fallback
    spice_level: 'Medium', // Placeholder
    extra_toppings: 'Cheese', // Placeholder
    instruction: 'Extra crispy', // Placeholder
    tax_price: '0.00', // Placeholder
    net_price: item.price, // Map price
    total_price: `${(Number(item.price) + 1.0).toFixed(2)}`
  }))

  // MenuDataType
  const dropdownRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<CreateOrder>()

  // Use the debounce hook to delay the search execution
  const debouncedSearchTerm = useDebounce(searchTerm, 300) // 300ms delay

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Function to handle selecting an item from dropdown
  const handleSelectItem = (item: SearchedMenuItem) => {
    // Prevent adding duplicates
    if (!selectedItems.find(selected => selected.id === item.id)) {
      setSelectedItems(prev => [...prev, item])
    }
    // Clear search
    setSearchTerm('')
    setSearchResults([])
    setShowDropdown(false)
  }

  useEffect(() => {
    const searchMenuItems = async () => {
      if (debouncedSearchTerm.trim() === '') {
        setSearchResults([])
        setShowDropdown(false)
        return
      }
      try {
        const params = debouncedSearchTerm.toLowerCase()
        // console.log(params, 'params')

        const response = await searchMenu(params)
        setMenuData(response?.data?.results)
        // console.log(response?.data?.results, 'response')
      } catch (err: any) {
        console.error('Error fetching menu items:', err)
        // toast.error(err.message || 'Failed to fetch businesses')
      }
      // const results = menuData.filter(item => item.sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))

      const results = menuData.filter(item =>
        [item.sku, item.title, item.menu_number].some(key =>
          key.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
      )
      setSearchResults(results)
      setShowDropdown(true)
    }

    searchMenuItems()
  }, [debouncedSearchTerm])

  // Function to handle removing an item from the table
  const handleRemoveItem = (id: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id))
  }

  useEffect(() => {
    const fetchResturants = async () => {
      try {
        const response = await getAllResturants()
        const businesses = response?.data?.results || []
        setUserBusinessesData(businesses)

        if (businesses.length > 0) {
          const defaultBusiness = businesses[0]
          setSelectedBusiness(defaultBusiness.id)
          setSelectedBusinessId(defaultBusiness.id)
          setSelectedBusinessData(defaultBusiness)
        }
      } catch (err: any) {
        console.error('Error fetching businesses:', err)
        // toast.error(err.message || 'Failed to fetch businesses')
      }
    }

    fetchResturants()
  }, [])

  const handleBusinessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const businessId = Number(event.target.value)
    setSelectedBusiness(businessId)

    const business = userBusinessesData.find(b => b.id === businessId)
    if (business) {
      setSelectedBusinessData(business)
    } else {
      setSelectedBusinessData(null)
    }
  }

  const onSubmit = (data: any, e: any) => {
    e.preventDefault()
    // console.log(data, '7878')

    if (!orderItems || orderItems.length === 0) {
      toast.error('Please add some menu items to proceed.')
      return
    }

    setLoading(true)

    const submissionData = {
      ...data,
      restaurant: selectedBusinessData?.id,
      business: selectedBusinessId,
      tax_price: 0.0,
      net_price: subtotal,
      total_price: total,
      order_items: orderItems
    }

    console.log(submissionData, 'submissionData')

    createOrderUsingMenuSearch(submissionData)
      .then(res => {
        console.log(res, 'create Order')
        setLoading(false)
        toast.success('Order created successfully')
        router.replace(getLocalizedUrl('/orders', locale as Locale))
      })
      .catch(error => {
        console.log(error, 'error in creating order')
        if (error?.data && error?.data?.restaurant[0]) {
          toast.error(error?.data?.restaurant[0])
        } else if (error?.data && error?.data?.business[0]) {
          toast.error(error?.data?.business[0])
        } else {
          toast.error('Error in creating order')
        }
      })
      .finally(() => {
        setLoading(false)
        reset()
      })
  }

  return (
    <>
      <Card>
        <CardContent className='sm:!p-12'>
          <Grid container spacing={6}>
            {/* Header Section */}
            <Grid item xs={12}>
              <div className='p-6 bg-actionHover rounded'>
                <div className='flex justify-between gap-4 flex-col sm:flex-row'>
                  <div className='flex flex-col gap-6'>
                    <div className='flex items-center gap-2.5'>
                      <Typography variant='h5' className='min-is-[95px]'>
                        Select Resturant:
                      </Typography>
                      <CustomTextField
                        className='w-full sm:w-auto'
                        select
                        fullWidth
                        // id='business-select'
                        value={selectedBusiness}
                        onChange={handleBusinessChange}
                        variant='outlined'
                      >
                        {userBusinessesData.length > 0 ? (
                          userBusinessesData.map(business => (
                            <MenuItem key={business.id} value={business.id}>
                              {business.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value='' disabled>
                            No resturant available
                          </MenuItem>
                        )}
                      </CustomTextField>
                    </div>

                    <div>
                      <Typography color='text.primary'>{selectedBusinessData?.city}</Typography>
                      <Typography color='text.primary'>{selectedBusinessData?.contact_number}</Typography>
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
                        {selectedBusinessData?.active ? 'Active' : 'In Active'}
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
            </Grid>
            <Grid item xs={12}>
              <div className='container'>
                <div className='searchContainer' ref={dropdownRef}>
                  <input
                    type='text'
                    value={searchTerm}
                    placeholder='Search menu items'
                    className='input'
                    onChange={e => setSearchTerm(e.target.value)}
                  />

                  {showDropdown && searchResults.length > 0 && (
                    <ul className='dropdown'>
                      {searchResults.map(item => (
                        <li key={item.id} className='dropdownItem' onClick={() => handleSelectItem(item)}>
                          <strong>{item.sku}</strong>: {item.sku}
                        </li>
                      ))}
                    </ul>
                  )}
                  {showDropdown && searchResults.length === 0 && (
                    <ul className='dropdown'>
                      <li className='noResults'>No results found.</li>
                    </ul>
                  )}
                </div>

                {selectedItems.length > 0 && (
                  <table className='table'>
                    <thead>
                      <tr>
                        <th className='theading'>ID</th>
                        <th className='theading'>SKU</th>
                        <th className='theading'>TITLE</th>
                        <th className='theading'>PRICE</th>
                        <th className='theading'>QTY</th>
                        <th className='theading'>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItems.map((item, index) => (
                        <tr key={item.id}>
                          <td className='tdata'>{item.id}</td>
                          <td className='tdata'>{item.sku}</td>
                          <td className='tdata'>{item.title}</td>
                          <td className='tdata'>{item.price}</td>

                          <td className='tdata'>
                            {' '}
                            <input
                              type='number'
                              value={item.quantity_to_sell_on_facebook}
                              min={1}
                              style={{ outline: 'none', textAlign: 'center', maxWidth: '50px' }}
                              onChange={e => {
                                const newQuantity = Math.max(1, parseInt(e.target.value, 10)) // Ensure value is >= 1
                                setSelectedItems(prevItems =>
                                  prevItems.map((prevItem, idx) =>
                                    idx === index
                                      ? { ...prevItem, quantity_to_sell_on_facebook: newQuantity }
                                      : prevItem
                                  )
                                )
                              }}
                            />
                          </td>

                          <td className='tdata'>
                            <button onClick={() => handleRemoveItem(item.id)} className='removeButton'>
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className='flex justify-between flex-col gap-4 sm:flex-row'>
                <div className='flex flex-col gap-4 order-2 sm:order-[unset]'>
                  <div className='flex items-center gap-2'>
                    <Typography className='font-medium' color='text.primary'>
                      Salesperson:
                    </Typography>
                    <Typography className='font-medium' color='text.primary'>
                      Tommy Shelby
                    </Typography>
                  </div>
                  <Typography className='font-medium' color='text.primary'>
                    Thanks for your business
                  </Typography>
                </div>
                <div className='min-is-[200px]'>
                  <div className='flex items-center justify-between'>
                    <Typography>Subtotal:</Typography>
                    <Typography className='font-medium' color='text.primary'>
                      ${subtotal.toFixed(2)}
                    </Typography>
                  </div>
                  <div className='flex items-center justify-between'>
                    <Typography>Discount:</Typography>
                    <Typography className='font-medium' color='text.primary'>
                      $0.00
                    </Typography>
                  </div>
                  <div className='flex items-center justify-between'>
                    <Typography>Tax:</Typography>
                    <Typography className='font-medium' color='text.primary'>
                      $0.00
                    </Typography>
                  </div>
                  <Divider className='my-2' />
                  <div className='flex items-center justify-between'>
                    <Typography>Total:</Typography>
                    <Typography className='font-medium' color='text.primary'>
                      ${total.toFixed(2)}
                    </Typography>
                  </div>
                </div>
              </div>
            </Grid>

            {/* Divider */}
            <Grid item xs={12}>
              <Divider className='border-dashed' />
            </Grid>

            {/* Note Section */}
            <Grid item xs={12}>
              <InputLabel htmlFor='invoice-note' className='inline-flex mb-1 text-textPrimary'>
                Note:
              </InputLabel>
              <CustomTextField
                id='invoice-note'
                rows={2}
                fullWidth
                multiline
                className='border rounded'
                defaultValue='It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!'
              />
            </Grid>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
              <div className='flex items-center gap-4'>
                <Button variant='contained' type='submit' disabled={loading}>
                  Save Order
                </Button>
              </div>
              {loading && <Loader />}
            </form>
          </Grid>
          <Toaster />
        </CardContent>
      </Card>
    </>
  )
}

export default AddOrderCard
