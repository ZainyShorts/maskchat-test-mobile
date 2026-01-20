'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

// Component Imports
import Logo from '@components/layout/shared/Logo'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { useEffect, useState } from 'react'
import { OrderReturnDataType, ReturnItem } from '@/api/interface/orderReturnInterface'
import { getOrderReturnsById } from '@/api/orderReturns'
import {
  convertToPakistanDatePlus10Days,
  convertToPakistanDateWithoutTime,
  convertToPakistanTime
} from '@/utils/dateUtils'

type PreviewOrderReturnDetailsProps = {
  id: string
}

const OrderReturnDetails = ({ id }: PreviewOrderReturnDetailsProps) => {
  const [returnOrderItemData, setReturnOrderItemData] = useState<OrderReturnDataType | null>(null)

  const [returnItemsData, setReturnItemsData] = useState<ReturnItem[]>([])
  const [subtotal, setSubtotal] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [tax, setTax] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    const fetchOrderReturns = async () => {
      try {
        const response = await getOrderReturnsById(Number(id))

        setReturnOrderItemData(response?.data)
        setReturnItemsData(response?.data?.return_items)
      } catch (error: any) {
        console.log(error, 'error')
        // business_address
        // Handle error
      }
    }
    fetchOrderReturns()
  }, [id])

  useEffect(() => {
    // Function to parse price strings and return a number
    const parsePrice = (priceStr: string): number => {
      // Remove any non-numeric characters except the decimal point
      const numericStr = priceStr.replace(/[^0-9.]/g, '')
      return parseFloat(numericStr) || 0
    }

    // Calculate Subtotal
    const calculatedSubtotal = returnItemsData?.reduce((acc, item) => {
      const price = parsePrice(item.total_price)
      return acc + price * item.quantity
    }, 0)
    setSubtotal(calculatedSubtotal)

    // Example: Apply a fixed discount or derive from data
    const calculatedDiscount = 0 // Modify as needed
    setDiscount(calculatedDiscount)

    // Example: Calculate tax as 21% of (subtotal - discount)
    const taxRate = 0.21 // 21%
    const calculatedTax = taxRate * (calculatedSubtotal - calculatedDiscount)
    setTax(calculatedTax)

    // Calculate Total
    const calculatedTotal = calculatedSubtotal - calculatedDiscount + calculatedTax
    setTotal(calculatedTotal)
  }, [returnItemsData])

  return (
    <Card>
      <CardContent className='sm:!p-12'>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <div className='p-6 bg-actionHover rounded'>
              <div className='flex justify-between gap-y-4 flex-col sm:flex-row'>
                <div className='flex flex-col gap-6'>
                  <div className='flex items-center gap-2.5'>
                    <Logo />
                  </div>
                  <div>
                    <Typography color='text.primary'>{returnOrderItemData && returnOrderItemData.address}</Typography>

                    <Typography color='text.primary'>
                      Order Status: {returnOrderItemData && returnOrderItemData.order_status}
                    </Typography>
                    <Typography color='text.primary'>
                      Delivery Type: {returnOrderItemData && returnOrderItemData.delivery_type}
                    </Typography>
                  </div>
                </div>
                <div className='flex flex-col gap-6'>
                  <Typography variant='h5'>{`Return Order Number #${returnOrderItemData && returnOrderItemData.return_order_number}`}</Typography>
                  <div className='flex flex-col gap-1'>
                    <Typography color='text.primary'>{`Date Issued: ${returnOrderItemData && convertToPakistanDateWithoutTime(returnOrderItemData.created_at)}`}</Typography>
                    <Typography color='text.primary'>{`Date Due: ${returnOrderItemData && convertToPakistanDatePlus10Days(returnOrderItemData.created_at)}`}</Typography>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Invoice To:
                  </Typography>
                  <div>
                    <Typography>Name :{returnOrderItemData?.user?.name}</Typography>
                    <Typography>Email :{returnOrderItemData?.user?.email}</Typography>
                    <Typography>Address :{returnOrderItemData?.business?.business_address}</Typography>
                    <Typography>Contact :{returnOrderItemData?.business?.contact_number}</Typography>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div className='overflow-x-auto border rounded'>
              <table className={tableStyles.table}>
                <thead className='border-bs-0'>
                  <tr>
                    <th className='!bg-transparent'>Name</th>
                    <th className='!bg-transparent'>Size</th>
                    <th className='!bg-transparent'>Status</th>
                    <th className='!bg-transparent'>Qty</th>
                    <th className='!bg-transparent'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {returnItemsData && returnItemsData.length > 0 ? (
                    returnItemsData.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>
                          <Typography color='text.primary'>{item.product_sku}</Typography>
                        </td>
                        <td>
                          <Typography color='text.primary'>{item.size}</Typography>
                        </td>
                        <td>
                          <Typography color='text.primary'>{item.status}</Typography>
                        </td>

                        <td>
                          <Typography color='text.primary'>{item.quantity}</Typography>
                        </td>
                        <td>
                          <Typography color='text.primary'>{item.total_price}</Typography>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className='text-center'>
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className='flex justify-between flex-col gap-y-4 sm:flex-row'>
              <div className='flex flex-col gap-1 order-2 sm:order-[unset]'>
                <div className='flex items-center gap-2'>
                  <Typography className='font-medium' color='text.primary'>
                    Salesperson:
                  </Typography>
                  <Typography>Tommy Shelby</Typography>
                </div>
                <Typography>Thanks for your business</Typography>
              </div>
              <div className='min-is-[200px]'>
                <div className='flex items-center justify-between'>
                  <Typography>Subtotal:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    ${subtotal?.toFixed(2)}
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Discount:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    $ 0
                  </Typography>
                </div>
                <div className='flex items-center justify-between'>
                  <Typography>Tax:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    $ 0
                  </Typography>
                </div>
                <Divider className='mlb-2' />
                <div className='flex items-center justify-between'>
                  <Typography>Total:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    {/* ${total?.toFixed(2)} */}${subtotal?.toFixed(2)}
                  </Typography>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Divider className='border-dashed' />
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <Typography component='span' className='font-medium' color='text.primary'>
                Note:
              </Typography>{' '}
              It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance
              projects. Thank You!
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default OrderReturnDetails
