import type React from "react"
// Remove the Badge import:
// import { Badge } from "@/components/ui/badge"

// Define the type for an individual order item, based on the screenshot details
interface OrderItemProps {
  item: {
    id: number
    sku: string
    description: string
    quantity: number
    status: string
    size: string
    tax_price: string
    net_price: string
    total_price: string
    product_instruction: string
    extra_toppings: string
  }
  currency: string
}

const OrderItemComponent: React.FC<OrderItemProps> = ({ item, currency }) => {

  
  return (
    <div className="bg-[#2D3748] rounded-lg p-6 space-y-4 text-gray-100 border-2 border-white">
      {/* Placeholder for a product group title, if applicable */}
      {/* <h4 className="text-lg font-semibold">test</h4> */}

      <div className="space-y-1">
        <p className="text-sm">
          <span className="font-medium">SKU:</span> {item.sku}
        </p>
        <p className="text-sm">
          <span className="font-medium">Product Description:</span> {item.description}
        </p>
        <p className="text-sm">
          <span className="font-medium">Quantity:</span> {item.quantity}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Replaced Badge with custom span */}
        <span className="inline-flex items-center rounded-full bg-blue-600/20 px-2.5 py-0.5 text-xs font-medium text-blue-400">
          Status: {item.status}
        </span>
        <span className="inline-flex items-center rounded-full bg-purple-600/20 px-2.5 py-0.5 text-xs font-medium text-purple-400">
          Size: {item.size}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-sm">
          <span className="font-medium">Product Instruction:</span> {item.product_instruction}
        </p>
        <p className="text-sm">
          <span className="font-medium">Extra Toppings:</span> {item.extra_toppings}
        </p>
      </div>

      <div className="space-y-1 pt-2 border-t border-gray-600">
        {/* <div className="flex justify-between text-sm">
          <span>Tax Price:</span>
          <span>
            {currency} {Number(item.tax_price).toFixed(2)}
          </span>
        </div> */}
        {/* <div className="flex justify-between text-sm">
          <span>Net Price:</span>
          <span>
            {currency} {Number(item.net_price).toFixed(2)}
          </span>
        </div> */}
        <div className="flex justify-between text-sm font-semibold text-blue-400">
          <span>Total Price:</span>
          <span>
            {currency} {(Number(item.total_price) * Number(item.quantity)).toFixed(2)}

          </span>
        </div>
      </div>
    </div>
  )
}

export default OrderItemComponent
