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

import { convertToPakistanDatePlus10Days, convertToPakistanDateWithoutTime } from '@/utils/dateUtils'
import { OrderItems } from '@/types/apps/orderTypes'
import { BusinessDataTypeForAddBusiness } from '@/api/interface/businessInterface'
import { OrderDataType } from '@/api/interface/orderInterface'
import { getOrderById } from '@/api/order'

type PreviewOrderReturnDetailsProps = {
  id: string
}

const OrderPreviewDetails = ({ id }: PreviewOrderReturnDetailsProps) => {
  const [orderAddress, setOrderAddress] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<string | null>(null)
  const [orderDeliveryType, setOrderDeliveryType] = useState<string | null>(null)
  const [orderCreatedDate, setOrderCreatedDate] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [orderSpecialInstruction, setOrderSpecialInstruction] = useState<string | null>(null)

  const [orderItemsData, setOrderItemsData] = useState<OrderItems[]>([])
  const [orderBusinessData, setOrderBusinessData] = useState<BusinessDataTypeForAddBusiness | null>(null)
  const [orderTotalPrice, setOrderTotalPrice] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(Number(id))
        console.log(response, 'response of single order By whats Eat')
        setOrderTotalPrice(response?.data?.total_price)
        setOrderAddress(response?.data?.address)
        setOrderStatus(response?.data?.status)
        setOrderDeliveryType(response?.data?.delivery_type)
        setOrderNumber(response?.data?.order_number)
        setOrderItemsData(response?.data?.order_items)
        setOrderBusinessData(response?.data?.business)
        setOrderCreatedDate(response?.data?.created_at)
        setOrderSpecialInstruction(response?.data?.special_instruction)
      } catch (error: any) {
        console.error('An error occurred while fetching order data:', error)
      }
    }
    fetchOrder()
  }, [id])

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
                    <Typography color='text.primary'>{orderAddress && orderAddress}</Typography>

                    <Typography color='text.primary'>Order Status: {orderStatus && orderStatus}</Typography>
                    <Typography color='text.primary'>
                      Delivery Type: {orderDeliveryType && orderDeliveryType}
                    </Typography>
                  </div>
                </div>
                <div className='flex flex-col gap-6'>
                  <Typography variant='h5'>{`Order Number #${orderNumber && orderNumber}`}</Typography>
                  <div className='flex flex-col gap-1'>
                    <Typography color='text.primary'>{`Date Issued: ${orderCreatedDate && convertToPakistanDateWithoutTime(orderCreatedDate)}`}</Typography>
                    <Typography color='text.primary'>{`Date Due: ${orderCreatedDate && convertToPakistanDatePlus10Days(orderCreatedDate)}`}</Typography>
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
                    <Typography>name</Typography>
                    <Typography>company</Typography>
                    <Typography>address</Typography>
                    <Typography>contact</Typography>
                    <Typography>companyEmail</Typography>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Bill To:
                  </Typography>
                  <div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Total Due:</Typography>
                      <Typography>$12,110.55</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Bank name:</Typography>
                      <Typography>American Bank</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Country:</Typography>
                      <Typography>United States</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>IBAN:</Typography>
                      <Typography>ETD95476213874685</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>SWIFT code:</Typography>
                      <Typography>BR91905</Typography>
                    </div>
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
                    <th className='!bg-transparent'>Special Instructions</th>
                    <th className='!bg-transparent'>Status</th>
                    <th className='!bg-transparent'>Qty</th>
                    <th className='!bg-transparent'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItemsData && orderItemsData.length > 0 ? (
                    orderItemsData.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>
                          <Typography color='text.primary'>{item.name}</Typography>
                        </td>
                        <td>
                          <Typography color='text.primary'>{item.instruction}</Typography>
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
                <Divider className='mlb-2' />
                <div className='flex items-center justify-between'>
                  <Typography>Total:</Typography>
                  <Typography className='font-medium' color='text.primary'>
                    $ {orderTotalPrice}
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
                Special Instructions:
              </Typography>{' '}
              {orderSpecialInstruction && orderSpecialInstruction}; Thank You!
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default OrderPreviewDetails
