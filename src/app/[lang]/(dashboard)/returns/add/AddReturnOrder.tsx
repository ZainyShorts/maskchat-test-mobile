'use client'

import { useEffect, useState, useRef } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import toast, { Toaster } from 'react-hot-toast'
import CustomTextField from '@core/components/mui/TextField'
import { OrderInterface } from '@/api/interface/menuIterface'
import { searchOrder } from '@/api/order'
import useDebounce from '@/customHooks/useDebounce'
import '@/components/InputStyle.css'
import Loader from '@/components/loader/Loader'
import { ReturnOrder } from '@/api/interface/orderReturnInterface'
import { useForm } from 'react-hook-form'
import { createOrderReturns } from '@/api/orderReturns'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { useParams, useRouter } from 'next/navigation'
import { MenuItem } from '@mui/material'

interface OrderItem {
  id: number
  name: string
  product_sku: string
  quantity: number
  original_quantity: number
  status: string
  total_price: number
  unit_price?: number
  delivery_type?: string
  address?: string
}

const RETURN_REASONS = [
  { value: 'wrong_order', label: 'Wrong Order' },
  { value: 'wrong_address', label: 'Wrong Address' },
  { value: 'late_shipping', label: 'Late Shipping' }
]

const AddReturnOrder: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { lang: locale } = useParams()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchResults, setSearchResults] = useState<OrderInterface[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderInterface | null>(null)
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([])
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const { handleSubmit, reset } = useForm<ReturnOrder>()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // console.log(selectedItems, 'selectedItems-------')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchOrderItems = async () => {
      if (debouncedSearchTerm.trim() === '') {
        setSearchResults([])
        setShowDropdown(false)
        return
      }

      try {
        const response = await searchOrder(debouncedSearchTerm.toLowerCase())
        const results = response?.data?.results || []

        const filteredResults = results.filter((item: any) =>
          item.order_number.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )

        setSearchResults(filteredResults)
        setShowDropdown(filteredResults.length > 0)
      } catch (err: any) {
        console.error('Error fetching orders:', err)
        toast.error(err.message || 'Failed to fetch orders')
      }
    }

    searchOrderItems()
  }, [debouncedSearchTerm])

  const handleSelectOrder = (order: any) => {
    const processedItems = (order.order_items || []).map((item: any) => ({
      ...item,
      total_price: parseFloat(item.total_price) || 0,
      quantity: parseInt(item.quantity) || 1,
      original_quantity: parseInt(item.quantity) || 1,
      status: 'wrong_order', // Default status for each item
      unit_price: parseFloat(item.total_price) / (parseInt(item.quantity) || 1),
      delivery_type: order.delivery_type
    }))

    setSelectedOrder(order)
    setSelectedItems(processedItems)
    setSearchTerm('')
    setSearchResults([])
    setShowDropdown(false)
  }

  const handleRemoveItem = (itemId: number) => {
    setSelectedItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setSelectedItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const validQuantity = Math.min(Math.max(1, newQuantity), item.original_quantity)
          const unitPrice = item.unit_price || item.total_price / item.original_quantity
          return {
            ...item,
            quantity: validQuantity,
            total_price: parseFloat((unitPrice * validQuantity).toFixed(2))
          }
        }
        return item
      })
    )
  }

  const handleStatusChange = (itemId: number, newStatus: string) => {
    setSelectedItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            status: newStatus
          }
        }
        return item
      })
    )
  }

  const handleReset = () => {
    setSelectedOrder(null)
    setSelectedItems([])
    setSearchTerm('')
    reset()
  }

  const total = selectedItems.reduce((acc, item) => acc + (Number(item.total_price) || 0), 0)

  const onSubmit = async () => {
    if (!selectedItems || selectedItems.length === 0) {
      toast.error('Please add some order items to proceed.')
      return
    }

    setLoading(true)

    const submissionData = {
      order: selectedOrder?.id,
      user: selectedOrder?.user?.id,
      business: selectedOrder?.business?.id,
      delivery_type: selectedOrder?.delivery_type,
      address: selectedOrder?.delivery_type === 'pickup' ? 'no address' : selectedOrder?.address,
      special_instruction: selectedOrder?.special_instruction,
      tax_price: 0,
      discount_price: 0,
      net_price: total,
      total_price: total,
      return_items: selectedItems.map(item => ({
        ...item,
        total_price: Number(item.total_price),
        address: selectedOrder?.delivery_type === 'pickup' ? 'no address' : item?.address
      }))
    }

    try {
      const res = await createOrderReturns(submissionData)
      toast.success('Return order created successfully')
      router.replace(getLocalizedUrl('/returns', locale as Locale))
    } catch (error: any) {
      toast.error(error.message || 'Failed to create return order')
    } finally {
      setLoading(false)
      reset()
    }
  }

  return (
    <Card>
      <CardContent className='sm:!p-12'>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <div className='container'>
              <div className='searchContainer' ref={dropdownRef}>
                <input
                  type='text'
                  value={searchTerm}
                  placeholder='Search order items by order number'
                  className='input'
                  onChange={e => setSearchTerm(e.target.value)}
                />

                {showDropdown && (
                  <ul className='dropdown'>
                    {searchResults.length > 0 ? (
                      searchResults.map((item: any) => (
                        <li key={item.id} className='dropdownItem' onClick={() => handleSelectOrder(item)}>
                          <strong>{item.order_number}</strong>: {item.order_number}
                        </li>
                      ))
                    ) : (
                      <li className='noResults'>No results found.</li>
                    )}
                  </ul>
                )}
              </div>

              {selectedItems.length > 0 && (
                <table className='table'>
                  <thead>
                    <tr>
                      <th className='theading'>ID</th>
                      <th className='theading'>NAME</th>
                      <th className='theading'>PRODUCT SKU</th>
                      <th className='theading'>QUANTITY</th>
                      <th className='theading'>STATUS</th>
                      <th className='theading'>PRICE</th>
                      <th className='theading'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.map(item => (
                      <tr key={item.id}>
                        <td className='tdata'>{item.id}</td>
                        <td className='tdata'>{item.name}</td>
                        <td className='tdata'>{item.product_sku}</td>
                        <td className='tdata'>
                          <input
                            type='number'
                            min='1'
                            max={item.original_quantity}
                            value={item.quantity}
                            onChange={e => handleQuantityChange(item.id, parseInt(e.target.value))}
                            className='quantityInput'
                            style={{
                              outline: 'none',
                              border: 'none',
                              cursor: item.quantity === 1 ? 'not-allowed' : 'default',
                              padding: '8px 12px',
                              width: '60px',
                              textAlign: 'center',
                              fontSize: '16px',
                              MozAppearance: 'textfield',
                              appearance: 'textfield',
                              WebkitAppearance: 'none',
                              marginRight: '-12px',
                              overflow: 'hidden'
                            }}
                          />
                        </td>
                        <td className='tdata'>
                          <CustomTextField
                            select
                            fullWidth
                            label='Select Reason to Return'
                            value={item.status}
                            onChange={e => handleStatusChange(item.id, e.target.value)}
                            variant='outlined'
                            margin='normal'
                          >
                            {RETURN_REASONS.map(reason => (
                              <MenuItem key={reason.value} value={reason.value}>
                                {reason.label}
                              </MenuItem>
                            ))}
                          </CustomTextField>
                        </td>
                        <td className='tdata'>${Number(item.total_price).toFixed(2)}</td>
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
                  <Typography>Total Amount:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ${total.toFixed(2)}
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            <Divider className='border-dashed' />
          </Grid>

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

          <Grid item xs={12}>
            <div className='flex items-center gap-4'>
              <Button variant='contained' onClick={handleSubmit(onSubmit)} disabled={loading}>
                Save Return Order
              </Button>
              <Button variant='outlined' onClick={handleReset} type='button'>
                Reset
              </Button>
            </div>
            {loading && <Loader />}
          </Grid>
        </Grid>
        <Toaster />
      </CardContent>
    </Card>
  )
}

export default AddReturnOrder
