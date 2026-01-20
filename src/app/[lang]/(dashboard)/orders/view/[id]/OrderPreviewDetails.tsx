"use client"

// Component Imports

// React Imports
import { useEffect, useState } from "react"

// Utility Imports


// Type Imports

// API Imports
import { getOrderById } from "@/api/order"
import { getAllBusiness } from "@/api/business"
import { BusinessDataTypeForAddBusiness } from "@/api/interface/businessInterface"
import { OrderItems, OrderUserObject } from "@/types/apps/orderTypes"
import Logo from "@/@core/svg/Logo"
import OrderItemComponent from "@/components/OrderItemComponent"
import { convertToPakistanDateWithoutTime, convertToPakistanTime, convertToPakistanTimePlusOneHourWithDate } from "@/utils/dateUtils"
import { getBaseUrl } from "@/api/vars/vars"

type PreviewOrderReturnDetailsProps = {
  id: string
}

const OrderPreviewDetails = ({ id }: PreviewOrderReturnDetailsProps) => {
  // State Hooks
  const [orderAddress, setOrderAddress] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<string | null>(null)
  const [orderDeliveryType, setOrderDeliveryType] = useState<string | null>(null)
  const [orderCreatedDate, setOrderCreatedDate] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [orderTotalPrice, setOrderTotalPrice] = useState<number | null>(0)
  const [orderSpecialInstruction, setOrderSpecialInstruction] = useState<string | null>(null)
  const [orderItemsData, setOrderItemsData] = useState<OrderItems[]>([])
  const [orderBusinessData, setOrderBusinessData] = useState<BusinessDataTypeForAddBusiness | null>(null)
  const [orderUserData, setOrderUserData] = useState<OrderUserObject | null>(null)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currency, setCurrency] = useState<string>("") // Renamed from setData to setCurrency for clarity

  // Fetch Order Data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(Number(id))
        const data = response?.data
        console.log(data)
        setOrderTotalPrice(response?.data?.total_price)
        setOrderAddress(data?.address || null)
        setOrderStatus(data?.status || null)
        setOrderDeliveryType(data?.delivery_type || null)
        setOrderNumber(data?.order_number || null)
        setOrderItemsData(data?.order_items || [])
        setOrderBusinessData(data?.business || null)
        setOrderCreatedDate(data?.created_at || null)
        setOrderSpecialInstruction(data?.special_instruction || null)

        // Fetch customer data using the mock getCustomerById
        const customer = await getCustomerById(data?.customer)
        setOrderUserData(customer)
      } catch (error: any) {
        console.error("An error occurred while fetching order data:", error)
        setError("Failed to fetch order data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    const getCustomerById = async (id: string) => {
        try {
          const response = await fetch(`${getBaseUrl()}whatseat/customer/${id}/`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const customer = await response.json();
          console.log("Customer data:", customer);
          return customer;
        } catch (error) {
          console.error("Error fetching customer:", error);
          return null;
        }
      };


    const fetchBusinessCurrency = async () => {
      try {
        const response = await getAllBusiness()
        const businesses = response?.data?.results || []
        if (businesses.length > 0 && businesses[0].currency) {
          setCurrency(businesses[0].currency.symbol)
        } else {
          setCurrency("$") // Default currency if not found
        }
      } catch (err: any) {
        console.error("Failed to fetch business:", err.message)
        setCurrency("$") // Default currency on error
      }
    }

    fetchOrder()
    fetchBusinessCurrency()
  }, [id])

  // Calculate Total Amount
  useEffect(() => {
    const calculateTotal = () => {
      const sum = orderItemsData.reduce((acc, item) => {
        const itemTotal = item.quantity * Number.parseFloat(item.net_price)
        return acc + itemTotal
      }, 0)
      setTotalAmount(sum)
    }
    calculateTotal()
  }, [orderItemsData])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded m-4">
        {error}
      </div>
    )
  }

  function capitalizeFirst(str?: string) {
    if (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    } else {
      return "N/A"
    }
  }

  return (
    <div className="bg-[#2D3748] rounded-lg shadow-lg border border-gray-700 w-full max-w-4xl mx-auto">
      <div className="p-4 sm:p-8">
        <div className="space-y-8">
          {/* Order Header */}
          <div>
            <div className="p-6 bg-[#1A202C] rounded-lg">
              <div className="flex justify-between gap-4 flex-col sm:flex-row">
                {/* Logo and Address */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2.5">
                    <Logo />
                  </div>
                  {orderAddress && (
                    <p className="text-gray-300">
                      <strong className="text-gray-100">Shipping Address: </strong> {capitalizeFirst(orderAddress)}
                    </p>
                  )}
                </div>
                {/* Order Number and Dates */}
                <div className="flex flex-col gap-6 text-right">
                  {orderNumber && (
                    <h2 className="text-xl font-semibold text-gray-100">{`Order Number #${orderNumber}`}</h2>
                  )}
                  <div className="flex flex-col gap-1">
                    {orderCreatedDate && (
                      <p className="text-gray-300">{`Date Issued: ${convertToPakistanDateWithoutTime(
                        orderCreatedDate,
                      )}`}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer and Bill To Details */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-300">
              {/* Invoice To */}
              <div>
                <div className="flex flex-col gap-4">
                  <h3 className="font-medium text-gray-100">Invoice Details:</h3>
                  <div className="space-y-1">
                    <p>Customer Name: {capitalizeFirst(orderUserData?.name)}</p>
                    <p>Customer Email: {orderUserData?.email}</p>
                    <p>
                      Customer Status: {orderUserData?.account_id ? "+" : ""}
                      {orderUserData?.account_id}
                    </p>
                  </div>
                </div>
              </div>
              {/* Bill To */}
              <div>
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    {orderStatus && (
                      <div className="flex items-center gap-4">
                        <span className="min-w-[150px] font-medium text-gray-300">Order Status:</span>
                        <span className="text-gray-100">{capitalizeFirst(orderStatus)}</span>
                      </div>
                    )}
                    {orderDeliveryType && (
                      <div className="flex items-center gap-4">
                        <span className="min-w-[150px] font-medium text-gray-300">Delivery Type:</span>
                        <span className="text-gray-100">{capitalizeFirst(orderDeliveryType)}</span>
                      </div>
                    )}
                    {orderCreatedDate && (
                      <>
                        <div className="flex items-center gap-4">
                          <span className="min-w-[150px] font-medium text-gray-300">Order Creation Time:</span>
                          <span className="text-gray-100">
                            {convertToPakistanDateWithoutTime(orderCreatedDate)} at{" "}
                            {convertToPakistanTime(orderCreatedDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="min-w-[150px] font-medium text-gray-300">Order Delivery Time:</span>
                          <span className="text-gray-100">
                            {convertToPakistanTimePlusOneHourWithDate(orderCreatedDate)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="grid grid-cols-1 gap-4">
              {orderItemsData && orderItemsData.length > 0 ? (
                orderItemsData.map((item: any) => (
                  <div key={item.id}>
                    <OrderItemComponent item={item} currency={currency} />
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <p className="text-gray-300">No Order Items Found</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="flex justify-end">
              {" "}
              {/* Changed to justify-end to align summary to right */}
              <div className="min-w-[200px] space-y-2 text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium text-gray-100">
                    {currency} {totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount:</span>
                  <span className="font-medium text-gray-100">{currency} 0.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax:</span>
                  <span className="font-medium text-gray-100">{currency} 0.00</span>
                </div>
                <hr className="my-2 border-gray-600" />
                <div className="flex items-center justify-between">
                  <span>Grand Total:</span>
                  <span className="font-medium text-gray-100">
                    {currency} {Number(orderTotalPrice ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div>
            <hr className="border-dashed border-gray-600" />
          </div>

          {/* Special Instructions */}
          <div>
            <p className="text-gray-300">
              <span className="font-medium text-gray-100">Special Instructions:</span>{" "}
              {orderSpecialInstruction ? `${orderSpecialInstruction};` : ""} Thank You!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPreviewDetails
