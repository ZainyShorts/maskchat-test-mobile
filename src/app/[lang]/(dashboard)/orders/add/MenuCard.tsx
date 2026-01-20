// // "use client"

// // import type React from "react"
// // import type { MenuDataType } from "@/api/interface/menuIterface"

// // interface MenuCardProps {
// //   product: MenuDataType
// //   onAdd: () => void
// // }

// // const MenuCard: React.FC<MenuCardProps> = ({ product, onAdd }) => {
// //   // Safe price handling
// //   // const safePrice = product.price ? Number(product.price) : 0

// //   console.log(product, 'menuard product ')

// //   return (
// //     <div
// //       className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow w-64"
// //       style={{
// //         backgroundColor: "var(--mui-palette-background-paper)",
// //         borderColor: "var(--mui-palette-divider)",
// //       }}
// //     >
// //       <div className="flex flex-col h-full">
// //         <div className="flex-1">
// //           <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--mui-palette-text-primary)" }}>
// //             {product.title || "Untitled Item"}
// //           </h3>
// //           <p className="text-sm mb-1" style={{ color: "var(--mui-palette-text-secondary)" }}>
// //             SKU: {product.sku || "N/A"}
// //           </p>
// //           <p className="text-sm mb-3" style={{ color: "var(--mui-palette-text-secondary)" }}>
// //             {product.description || "No description available"}
// //           </p>
// //           {product.size && (
// //             <span
// //               className="inline-block px-2 py-1 text-xs font-medium rounded-full mb-3"
// //               style={{
// //                 backgroundColor: "var(--mui-palette-primary-light)",
// //                 color: "var(--mui-palette-primary-dark)",
// //               }}
// //             >
// //               {product.size}
// //             </span>
// //           )}
// //         </div>
// //         <div className="flex items-center justify-between">
// //           <span className="text-xl font-bold" style={{ color: "var(--mui-palette-success-main)" }}>
// //             ${product.price}
// //           </span>
// //           <button
// //             onClick={onAdd}
// //             className="font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-1"
// //             style={{
// //               backgroundColor: "var(--mui-palette-primary-main)",
// //               color: "var(--mui-palette-primary-contrastText)",
// //             }}
// //           >
// //             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
// //             </svg>
// //             Add
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default MenuCard

// "use client"
// import type React from "react"
// import type { MenuDataType } from "@/api/interface/menuIterface"

// interface MenuCardProps {
//   product: MenuDataType
//   onAdd: () => void
// }

// const MenuCard: React.FC<MenuCardProps> = ({ product, onAdd }) => {
//   // Debug the product object structure
//   console.log("MenuCard product:", product)
//   console.log("Product price:", product.price)
//   console.log("Product price type:", typeof product.price)

//   // More robust price handling
//   const getPrice = (price: any): number => {
//     if (price === null || price === undefined) return 0
//     if (typeof price === "number") return price
//     if (typeof price === "string") {
//       // Remove any currency symbols and parse
//       const cleanPrice = price.replace(/[$,]/g, "")
//       const parsed = Number.parseFloat(cleanPrice)
//       return isNaN(parsed) ? 0 : parsed
//     }
//     return 0
//   }

//   const displayPrice = getPrice(product.price)

//   return (
//     <div
//       className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow w-64"
//       style={{
//         backgroundColor: "var(--mui-palette-background-paper)",
//         borderColor: "var(--mui-palette-divider)",
//       }}
//     >
//       <div className="flex flex-col h-full">
//         <div className="flex-1">
//           <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--mui-palette-text-primary)" }}>
//             {product.title || "Untitled Item"}
//           </h3>
//           <p className="text-sm mb-1" style={{ color: "var(--mui-palette-text-secondary)" }}>
//             SKU: {product.sku || "N/A"}
//           </p>
//           <p className="text-sm mb-3" style={{ color: "var(--mui-palette-text-secondary)" }}>
//             {product.description || "No description available"}
//           </p>
//           {product.size && (
//             <span
//               className="inline-block px-2 py-1 text-xs font-medium rounded-full mb-3"
//               style={{
//                 backgroundColor: "var(--mui-palette-primary-light)",
//                 color: "var(--mui-palette-primary-dark)",
//               }}
//             >
//               {product.size}
//             </span>
//           )}
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-xl font-bold" style={{ color: "var(--mui-palette-success-main)" }}>
//             ${displayPrice.toLocaleString()}
//           </span>
//           <button
//             onClick={onAdd}
//             className="font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-1"
//             style={{
//               backgroundColor: "var(--mui-palette-primary-main)",
//               color: "var(--mui-palette-primary-contrastText)",
//             }}
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//             Add
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default MenuCard


"use client"
import type React from "react"
import Image from "next/image"
import type { MenuDataType } from "@/api/interface/menuIterface"

interface MenuCardProps {
  product: MenuDataType
  onAdd: () => void
}

const MenuCard: React.FC<MenuCardProps> = ({ product, onAdd }) => {
  // Debug the product object structure
  console.log("MenuCard product:", product)
  console.log("Product price:", product.price)
  console.log("Product price type:", typeof product.price)
  console.log("Product image:", product.image_link)

  // More robust price handling
  const getPrice = (price: any): number => {
    if (price === null || price === undefined) return 0
    if (typeof price === "number") return price
    if (typeof price === "string") {
      // Remove any currency symbols and parse
      const cleanPrice = price.replace(/[$,]/g, "")
      const parsed = Number.parseFloat(cleanPrice)
      return isNaN(parsed) ? 0 : parsed
    }
    return 0
  }

  const displayPrice = getPrice(product.price)

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow w-64"
      style={{
        backgroundColor: "var(--mui-palette-background-paper)",
        borderColor: "var(--mui-palette-divider)",
      }}
    >
      <div className="flex flex-col h-full">
        {/* Image Section */}
        <div className="relative w-full h-48 bg-gray-100">
          {product.image_link ? (
            <Image
              src={product.image_link || "/placeholder.svg"}
              alt={product.title || "Menu item"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=192&width=256"
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: "var(--mui-palette-text-secondary)" }}
            >
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--mui-palette-text-primary)" }}>
              {product.title || "Untitled Item"}
            </h3>
            <p className="text-sm mb-1" style={{ color: "var(--mui-palette-text-secondary)" }}>
              SKU: {product.sku || "N/A"}
            </p>
            <p className="text-sm mb-3" style={{ color: "var(--mui-palette-text-secondary)" }}>
              {product.description || "No description available"}
            </p>
            {product.size && (
              <span
                className="inline-block px-2 py-1 text-xs font-medium rounded-full mb-3"
                style={{
                  backgroundColor: "var(--mui-palette-primary-light)",
                  color: "var(--mui-palette-primary-dark)",
                }}
              >
                {product.size}
              </span>
            )}
          </div>

          {/* Price and Add Button */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold" style={{ color: "var(--mui-palette-success-main)" }}>
              ${displayPrice.toLocaleString()}
            </span>
            <button
              onClick={onAdd}
              className="font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-1"
              style={{
                backgroundColor: "var(--mui-palette-primary-main)",
                color: "var(--mui-palette-primary-contrastText)",
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuCard
