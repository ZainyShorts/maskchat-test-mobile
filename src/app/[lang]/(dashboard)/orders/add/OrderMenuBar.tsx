// "use client"

// import type * as React from "react"
// import { useEffect, useState } from "react"
// import type { ToppingDataType } from "@/api/interface/toppingInterface"
// import { getAllFoodTypes } from "@/api/foodTypes"
// import { getAllMenues } from "@/api/menu"
// import type { MenuDataType } from "@/api/interface/menuIterface"
// import MenuCard from "./MenuCard"
// import type { CreateOrder } from "@/api/interface/orderInterface"
// import { useForm } from "react-hook-form"
// import { getAllResturants } from "@/api/resturant"
// import toast from "react-hot-toast"
// import { useParams, useRouter } from "next/navigation"
// import { getLocalizedUrl } from "@/utils/i18n"
// import type { Locale } from "@/configs/i18n"
// import Loader from "@/components/loader/Loader"
// import { createOrder } from "@/api/order"
// import type { RestaurantType } from "@/types/apps/restoTypes"

// const OrderMenuBar = () => {
//   const router = useRouter()
//   const { lang: locale } = useParams()
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<CreateOrder>()

//   const [restoData, setRestoData] = useState<RestaurantType[]>([])
//   const [selectedBusiness, setSelectedBusiness] = useState<string | number>("")
//   const [selectedBusinessId, setSelectedBusinessId] = useState<string | number>("")
//   const [selectedRestoData, setSelectedRestoData] = useState<RestaurantType>()
//   const [selectedRestoId, setSelectedRestoId] = useState<number>(0)
//   const [selectedRestoUserId, setSelectedRestoUserId] = useState<number>(0)
//   const [loading, setLoading] = useState<boolean>(false)
//   const [value, setValue] = useState(0)
//   const [foodTypeData, setFoodTypeData] = useState<ToppingDataType[]>([])
//   const [id, setId] = useState<number | null>(null)
//   const [allMenus, setAllMenus] = useState<MenuDataType[]>([])
//   const [filteredMenus, setFilteredMenus] = useState<MenuDataType[]>([])
//   const [order, setOrder] = useState<
//     { id: number; sku: string; size: string; description: string; name: string; price: number; quantity: number }[]
//   >([])
//   const [subtotal, setSubtotal] = useState<number>(0)
//   const [total, setTotal] = useState<number>(0)

//   const handleChange = (newValue: number) => {
//     setValue(newValue)
//     const selectedFood = foodTypeData[newValue]
//     if (selectedFood) {
//       setId(selectedFood.id)
//     }
//   }

//   useEffect(() => {
//     const fetchResturants = async () => {
//       try {
//         const response = await getAllResturants()
//         const restos = response?.data?.results || []
//         setRestoData(restos)
//       } catch (err: any) {
//         console.error("Error fetching businesses:", err)
//         console.log(err.message)
//       }
//     }
//     fetchResturants()
//   }, [])

//   const handleRestoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const restoId = Number(event.target.value)
//     setSelectedRestoId(restoId)
//     const restoObj = restoData.find((b) => b.id === restoId)
//     if (restoObj) {
//       setSelectedBusinessId(restoObj?.business?.business_id)
//       setSelectedBusiness(restoObj?.business?.id)
//       setSelectedRestoUserId(restoObj?.business?.user?.id)
//       setSelectedRestoData(restoObj)
//     } else {
//       setSelectedRestoUserId(0)
//       setSelectedBusiness(0)
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getAllFoodTypes()
//         const results = response?.data?.results
//         setFoodTypeData(results)
//         const menuData = await getAllMenues()
//         const menuResults: MenuDataType[] = menuData?.data?.results
//         setAllMenus(menuResults)
//         console.log("meuresults", menuResults)
//         if (results?.length > 0) {
//           const firstId = results[0].id
//           setId(firstId)
//           setFilteredMenus(menuResults.filter((menu) => menu.type === firstId))
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error)
//       }
//     }
//     fetchData()
//   }, [])

//   useEffect(() => {
//     if (id) {
//       setFilteredMenus(allMenus.filter((menu) => menu?.type?.id === id))
//     }
//   }, [id, allMenus])

//   // Calculate totals whenever order changes
//   useEffect(() => {
//     const calculateTotals = () => {
//       const subTotalCalc = order.reduce((acc, item) => {
//         const itemPrice = item.price ? Number(item.price) : 0
//         return acc + itemPrice * item.quantity
//       }, 0)
//       setSubtotal(subTotalCalc)
//       setTotal(subTotalCalc) // Since tax is 0
//     }
//     calculateTotals()
//   }, [order])

//   const addToOrder = (item: MenuDataType) => {
//     setOrder((prev) => {
//       const existingItem = prev.find((orderItem) => orderItem.id === item.id)
//       if (existingItem) {
//         return prev.map((orderItem) =>
//           orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem,
//         )
//       }
//       return [
//         ...prev,
//         {
//           id: item.id,
//           sku: item.sku || "N/A",
//           size: item.size || "Default Size",
//           description: item.description || "",
//           name: item.title || "Unknown",
//           price: item.price ? Number(item.price) : 0,
//           quantity: 1,
//         },
//       ]
//     })
//   }

//   const incrementQuantity = (id: number) => {
//     setOrder((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
//   }

//   const decrementQuantity = (id: number) => {
//     setOrder((prev) =>
//       prev
//         .map((item) => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
//         .filter((item) => item.quantity > 0),
//     )
//   }

//   const deleteItem = (id: number) => {
//     setOrder((prev) => prev.filter((item) => item.id !== id))
//   }

//   const onSubmit = (data: any, e: any) => {
//     e.preventDefault()
//     if (!order || order.length === 0) {
//       toast.error("Please add some menu items to proceed.")
//       return
//     }
//     setLoading(true)
//     const orderItems = order.map((item) => ({
//       name: item.name,
//       product_sku: item.sku,
//       quantity: item.quantity,
//       description: item.description,
//       size: item.size || "Default Size",
//       spice_level: "Medium",
//       extra_toppings: "Cheese",
//       instruction: "Extra crispy",
//       tax_price: "0.00",
//       net_price: item.price,
//       total_price: `${(Number(item.price || 0) * item.quantity).toFixed(2)}`,
//     }))
//     const submissionData = {
//       ...data,
//       restaurant: selectedRestoId,
//       user: selectedRestoUserId,
//       business: selectedBusiness,
//       tax_price: 0.0,
//       net_price: subtotal,
//       total_price: total,
//       order_items: orderItems,
//       is_pos: true,
//     }

//     createOrder(submissionData)
//       .then((res) => {
//         setLoading(false)
//         toast.success("Order created successfully")
//         router.replace(getLocalizedUrl("/orders", locale as Locale))
//       })
//       .catch((error) => {
//         console.error("Error creating order:", error)
//         toast.error("Error creating order")
//       })
//       .finally(() => {
//         setLoading(false)
//         reset()
//       })
//   }

//   return (
//     <div>
//       {/* Header Section */}
//       <div style={{ backgroundColor: "var(--mui-palette-background-paper)" }} className="mb-5">
//         <div className="p-6 rounded" style={{ backgroundColor: "var(--mui-palette-action-hover)" }}>
//           <div className="flex justify-between gap-4 flex-col sm:flex-row">
//             <div className="flex flex-col gap-6">
//               {/* Outlet Selection */}
//               <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
//                 <h5 className="text-xl font-medium min-w-[130px]" style={{ color: "var(--mui-palette-text-primary)" }}>
//                   🏬 Select Outlet:
//                 </h5>
//                 <select
//                   className="w-full sm:w-auto px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   style={{
//                     backgroundColor: "var(--mui-palette-background-paper)",
//                     borderColor: "var(--mui-palette-divider)",
//                     color: "var(--mui-palette-text-primary)",
//                   }}
//                   value={selectedRestoId}
//                   onChange={handleRestoChange}
//                 >
//                   <option value="">Choose an outlet</option>
//                   {restoData.length > 0 ? (
//                     restoData.map((resto) => (
//                       <option key={resto.id} value={resto.id}>
//                         {resto.name}
//                       </option>
//                     ))
//                   ) : (
//                     <option value="" disabled>
//                       ⚠️ No outlet available
//                     </option>
//                   )}
//                 </select>
//               </div>

//               {/* Outlet Info */}
//               {selectedRestoData && (
//                 <div className="pl-1">
//                   <p style={{ color: "var(--mui-palette-text-primary)" }}>📍 {selectedRestoData.city}</p>
//                   <p style={{ color: "var(--mui-palette-text-primary)" }}>☎️ {selectedRestoData.contact_number}</p>
//                 </div>
//               )}

//               {/* Special Instruction */}
//               <div className="flex items-center">
//                 <div className="w-full">
//                   <label
//                     className="block text-sm font-medium mb-1"
//                     style={{ color: "var(--mui-palette-text-primary)" }}
//                   >
//                     📝 Special Instruction *
//                   </label>
//                   <textarea
//                     {...register("special_instruction", { required: "Special Instruction is required" })}
//                     rows={3}
//                     placeholder="Enter any preparation or delivery notes..."
//                     className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     style={{
//                       backgroundColor: "var(--mui-palette-background-paper)",
//                       borderColor: "var(--mui-palette-divider)",
//                       color: "var(--mui-palette-text-primary)",
//                     }}
//                   />
//                   {errors.special_instruction && (
//                     <p className="mt-1 text-sm text-red-600">{errors.special_instruction.message}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col gap-2">
//               <div className="flex items-center gap-4">
//                 <h5 className="text-xl font-medium min-w-[95px]" style={{ color: "var(--mui-palette-text-primary)" }}>
//                   Resturant Details:
//                 </h5>
//               </div>
//               <div className="flex items-center">
//                 <p className="min-w-[95px] mr-4" style={{ color: "var(--mui-palette-text-primary)" }}>
//                   Resturant Status:
//                 </p>
//                 <p className="min-w-[95px] mr-4" style={{ color: "var(--mui-palette-text-primary)" }}>
//                   {selectedRestoData?.active ? "Active" : "In Active"}
//                 </p>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-full">
//                   <label
//                     className="block text-sm font-medium mb-1"
//                     style={{ color: "var(--mui-palette-text-primary)" }}
//                   >
//                     Select Delivery Type *
//                   </label>
//                   <select
//                     {...register("delivery_type", { required: "Delivery Type is required" })}
//                     className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     style={{
//                       backgroundColor: "var(--mui-palette-background-paper)",
//                       borderColor: "var(--mui-palette-divider)",
//                       color: "var(--mui-palette-text-primary)",
//                     }}
//                   >
//                     <option value="">Select delivery type</option>
//                     <option value="delivery">🚚 Delivery</option>
//                     <option value="pickup">🏃‍♂️ Pick Up</option>
//                   </select>
//                   {errors.delivery_type && <p className="mt-1 text-sm text-red-600">{errors.delivery_type.message}</p>}
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-full">
//                   <label
//                     className="block text-sm font-medium mb-1"
//                     style={{ color: "var(--mui-palette-text-primary)" }}
//                   >
//                     Enter Address *
//                   </label>
//                   <textarea
//                     {...register("address", { required: "Address is required" })}
//                     rows={3}
//                     placeholder="Enter Address"
//                     className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     style={{
//                       backgroundColor: "var(--mui-palette-background-paper)",
//                       borderColor: "var(--mui-palette-divider)",
//                       color: "var(--mui-palette-text-primary)",
//                     }}
//                   />
//                   {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex gap-3 w-full">
//         {/* Menu Section */}
//         <div className="w-3/4 text-left" style={{ backgroundColor: "var(--mui-palette-background-paper)" }}>
//           {/* Tabs */}
//           <div style={{ borderBottomColor: "var(--mui-palette-divider)" }} className="border-b">
//             <div className="flex overflow-x-auto">
//               {foodTypeData?.map((food, index) => (
//                 <button
//                   key={food.id}
//                   onClick={() => handleChange(index)}
//                   className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
//                     value === index ? "border-blue-500 text-blue-600" : "border-transparent hover:border-gray-300"
//                   }`}
//                   style={{
//                     color: value === index ? "var(--mui-palette-primary-main)" : "var(--mui-palette-text-primary)",
//                     backgroundColor: value === index ? "var(--mui-palette-action-selected)" : "transparent",
//                   }}
//                 >
//                   {food.name}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Menu Items */}
//           <div className="m-5 flex gap-2 flex-wrap">
//             {filteredMenus.length > 0 ? (
//               filteredMenus.map((product, index) => (
//                 <MenuCard key={index} product={product} onAdd={() => addToOrder(product)} />
//               ))
//             ) : (
//               <h6 className="text-lg m-5" style={{ color: "var(--mui-palette-text-secondary)" }}>
//                 No menu available
//               </h6>
//             )}
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="w-1/4" style={{ backgroundColor: "var(--mui-palette-background-paper)" }}>
//           <div className="p-3 border rounded-lg" style={{ borderColor: "var(--mui-palette-divider)" }}>
//             <h6 className="text-lg font-medium mb-3" style={{ color: "var(--mui-palette-text-primary)" }}>
//               Current Order
//             </h6>
//             {order.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex justify-between items-center mb-2 pb-1 border-b last:border-b-0"
//                 style={{ borderBottomColor: "var(--mui-palette-divider)" }}
//               >
//                 <div className="flex-1">
//                   <p className="text-sm font-medium" style={{ color: "var(--mui-palette-text-primary)" }}>
//                     {item.name}
//                   </p>
//                   <p className="text-xs" style={{ color: "var(--mui-palette-text-secondary)" }}>
//                     ${(Number(item.price || 0) * item.quantity)}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <button
//                     onClick={() => decrementQuantity(item.id)}
//                     className="w-7 h-7 flex items-center justify-center border rounded text-sm hover:opacity-80"
//                     style={{
//                       borderColor: "var(--mui-palette-divider)",
//                       color: "var(--mui-palette-text-primary)",
//                       backgroundColor: "var(--mui-palette-background-paper)",
//                     }}
//                   >
//                     -
//                   </button>
//                   <span className="min-w-5 text-center text-sm" style={{ color: "var(--mui-palette-text-primary)" }}>
//                     {item.quantity}
//                   </span>
//                   <button
//                     onClick={() => incrementQuantity(item.id)}
//                     className="w-7 h-7 flex items-center justify-center border rounded text-sm hover:opacity-80"
//                     style={{
//                       borderColor: "var(--mui-palette-divider)",
//                       color: "var(--mui-palette-text-primary)",
//                       backgroundColor: "var(--mui-palette-background-paper)",
//                     }}
//                   >
//                     +
//                   </button>
//                   <button
//                     onClick={() => deleteItem(item.id)}
//                     className="w-7 h-7 flex items-center justify-center rounded text-sm hover:opacity-80"
//                     style={{
//                       color: "var(--mui-palette-error-main)",
//                       backgroundColor: "var(--mui-palette-error-light)",
//                     }}
//                   >
//                     ×
//                   </button>
//                 </div>
//               </div>
//             ))}

//             <div className="my-3" style={{ borderTopColor: "var(--mui-palette-divider)" }}>
//               <div className="border-t pt-3"></div>
//             </div>

//             {/* Totals */}
//             <div className="mb-3">
//               <div className="flex justify-between mb-1">
//                 <span className="text-sm" style={{ color: "var(--mui-palette-text-primary)" }}>
//                   Subtotal:
//                 </span>
//                 <span className="text-sm" style={{ color: "var(--mui-palette-text-primary)" }}>
//                   ${subtotal.toFixed(2)}
//                 </span>
//               </div>
//               <div className="flex justify-between mb-1">
//                 <span className="text-sm" style={{ color: "var(--mui-palette-text-primary)" }}>
//                   Tax:
//                 </span>
//                 <span className="text-sm" style={{ color: "var(--mui-palette-text-primary)" }}>
//                   $0.00
//                 </span>
//               </div>
//               <div className="flex justify-between font-bold">
//                 <span style={{ color: "var(--mui-palette-text-primary)" }}>Total:</span>
//                 <span style={{ color: "var(--mui-palette-text-primary)" }}>${total.toFixed(2)}</span>
//               </div>
//             </div>

//             <button
//               onClick={handleSubmit(onSubmit)}
//               disabled={loading || order.length === 0}
//               className="w-full font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{
//                 backgroundColor: "var(--mui-palette-primary-main)",
//                 color: "var(--mui-palette-primary-contrastText)",
//               }}
//             >
//               Process Order
//             </button>
//           </div>
//         </div>
//       </div>

//       {loading && <Loader />}
//     </div>
//   )
// }

// export default OrderMenuBar

"use client"
import type * as React from "react"
import { useEffect, useState } from "react"
import type { ToppingDataType } from "@/api/interface/toppingInterface"
import { getAllFoodTypes } from "@/api/foodTypes"
import { getAllMenues } from "@/api/menu"
import type { MenuDataType } from "@/api/interface/menuIterface"
import MenuCard from "./MenuCard"
import type { CreateOrder } from "@/api/interface/orderInterface"
import { useForm } from "react-hook-form"
import { getAllResturants } from "@/api/resturant"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { getLocalizedUrl } from "@/utils/i18n"
import type { Locale } from "@/configs/i18n"
import Loader from "@/components/loader/Loader"
import { createOrder } from "@/api/order"
import type { RestaurantType } from "@/types/apps/restoTypes"

const OrderMenuBar = () => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateOrder>()

  const [restoData, setRestoData] = useState<RestaurantType[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<string | number>("")
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | number>("")
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

  // Improved price parsing function
  const parsePrice = (price: any): number => {
    console.log("Parsing price:", price, "Type:", typeof price)

    if (price === null || price === undefined) return 0
    if (typeof price === "number") return price
    if (typeof price === "string") {
      // Remove currency symbols, commas, and spaces
      const cleanPrice = price.replace(/[$,\s]/g, "")
      const parsed = Number.parseFloat(cleanPrice)
      console.log("Parsed price:", parsed)
      return isNaN(parsed) ? 0 : parsed
    }
    return 0
  }

  const handleChange = (newValue: number) => {
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
        console.error("Error fetching businesses:", err)
        console.log(err.message)
      }
    }
    fetchResturants()
  }, [])

  const handleRestoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const restoId = Number(event.target.value)
    setSelectedRestoId(restoId)
    const restoObj = restoData.find((b) => b.id === restoId)
    if (restoObj) {
      setSelectedBusinessId(restoObj?.business?.business_id)
      setSelectedBusiness(restoObj?.business?.id)
      setSelectedRestoUserId(restoObj?.business?.user?.id)
      setSelectedRestoData(restoObj)
    } else {
      setSelectedRestoUserId(0)
      setSelectedBusiness(0)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllFoodTypes()
        const results = response?.data?.results
        setFoodTypeData(results)
        const menuData = await getAllMenues()
        const menuResults: MenuDataType[] = menuData?.data?.results
        setAllMenus(menuResults)
        console.log("Menu results:", menuResults)

        // Debug: Log the first menu item to see its structure
        if (menuResults?.length > 0) {
          console.log("First menu item:", menuResults[0])
          console.log("First menu item price:", menuResults[0].price)
        }

        if (results?.length > 0) {
          const firstId = results[0].id
          setId(firstId)
          setFilteredMenus(menuResults.filter((menu) => menu.type === firstId))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (id) {
      setFilteredMenus(allMenus.filter((menu) => menu?.type?.id === id))
    }
  }, [id, allMenus])

  // Calculate totals whenever order changes
  useEffect(() => {
    const calculateTotals = () => {
      const subTotalCalc = order.reduce((acc, item) => {
        console.log("Calculating for item:", item.name, "Price:", item.price, "Quantity:", item.quantity)
        const itemPrice = item.price || 0
        return acc + itemPrice * item.quantity
      }, 0)
      console.log("Calculated subtotal:", subTotalCalc)
      setSubtotal(subTotalCalc)
      setTotal(subTotalCalc) // Since tax is 0
    }
    calculateTotals()
  }, [order])

  const addToOrder = (item: MenuDataType) => {
    console.log("Adding item to order:", item)
    console.log("Item price before parsing:", item.price)

    const parsedPrice = parsePrice(item.price)
    console.log("Parsed price:", parsedPrice)

    setOrder((prev) => {
      const existingItem = prev.find((orderItem) => orderItem.id === item.id)
      if (existingItem) {
        return prev.map((orderItem) =>
          orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem,
        )
      }

      const newOrderItem = {
        id: item.id,
        sku: item.sku || "N/A",
        size: item.size || "Default Size",
        description: item.description || "",
        name: item.title || "Unknown",
        price: parsedPrice,
        quantity: 1,
      }

      console.log("New order item:", newOrderItem)
      return [...prev, newOrderItem]
    })
  }

  const incrementQuantity = (id: number) => {
    setOrder((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
  }

  const decrementQuantity = (id: number) => {
    setOrder((prev) =>
      prev
        .map((item) => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const deleteItem = (id: number) => {
    setOrder((prev) => prev.filter((item) => item.id !== id))
  }

  const onSubmit = (data: any, e: any) => {
    e.preventDefault()
    if (!order || order.length === 0) {
      toast.error("Please add some menu items to proceed.")
      return
    }
    setLoading(true)
    const orderItems = order.map((item) => ({
      name: item.name,
      product_sku: item.sku,
      quantity: item.quantity,
      description: item.description,
      size: item.size || "Default Size",
      spice_level: "Medium",
      extra_toppings: "Cheese",
      instruction: "Extra crispy",
      tax_price: "0.00",
      net_price: item.price,
      total_price: `${(item.price * item.quantity).toFixed(2)}`,
    }))

    const submissionData = {
      ...data,
      restaurant: selectedRestoId,
      user: selectedRestoUserId,
      business: selectedBusiness,
      tax_price: 0.0,
      net_price: subtotal,
      total_price: total,
      order_items: orderItems,
      is_pos: true,
    }

    createOrder(submissionData)
      .then((res) => {
        setLoading(false)
        toast.success("Order created successfully")
        router.replace(getLocalizedUrl("/orders", locale as Locale))
      })
      .catch((error) => {
        console.error("Error creating order:", error)
        toast.error("Error creating order")
      })
      .finally(() => {
        setLoading(false)
        reset()
      })
  }

  return (
    <div>
      {/* Header Section */}
      <div style={{ backgroundColor: "var(--mui-palette-background-paper)" }} className="mb-5">
        <div className="p-6 rounded" style={{ backgroundColor: "var(--mui-palette-action-hover)" }}>
          <div className="flex justify-between gap-4 flex-col sm:flex-row">
            <div className="flex flex-col gap-6">
              {/* Outlet Selection */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                <h5 className="text-xl font-medium min-w-[130px]" style={{ color: "var(--mui-palette-text-primary)" }}>
                  🏬 Select Outlet:
                </h5>
                <select
                  className="w-full sm:w-auto px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{
                    backgroundColor: "var(--mui-palette-background-paper)",
                    borderColor: "var(--mui-palette-divider)",
                    color: "var(--mui-palette-text-primary)",
                  }}
                  value={selectedRestoId}
                  onChange={handleRestoChange}
                >
                  <option value="">Choose an outlet</option>
                  {restoData.length > 0 ? (
                    restoData.map((resto) => (
                      <option key={resto.id} value={resto.id}>
                        {resto.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      ⚠️ No outlet available
                    </option>
                  )}
                </select>
              </div>

              {/* Outlet Info */}
              {selectedRestoData && (
                <div className="pl-1">
                  <p style={{ color: "var(--mui-palette-text-primary)" }}>📍 {selectedRestoData.city}</p>
                  <p style={{ color: "var(--mui-palette-text-primary)" }}>☎️ {selectedRestoData.contact_number}</p>
                </div>
              )}

              {/* Special Instruction */}
              <div className="flex items-center">
                <div className="w-full">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--mui-palette-text-primary)" }}
                  >
                    📝 Special Instruction *
                  </label>
                  <textarea
                    {...register("special_instruction", { required: "Special Instruction is required" })}
                    rows={3}
                    placeholder="Enter any preparation or delivery notes..."
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{
                      backgroundColor: "var(--mui-palette-background-paper)",
                      borderColor: "var(--mui-palette-divider)",
                      color: "var(--mui-palette-text-primary)",
                    }}
                  />
                  {errors.special_instruction && (
                    <p className="mt-1 text-sm text-red-600">{errors.special_instruction.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h5 className="text-xl font-medium min-w-[95px]" style={{ color: "var(--mui-palette-text-primary)" }}>
                  Restaurant Details:
                </h5>
              </div>
              <div className="flex items-center">
                <p className="min-w-[95px] mr-4" style={{ color: "var(--mui-palette-text-primary)" }}>
                  Restaurant Status:
                </p>
                <p className="min-w-[95px] mr-4" style={{ color: "var(--mui-palette-text-primary)" }}>
                  {selectedRestoData?.active ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-full">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--mui-palette-text-primary)" }}
                  >
                    Select Delivery Type *
                  </label>
                  <select
                    {...register("delivery_type", { required: "Delivery Type is required" })}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{
                      backgroundColor: "var(--mui-palette-background-paper)",
                      borderColor: "var(--mui-palette-divider)",
                      color: "var(--mui-palette-text-primary)",
                    }}
                  >
                    <option value="">Select delivery type</option>
                    <option value="delivery">🚚 Delivery</option>
                    <option value="pickup">🏃‍♂️ Pick Up</option>
                  </select>
                  {errors.delivery_type && <p className="mt-1 text-sm text-red-600">{errors.delivery_type.message}</p>}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--mui-palette-text-primary)" }}
                  >
                    Enter Address *
                  </label>
                  <textarea
                    {...register("address", { required: "Address is required" })}
                    rows={3}
                    placeholder="Enter Address"
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{
                      backgroundColor: "var(--mui-palette-background-paper)",
                      borderColor: "var(--mui-palette-divider)",
                      color: "var(--mui-palette-text-primary)",
                    }}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-3 w-full">
        {/* Menu Section */}
        <div className="w-3/4 text-left" style={{ backgroundColor: "var(--mui-palette-background-paper)" }}>
          {/* Tabs */}
          <div style={{ borderBottomColor: "var(--mui-palette-divider)" }} className="border-b">
            <div className="flex overflow-x-auto">
              {foodTypeData?.map((food, index) => (
                <button
                  key={food.id}
                  onClick={() => handleChange(index)}
                  className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                    value === index ? "border-blue-500 text-blue-600" : "border-transparent hover:border-gray-300"
                  }`}
                  style={{
                    color: value === index ? "var(--mui-palette-primary-main)" : "var(--mui-palette-text-primary)",
                    backgroundColor: value === index ? "var(--mui-palette-action-selected)" : "transparent",
                  }}
                >
                  {food.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="m-5 flex gap-2 flex-wrap">
            {filteredMenus.length > 0 ? (
              filteredMenus.map((product, index) => (
                <MenuCard key={index} product={product} onAdd={() => addToOrder(product)} />
              ))
            ) : (
              <h6 className="text-lg m-5" style={{ color: "var(--mui-palette-text-secondary)" }}>
                No menu available
              </h6>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-1/4" style={{ backgroundColor: "var(--mui-palette-background-paper)" }}>
          <div className="p-3 border rounded-lg" style={{ borderColor: "var(--mui-palette-divider)" }}>
            <h6 className="text-lg font-medium mb-3" style={{ color: "var(--mui-palette-text-primary)" }}>
              Current Order
            </h6>
            {order.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-2 pb-1 border-b last:border-b-0"
                style={{ borderBottomColor: "var(--mui-palette-divider)" }}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "var(--mui-palette-text-primary)" }}>
                    {item.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--mui-palette-text-secondary)" }}>
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => decrementQuantity(item.id)}
                    className="w-7 h-7 flex items-center justify-center border rounded text-sm hover:opacity-80"
                    style={{
                      borderColor: "var(--mui-palette-divider)",
                      color: "var(--mui-palette-text-primary)",
                      backgroundColor: "var(--mui-palette-background-paper)",
                    }}
                  >
                    -
                  </button>
                  <span className="min-w-5 text-center text-sm" style={{ color: "var(--mui-palette-text-primary)" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => incrementQuantity(item.id)}
                    className="w-7 h-7 flex items-center justify-center border rounded text-sm hover:opacity-80"
                    style={{
                      borderColor: "var(--mui-palette-divider)",
                      color: "var(--mui-palette-text-primary)",
                      backgroundColor: "var(--mui-palette-background-paper)",
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="w-7 h-7 flex items-center justify-center rounded text-sm hover:opacity-80"
                    style={{
                      color: "var(--mui-palette-error-main)",
                      backgroundColor: "var(--mui-palette-error-light)",
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            <div className="my-3" style={{ borderTopColor: "var(--mui-palette-divider)" }}>
              <div className="border-t pt-3"></div>
            </div>

            {/* Totals */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm" style={{ color: "var(--mui-palette-text-primary)" }}>
                  Subtotal:
                </span>
                <span className="text-sm" style={{ color: "var(--mui-palette-text-primary)" }}>
                  ${subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm" style={{ color: "var(--mui-palette-text-primary)" }}>
                  Tax:
                </span>
                <span className="text-sm" style={{ color: "var(--mui-palette-text-primary)" }}>
                  $0.00
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span style={{ color: "var(--mui-palette-text-primary)" }}>Total:</span>
                <span style={{ color: "var(--mui-palette-text-primary)" }}>${total.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading || order.length === 0}
              className="w-full font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--mui-palette-primary-main)",
                color: "var(--mui-palette-primary-contrastText)",
              }}
            >
              Process Order
            </button>
          </div>
        </div>
      </div>
      {loading && <Loader />}
    </div>
  )
}

export default OrderMenuBar
