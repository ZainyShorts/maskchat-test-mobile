// "use client"
// import { useEffect, useState, useCallback, useRef } from "react"
// import type React from "react"
// import { Product as productType} from '@/types/poducts';
// import { useRouter } from 'next/navigation'
// import toast from "react-hot-toast"
// import { getAllBusiness } from "@/api/business"
// import { GetWhatsApp } from "@/api/whatsapp"
// import { getBaseUrl } from "@/api/vars/vars"
// import {
//   Box,
//   Card,
//   CardHeader,
//   Typography,
//   Container,
//   Pagination,
//   CircularProgress,
//   Grid,
//   Button,
//   useTheme,
//   useMediaQuery,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Checkbox,
//   FormControlLabel,
//   InputAdornment,
//   IconButton,
// } from '@mui/material';
// import {
//   Search,
//   ChevronLeft,
//   ChevronRight,
//   Refresh,
//   Sync,
//   Close,
//   ShoppingCart,
// } from '@mui/icons-material';
// import { getAllMenuesByBusinessId, syncMenuData } from '@/api/menu';
// import { ProductCard } from "@/views/apps/user/list/ProductCard"
// import ConfirmationModal from '@/components/dialogs/confirm-modal'

// // Types
// interface MenuItem {
//   id: number
//   name: string
//   description: string
//   price: string
//   category: "FAST_FOOD" | "NORMAL" | "DRINK" | "MAIN_COURSE" | "DESSERT" | "TOPPING"
//   image_link: string
//   available: boolean
//   created_at: string
//   business: number
// }

// interface MenuResponse {
//   count: number
//   next: string | null
//   previous: string | null
//   results: MenuItem[]
// }

// interface BusinessData {
//   category: "Shopify-Ecommerce" | "Food"
//   business_id: string
//   currency?: { symbol: string }
//   name?: string
// }

// interface Product {
//   id: number
//   title: string
//   body_html: string
//   status: string
//   variants?: any[];
// }

// interface WhatsAppData {
//   category: "Shopify-Ecommerce" | "Food"
//   business_id: string
//   name?: string
// }

// interface OrderFormData {
//   first_name: string
//   last_name: string
//   email: string
//   phone: string
//   shipping_address1: string
//   shipping_city: string
//   shipping_country: string
//   financial_status: "paid" | "pending"
//   shipping_zip: string,
//   partial_payment_amount: string
//   note: string
//   variant_id: string
//   quantity: string
// }

// // Define the pagination response type
// interface PaginatedResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: productType[];
// }

// // Define the pagination response type for menu items
// interface MenuPaginatedResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: MenuItem[];
// }

// interface CartItem {
//   shopify_id: string | number;
//   title: string;
//   price: string;
//   product_title: string;
//   product_id: number;
//   qty: number;
// }

// const MENU_CATEGORIES = [
//   { value: "FAST_FOOD", label: "Fast Food" },
//   { value: "NORMAL", label: "Normal Restaurant" },
//   { value: "DRINK", label: "Drink" },
//   { value: "MAIN_COURSE", label: "Main Course" },
//   { value: "DESSERT", label: "Dessert" },
//   { value: "TOPPING", label: "Topping" },
// ]

// const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36, 150];

// // PlaceOrderModal Component
// const PlaceOrderModal = ({ 
//   showPlaceOrderModal, 
//   setShowPlaceOrderModal, 
//   placeOrderLoading, 
//   selectedProductVariant,
//   orderFormData,
//   setOrderFormData,
//   currency,
//   handlePlaceOrder 
// }: {
//   showPlaceOrderModal: boolean
//   setShowPlaceOrderModal: (show: boolean) => void
//   placeOrderLoading: boolean
//   selectedProductVariant: any
//   orderFormData: OrderFormData
//   setOrderFormData: React.Dispatch<React.SetStateAction<OrderFormData>>
//   currency: string
//   handlePlaceOrder: (e: React.FormEvent) => void
// }) => {
//   console.log('selectedProductVariant',selectedProductVariant)
//   const theme = useTheme()

//   const handleInputChange = useCallback((field: keyof OrderFormData, value: string | boolean) => {
//     setOrderFormData((prev) => ({
//       ...prev,
//       [field]: value
//     }));
//   }, [setOrderFormData]);

//   const handleVariantChange = useCallback((e: any) => {
//     setOrderFormData(prev => ({
//       ...prev,
//       variant_id: e.target.value
//     }));
//   }, [setOrderFormData]);

//   const handleFinancialStatusChange = useCallback((e: any) => {
//     setOrderFormData(prev => ({
//       ...prev,
//       financial_status: e.target.value as "paid" | "pending"
//     }));
//   }, [setOrderFormData]);

//   function cleanNumber(value: string) {
//   return value.toString().replace(/\.00$/, "");
// }


//   return (
//     <Dialog
//       open={showPlaceOrderModal}
//       onClose={() => !placeOrderLoading && setShowPlaceOrderModal(false)}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
//           boxShadow: theme.shadows[10],
//         }
//       }}
//     >
//       <DialogTitle
//         sx={{
//           backgroundColor: theme.palette.primary.main,
//           color: 'white',
//           display: 'flex',
//           alignItems: 'center',
//           gap: 1,
//           py: 2,
//         }}
//       >
//         <ShoppingCart />
//         <Typography variant="h6" component="span" fontWeight="bold">
//           Place Shopify Order
//         </Typography>
//         <Box sx={{ flex: 1 }} />
//         <Button
//           onClick={() => setShowPlaceOrderModal(false)}
//           disabled={placeOrderLoading}
//           sx={{
//             minWidth: 'auto',
//             color: 'white',
//             '&:hover': {
//               backgroundColor: 'rgba(255,255,255,0.1)',
//             },
//           }}
//         >
//           <Close />
//         </Button>
//       </DialogTitle>

//       <DialogContent sx={{ p: 3 }}>
//         <Box component="form" onSubmit={handlePlaceOrder} sx={{ mt: 2 }}>
//           <Grid container spacing={3}>
//             {/* Product Variant */}
//             <Grid item xs={12}>
//               <FormControl fullWidth required>
//                 {selectedProductVariant?.variants?.map((variant: any, index: number) => (
//   <MenuItem
//     key={variant.shopify_id}
//     value={variant.shopify_id.toString()}
//     style={{
//       display: "flex",
//       alignItems: "center",
//       gap: "10px",
//       padding: "8px 12px"
//     }}
//   >
//     <span style={{ fontWeight: 600 }}>{variant.qty}x</span>

//     <span style={{ flexGrow: 1 }}>
//       {variant.title}
//     </span>

//     <span>
//       {currency}{parseFloat(cleanNumber(variant.price))}
//     </span>
//   </MenuItem>
// ))}

//                 {/* </Select> */}
//               </FormControl>
//             </Grid>

//             {/* Quantity */}
//             {/* <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 required
//                 type="number"
//                 label="Quantity"
//                 value={orderFormData.quantity}
//                 onChange={(e) => handleInputChange('quantity', e.target.value)}
//                 inputProps={{ min: 1 }}
//               />
//             </Grid> */}

//             {/* Customer Details */}
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 required
//                 label="First Name"
//                 value={orderFormData.first_name}
//                 onChange={(e) => handleInputChange('first_name', e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 required
//                 label="Last Name"
//                 value={orderFormData.last_name}
//                 onChange={(e) => handleInputChange('last_name', e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 required
//                 type="email"
//                 label="Email"
//                 value={orderFormData.email}
//                 onChange={(e) => handleInputChange('email', e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 required
//                 label="Phone Number (with country code)"
//                 placeholder="+1234567890"
//                 value={orderFormData.phone}
//                 onChange={(e) => handleInputChange('phone', e.target.value)}
//                 helperText="Include country code (e.g., +1 for US, +44 for UK)"
//               />
//             </Grid>

//             {/* Shipping Address */}
//             <Grid item xs={12}>
//               <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', borderBottom: `1px solid ${theme.palette.primary.light}`, pb: 1 }}>
//                 Shipping Address
//               </Typography>
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 required
//                 label="Street Address"
//                 value={orderFormData.shipping_address1}
//                 onChange={(e) => handleInputChange('shipping_address1', e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 required
//                 label="City"
//                 value={orderFormData.shipping_city}
//                 onChange={(e) => handleInputChange('shipping_city', e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 required
//                 label="Country"
//                 value={orderFormData.shipping_country}
//                 onChange={(e) => handleInputChange('shipping_country', e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="ZIP/Postal Code"
//                 value={orderFormData.shipping_zip}
//                 onChange={(e) => handleInputChange('shipping_zip', e.target.value)}
//               />
//             </Grid>

//             {/* Order Details */}
//             <Grid item xs={12}>
//               <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', borderBottom: `1px solid ${theme.palette.primary.light}`, pb: 1 }}>
//                 Order Details
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth required>
//                 <InputLabel>Financial Status</InputLabel>
//                 <Select
//                   value={orderFormData.financial_status}
//                   onChange={handleFinancialStatusChange}
//                   label="Financial Status"
//                 >
//                   <MenuItem value="paid">Paid</MenuItem>
//                   <MenuItem value="pending">Pending</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {orderFormData.financial_status === "pending" && (
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Partial Payment Amount"
//                   value={orderFormData.partial_payment_amount}
//                   onChange={(e) => handleInputChange('partial_payment_amount', e.target.value)}
//                   helperText="Optional: Enter amount if customer pays partial amount"
//                   inputProps={{ step: "0.01" }}
//                 />
//               </Grid>
//             )}

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={3}
//                 label="Order Note"
//                 value={orderFormData.note}
//                 onChange={(e) => handleInputChange('note', e.target.value)}
//                 placeholder="Add a note to the order (optional)"
//               />
//             </Grid>
//           </Grid>
//         </Box>
//       </DialogContent>

//       <DialogActions sx={{ p: 3, gap: 1 }}>
//         <Button
//           onClick={() => {
//             setShowPlaceOrderModal(false)
//           }}
//           disabled={placeOrderLoading}
//           variant="outlined"
//           sx={{ minWidth: 100 }}
//         >
//           Cancel
//         </Button>
//         <Button
//           onClick={handlePlaceOrder}
//           disabled={placeOrderLoading}
//           variant="contained"
//           startIcon={placeOrderLoading ? <CircularProgress size={20} /> : <ShoppingCart />}
//           sx={{ minWidth: 140 }}
//         >
//           {placeOrderLoading ? 'Placing...' : 'Place Order'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// const CartModal = ({ 
//   showCartModal, 
//   setShowCartModal, 
//   cartItems, 
//   onRemoveItem,
//   onCheckout,
//   currency,
//   checkoutLoading
// }: {
//   showCartModal: boolean
//   setShowCartModal: (show: boolean) => void
//   cartItems: CartItem[]
//   onRemoveItem: (shopify_id: string | number) => void
//   onCheckout: () => void
//   currency: string
//   checkoutLoading: boolean
// }) => {
//   const theme = useTheme()
//   const totalPrice = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0)

//   function cleanNumber(value: string) {
//   return value.toString().replace(/\.00$/, "");
// }


//   return (
//     <Dialog
//       open={showCartModal}
//       onClose={() => !checkoutLoading && setShowCartModal(false)}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
//           boxShadow: theme.shadows[10],
//         }
//       }}
//     >
//       <DialogTitle
//         sx={{
//           backgroundColor: theme.palette.primary.main,
//           color: 'white',
//           display: 'flex',
//           alignItems: 'center',
//           gap: 1,
//           py: 2,
//         }}
//       >
//         <ShoppingCart />
//         <Typography variant="h6" component="span" fontWeight="bold">
//           Your Cart ({cartItems.length} items)
//         </Typography>
//         <Box sx={{ flex: 1 }} />
//         <Button
//           onClick={() => setShowCartModal(false)}
//           disabled={checkoutLoading}
//           sx={{
//             minWidth: 'auto',
//             color: 'white',
//             '&:hover': {
//               backgroundColor: 'rgba(255,255,255,0.1)',
//             },
//           }}
//         >
//           <Close />
//         </Button>
//       </DialogTitle>

//       <DialogContent sx={{ p: 3 }}>
//         {cartItems.length === 0 ? (
//           <Box sx={{ textAlign: 'center', py: 5 }}>
//             <ShoppingCart sx={{ width: 60, height: 60, color: 'text.disabled', mb: 2, mx: 'auto' }} />
//             <Typography color="text.secondary">Your cart is empty</Typography>
//           </Box>
//         ) : (
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
//               Items in your cart:
//             </Typography>
//             <Box sx={{ 
//               maxHeight: '400px', 
//               overflowY: 'auto',
//               border: `1px solid ${theme.palette.divider}`,
//               borderRadius: 1,
//             }}>
//               {cartItems.map((item, index) => (
//                 <Box 
//                   key={`${item.shopify_id}-${index}`}
//                   sx={{ 
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     p: 2,
//                     borderBottom: index < cartItems.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
//                     '&:hover': {
//                       backgroundColor: 'action.hover'
//                     }
//                   }}
//                 >
//                   <Box sx={{ flex: 1 }}>
//                     <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                       {item.product_title} - {item.qty}x
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       Variant: {item.title}
//                     </Typography>
//                     <Typography variant="body2" sx={{ mt: 1, color: 'primary.main', fontWeight: 600 }}>
//                       {currency}{parseFloat(cleanNumber(item.price))}
//                     </Typography>
//                   </Box>
//                   <Button
//                     onClick={() => onRemoveItem(item.shopify_id)}
//                     size="small"
//                     variant="outlined"
//                     color="error"
//                     disabled={checkoutLoading}
//                     sx={{ ml: 2 }}
//                   >
//                     Remove
//                   </Button>
//                 </Box>
//               ))}
//             </Box>
            
//             <Box sx={{ 
//               mt: 3, 
//               pt: 2, 
//               borderTop: `2px solid ${theme.palette.divider}`,
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center'
//             }}>
//               <Typography variant="h6" sx={{ fontWeight: 700 }}>
//                 Total:
//               </Typography>
//               <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
//                 {currency}{cleanNumber(totalPrice.toString())}
//               </Typography>
//             </Box>
//           </Box>
//         )}
//       </DialogContent>

//       <DialogActions sx={{ p: 3, gap: 1 }}>
//         <Button
//           onClick={() => setShowCartModal(false)}
//           disabled={checkoutLoading}
//           variant="outlined"
//           sx={{ minWidth: 100 }}
//         >
//           Continue Shopping
//         </Button>
//         <Button
//           onClick={onCheckout}
//           disabled={checkoutLoading || cartItems.length === 0}
//           variant="contained"
//           startIcon={checkoutLoading ? <CircularProgress size={20} /> : <ShoppingCart />}
//           sx={{ minWidth: 140 }}
//         >
//           {checkoutLoading ? 'Processing...' : 'Place Order'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };


// function CatalogueProductList() {
//   const router = useRouter()
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'))
//   const [businesses, setBusinesses] = useState<WhatsAppData[]>([])
//   const [selectedBusiness, setSelectedBusiness] = useState<WhatsAppData | null>(null)
//   const [businessCategory, setBusinessCategory] = useState<"Shopify-Ecommerce" | "Food" | null>(null)
//   const [currency, setCurrency] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   // Food menu states with pagination
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([])
//   const [menuCurrentPage, setMenuCurrentPage] = useState(1)
//   const [menuTotalCount, setMenuTotalCount] = useState(0)
//   const [menuHasNextPage, setMenuHasNextPage] = useState(false)
//   const [menuHasPreviousPage, setMenuHasPreviousPage] = useState(false)
//   const [menuTotalPages, setMenuTotalPages] = useState(0)
//   const [editingId, setEditingId] = useState<number | null>(null)
//   const [showForm, setShowForm] = useState(false)
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "FAST_FOOD" as MenuItem["category"],
//     image_link: "",
//     available: true,
//   })

//   // Shopify-Ecommerce
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [hasNextPage, setHasNextPage] = useState(false);
//   const [hasPreviousPage, setHasPreviousPage] = useState(false);
//   const [BUSINESS_ID,setBusinessData] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
  
//   const searchInputRef = useRef<HTMLInputElement>(null);

//   // Shopify states
//   const [products, setProducts] = useState<Product[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [modalAction, setModalAction] = useState<string>('')
//   const [selectedId, setSelectedId] = useState<number>(0)

//   const [showPlaceOrderModal, setShowPlaceOrderModal] = useState(false)
//   const [placeOrderLoading, setPlaceOrderLoading] = useState(false)
//   const [selectedProductVariant, setSelectedProductVariant] = useState<any>(null)
//   const [orderFormData, setOrderFormData] = useState<OrderFormData>({
//     first_name: "",
//     last_name: "",
//     email: "",
//     phone: "",
//     shipping_address1: "",
//     shipping_city: "",
//     shipping_country: "",
//     financial_status: "paid",
//     partial_payment_amount: "0",
//     shipping_zip:"",
//     note: "",
//     variant_id: "",
//     quantity: "1",
//   })

//   const [cart, setCart] = useState<CartItem[]>([])
//   const [showCartModal, setShowCartModal] = useState(false)

//   // Items per page state
//   const [itemsPerPage, setItemsPerPage] = useState<number>(12);

//   // Search debouncing
//   const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

//   const fetchWhatsAppFeed = useCallback(async () => {
//     try {
//       const response = await GetWhatsApp();
//       const data = response?.data?.results || [];

//       const filteredData = data.filter(
//         (item: any) =>
//           item.category === "Food" || item.category === "Shopify-Ecommerce"
//       );

//       setBusinesses(filteredData);

//       if (filteredData.length > 0) {
//         console.log("GetWhatsApp Filtered:", filteredData);
//         setSelectedBusiness(filteredData[0]);
//         setBusinessCategory(filteredData[0].category);

//         if (filteredData[0].category === "Food") {
//           fetchMenuItems(BUSINESS_ID, 1);
//         } else {
//           fetchProducts(currentPage, '');
//         }
//       }
//     } catch (error: any) {
//       console.log(error);
//       setError("Failed to fetch WhatsApp phone numbers.");
//     }
//   }, [currentPage, BUSINESS_ID]);

//   const fetchBusinessData = useCallback(async () => {
//     try {
//       const data: any = await getAllBusiness(undefined)
//       console.log('fetchBusinessData', data.data.results[0].business_id)
//       if(data.data.results[0]){
//         setBusinessData(data.data.results[0].business_id)
//         setCurrency(data.data.results[0].currency.symbol)
//       }
//     } catch (err: any) {
//       console.error("Error fetching business data:", err)
//     }
//   }, [])

//   const fetchMenuItems = useCallback(async (businessId: string, page: number = 1) => {
//     try {
//       setLoading(true)
//       const authToken = localStorage.getItem("auth_token")
//       if (!authToken) {
//         router.push("/en/login/")
//         return
//       }

//       const response = await fetch(`${getBaseUrl()}products/menu/?business=${businessId}&page=${page}&page_size=${itemsPerPage}`, {
//         headers: { Authorization: `Token ${authToken}` },
//       })

//       if (response.status === 401) {
//         router.push("/en/login/")
//         return
//       }

//       const data: MenuPaginatedResponse = await response.json()
//       setMenuItems(data.results || [])
//       setMenuTotalCount(data.count)
//       setMenuHasNextPage(!!data.next)
//       setMenuHasPreviousPage(!!data.previous)
//       setMenuTotalPages(Math.ceil(data.count / itemsPerPage))
//     } catch (err: any) {
//       console.error("Error fetching menu items:", err)
//       setError("Failed to fetch menu items")
//     } finally {
//       setLoading(false)
//     }
//   }, [router, itemsPerPage])

//   // Updated fetchProducts function with search
//   const fetchProducts = async (page: number, search: string) => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log('BUSINESS_ID', BUSINESS_ID)
//       console.log('page', page)
//       console.log('search', search)
      
//       const response: PaginatedResponse = await getAllMenuesByBusinessId(BUSINESS_ID, page, itemsPerPage, search);
//       console.log('response PaginatedResponse fetchProducts', response)
      
//       setProducts(response.results);
//       setTotalCount(response.count);
//       setHasNextPage(!!response.next);
//       setHasPreviousPage(!!response.previous);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       setHasNextPage(false);
//       setHasPreviousPage(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle search with debouncing
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     // Clear previous timeout
//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }

//     // Set new timeout for debouncing (500ms)
//     const newTimeout = setTimeout(() => {
//       setCurrentPage(1); // Reset to first page when searching
//       fetchProducts(1, value);
//     }, 500);

//     setSearchTimeout(newTimeout);
//   };

//   // Clear search
//   const handleClearSearch = () => {
//     setSearchTerm('');
//     setCurrentPage(1);
//     fetchProducts(1, '');
//     searchInputRef.current?.focus();
//   };

//   const toggleAvailability = async (id: number, currentStatus: boolean) => {
//     try {
//       setLoading(true)
//       const authToken = localStorage.getItem("auth_token")
//       if (!authToken) {
//         router.push("/en/login/")
//         return
//       }

//       const itemToUpdate = menuItems.find(item => item.id === id)
//       if (!itemToUpdate) return

//       const payload = {
//         ...itemToUpdate,
//         available: !currentStatus
//       }

//       const response = await fetch(`${getBaseUrl()}products/menu/${id}/`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${authToken}`,
//         },
//         body: JSON.stringify(payload),
//       })

//       if (response.status === 401) {
//         router.push("/en/login/")
//         return
//       }

//       if (response.ok) {
//         toast.success(`Item ${!currentStatus ? 'activated' : 'deactivated'}`)
//         if (selectedBusiness) {
//           fetchMenuItems(selectedBusiness.business_id, menuCurrentPage)
//         }
//       } else {
//         toast.error("Failed to update item availability")
//       }
//     } catch (err: any) {
//       console.error("Error updating availability:", err)
//       toast.error("Error updating availability")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleAddToCart = (variant: any, product: any, qty: number) => {
//     const cartItem: CartItem = {
//       shopify_id: variant.shopify_id,
//       title: variant.title,
//       price: variant.price,
//       product_title: product.title,
//       product_id: product.id,
//       qty: qty
//     }
    
//     setCart([...cart, cartItem])
//     toast.success('Item added to cart!')
//   }

//   const handleRemoveFromCart = (shopify_id: string | number) => {
//     setCart(cart.filter(item => item.shopify_id !== shopify_id))
//     toast.success('Item removed from cart')
//   }

//   const handleCheckout = () => {
//     if (cart.length === 0) {
//       toast.error('Your cart is empty')
//       return
//     }
    
//     setShowCartModal(false)
//     // Set first item as selected and show order modal
//     setSelectedProductVariant({ 
//       variants: cart.map(item => ({
//         shopify_id: item.shopify_id,
//         title: `${item.product_title} - ${item.title}`,
//         price: item.price,
//         qty: item.qty // Placeholder
//       }))
//     })
//     setOrderFormData(prev => ({
//       ...prev,
//       variant_id: '',
//       // quantity: '1'
//     }))
//     setShowPlaceOrderModal(true)
//   }

//   const handlePlaceOrder = useCallback(async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     try {
//       setPlaceOrderLoading(true)
//       const authToken = localStorage.getItem("auth_token")
//       if (!authToken) {
//         router.push("/en/login/")
//         return
//       }

//       let lineItems: any = []
      
//       if (cart.length > 0) {
//         // Checkout from cart - include all items with their actual quantities
//         lineItems = cart.map(item => ({
//           variant_id: parseInt(item.shopify_id.toString()),
//           quantity: item.qty  // Use item.qty instead of hardcoded 1
//         }))
//       } else if (orderFormData.variant_id) {
//         // Checkout from single product selection
//         lineItems = [
//           {
//             variant_id: parseInt(orderFormData.variant_id),
//             quantity: parseInt(orderFormData.quantity) || 1
//           }
//         ]
//       }

//       if (!lineItems.length) {
//         toast.error("Please select a product variant")
//         setPlaceOrderLoading(false)
//         return
//       }

//       const payload: any = {
//         line_items: lineItems,
//         customer: {
//           first_name: orderFormData.first_name,
//           last_name: orderFormData.last_name,
//           email: orderFormData.email,
//           phone: orderFormData.phone,
//         },
//         email: orderFormData.email,
//         shipping_address: {
//           first_name: orderFormData.first_name,
//           last_name: orderFormData.last_name,
//           address1: orderFormData.shipping_address1,
//           city: orderFormData.shipping_city,
//           country: orderFormData.shipping_country,
//           zip: orderFormData.shipping_zip,
//           phone: orderFormData.phone,
//         },
//         financial_status: orderFormData.financial_status,
//         note: orderFormData.note,
//         metafields: [
//           {
//             "namespace": "payment",
//             "key": "partial_payment_amount",
//             "type": "number_integer",
//             "value": Number(orderFormData.partial_payment_amount) || 0
//           }
//         ]
//       }

      
//       const response = await fetch(`${getBaseUrl()}products/place-shopify-order/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Token ${authToken}`,
//         },
//         body: JSON.stringify(payload),
//       })

//       if (response.status === 401) {
//         router.push("/en/login/")
//         return
//       }

//       if (response.ok) {
//         toast.success("Order placed successfully!")
//         setShowPlaceOrderModal(false)
//         setCart([]) // Clear cart after successful order
//         setOrderFormData({
//           first_name: "",
//           last_name: "",
//           email: "",
//           phone: "",
//           shipping_address1: "",
//           shipping_city: "",
//           shipping_country: "",
//           shipping_zip: "",
//           financial_status: "paid",
//           partial_payment_amount: "",
//           note: "",
//           variant_id: "",
//           quantity: "1",
//         })
//         setSelectedProductVariant(null)
//       } else {
//         const errorData = await response.json()
//         toast.error(errorData.message || "Failed to place order")
//       }
//     } catch (err: any) {
//       console.error("Error placing order:", err)
//       toast.error("Error placing order")
//     } finally {
//       setPlaceOrderLoading(false)
//     }
//   }, [orderFormData, cart, router])

//   useEffect(() => {
//     fetchBusinessData()
//   }, [fetchBusinessData])

//   useEffect(() => {
//     if (BUSINESS_ID) {
//       fetchWhatsAppFeed()
//     }
//   }, [BUSINESS_ID, fetchWhatsAppFeed])

//   useEffect(() => {
//     if (BUSINESS_ID && businessCategory === "Shopify-Ecommerce") {
//       fetchProducts(currentPage, searchTerm);
//     }
//   }, [currentPage, BUSINESS_ID, businessCategory]);

//   const handleNextPage = () => {
//     if (hasNextPage) {
//       setCurrentPage(prev => prev + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handlePreviousPage = () => {
//     if (hasPreviousPage) {
//       setCurrentPage(prev => prev - 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
//     setCurrentPage(value);
//   };

//   const handleMenuNextPage = () => {
//     if (menuHasNextPage && selectedBusiness) {
//       setMenuCurrentPage(prev => prev + 1);
//       fetchMenuItems(selectedBusiness.business_id, menuCurrentPage + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleMenuPreviousPage = () => {
//     if (menuHasPreviousPage && selectedBusiness) {
//       setMenuCurrentPage(prev => prev - 1);
//       fetchMenuItems(selectedBusiness.business_id, menuCurrentPage - 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };

//   const handleMenuPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
//     setMenuCurrentPage(value);
//     if (selectedBusiness) {
//       fetchMenuItems(selectedBusiness.business_id, value);
//     }
//   };

//   const handleItemsPerPageChange = (newItemsPerPage: number) => {
//     setItemsPerPage(newItemsPerPage);
//     setCurrentPage(1);
//     setMenuCurrentPage(1);
    
//     if (businessCategory === "Food" && selectedBusiness) {
//       fetchMenuItems(selectedBusiness.business_id, 1);
//     } else if (businessCategory === "Shopify-Ecommerce") {
//       fetchProducts(1, searchTerm);
//     }
//   };

//   const totalPages = Math.ceil(totalCount / itemsPerPage);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!selectedBusiness) {
//       toast.error("Please select a business first")
//       return
//     }

//     try {
//       setLoading(true)
//       const authToken = localStorage.getItem("auth_token")
//       if (!authToken) {
//         router.push("/en/login/")
//         return
//       }

//       const payload = {
//         name: formData.name,
//         description: formData.description,
//         price: Number.parseFloat(formData.price),
//         category: formData.category,
//         image_link: formData.image_link,
//         business: selectedBusiness.business_id,
//       }

//       let response
//       if (editingId) {
//         response = await fetch(`${getBaseUrl()}products/menu/${editingId}/`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${authToken}`,
//           },
//           body: JSON.stringify(payload),
//         })
//       } else {
//         response = await fetch(`${getBaseUrl()}products/menu/`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${authToken}`,
//           },
//           body: JSON.stringify(payload),
//         })
//       }

//       if (response.status === 401) {
//         router.push("/en/login/")
//         return
//       }

//       if (response.ok) {
//         toast.success(editingId ? "Menu item updated" : "Menu item created")
//         setFormData({ 
//           name: "", 
//           description: "", 
//           price: "", 
//           category: "FAST_FOOD", 
//           image_link: "",
//           available: true 
//         })
//         setEditingId(null)
//         setShowForm(false)
//         if (selectedBusiness) {
//           fetchMenuItems(selectedBusiness.business_id, menuCurrentPage)
//         }
//       } else {
//         const error = await response.json()
//         toast.error(error.message || "Failed to save menu item")
//       }
//     } catch (err: any) {
//       console.error("Error saving menu item:", err)
//       toast.error("Error saving menu item")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (id: number) => {
//     try {
//       setLoading(true)
//       const authToken = localStorage.getItem("auth_token")
//       if (!authToken) {
//         router.push("/en/login/")
//         return
//       }

//       const response = await fetch(`${getBaseUrl()}products/menu/${id}/`, {
//         method: "DELETE",
//         headers: { Authorization: `Token ${authToken}` },
//       })

//       if (response.status === 401) {
//         router.push("/en/login/")
//         return
//       }

//       if (response.ok) {
//         toast.success("Menu item deleted")
//         if (selectedBusiness) {
//           fetchMenuItems(selectedBusiness.business_id, menuCurrentPage)
//         }
//       } else {
//         toast.error("Failed to delete menu item")
//       }
//     } catch (err: any) {
//       console.error("Error deleting menu item:", err)
//       toast.error("Error deleting menu item")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEdit = (item: MenuItem) => {
//     setFormData({
//       name: item.name,
//       description: item.description,
//       price: item.price,
//       category: item.category,
//       image_link: item.image_link,
//       available: item.available,
//     })
//     setEditingId(item.id)
//     setShowForm(true)
//   }

//   const handleCancel = () => {
//     setFormData({ 
//       name: "", 
//       description: "", 
//       price: "", 
//       category: "FAST_FOOD", 
//       image_link: "",
//       available: true 
//     })
//     setEditingId(null)
//     setShowForm(false)
//   }

//   const handleCategoryChange = (e: any) => {
//     const value = e.target.value;
//     setBusinessCategory(value);
//     console.log("Selected category:", value);
    
//     setMenuItems([])
//     setProducts([])
//     setShowForm(false)
//     setEditingId(null)
//     setMenuCurrentPage(1)
//     setCurrentPage(1)
//     setSearchTerm('')
    
//     if (value === "Food") {
//       fetchMenuItems(BUSINESS_ID, 1)
//     } else {
//       fetchProducts(1, '')
//     }
//   };

//   const refresh = () => {
//     if (businessCategory === "Food") {
//       fetchMenuItems(BUSINESS_ID, menuCurrentPage)
//     } else {
//       fetchProducts(currentPage, searchTerm)
//     }
//   };

//   const activate_shopify_product= async (id: number) => {
//     try {
//       setLoading(true)
//       const authToken = localStorage.getItem("auth_token")
//       if (!authToken) {
//         router.push("/en/login/")
//         return
//       }

//       const response = await fetch(`${getBaseUrl()}products/shopify/${id}/activate/`, {
//         method: "POST",
//         headers: { Authorization: `Token ${authToken}` },
//       })
//       console.log('response;',response)

//       if (response.status === 401) {
//         router.push("/en/login/")
//         return
//       }

//       if (response.ok) {
//         toast.success("Product Activated")
//         if (selectedBusiness) {
//           fetchProducts(currentPage, searchTerm)
//         }
//       } else {
//         toast.error("Failed to activate product")
//       }
//     } catch (err: any) {
//       console.error("Error activating product:", err)
//       toast.error("Error activating product")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const deactivate_shopify_product = async (id: number) => {
//     try {
//       setLoading(true)
//       const authToken = localStorage.getItem("auth_token")
//       if (!authToken) {
//         router.push("/en/login/")
//         return
//       }

//       const response = await fetch(`${getBaseUrl()}products/shopify/${id}/deactivate/`, {
//         method: "DELETE",
//         headers: { Authorization: `Token ${authToken}` },
//       })

//       if (response.status === 401) {
//         router.push("/en/login/")
//         return
//       }

//       if (response.ok) {
//         toast.success("Product Deactivated")
//         if (selectedBusiness) {
//           fetchProducts(currentPage, searchTerm)
//         }
//       } else {
//         toast.error("Failed to deactivate product")
//       }
//     } catch (err: any) {
//       console.error("Error deactivating product:", err)
//       toast.error("Error deactivating product")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePlaceOrderFromProduct = (product: any) => {
//     setSelectedProductVariant(product)
//     setOrderFormData(prev => ({
//       ...prev,
//       variant_id: "",
//       quantity: "1"
//     }))
//     setShowPlaceOrderModal(true)
//   }

//   // Business selector component
//   const BusinessSelector = () => (
//     <>
//      <ConfirmationModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onConfirm={() =>{
//           if(selectedId!=null && modalAction == 'delete'){
//             handleDelete(selectedId)
//           }
//           else if(selectedId!=null && modalAction == 'Activate' || modalAction == 'Deactivate'){
//             if (modalAction == 'Activate'){
//               toggleAvailability(selectedId, true)
//             }else{
//               toggleAvailability(selectedId, false)
//             }
//           }
//           else if(modalAction == 'Meta'){
//             if(businessCategory == 'Food'){
//               syncMenuData(BUSINESS_ID,businessCategory)
//               }
//             else if(businessCategory == 'Shopify-Ecommerce'){
//                 syncMenuData(BUSINESS_ID,businessCategory)
//               }
//           }
//           else if(modalAction == 'Product-Deactivate'){
//              deactivate_shopify_product(selectedId).finally(()=>{
//                fetchProducts(currentPage, searchTerm)
//               })
//           }
//           else if(modalAction == 'Product-Activate'){
//              activate_shopify_product(selectedId).finally(()=>{
//                fetchProducts(currentPage, searchTerm)
//               })
             
//           }else if(modalAction == 'Meta-Clear'){
//             if (businessCategory == 'Shopify-Ecommerce' || businessCategory == 'Food'){
//                 syncMenuData(BUSINESS_ID,businessCategory,'Meta-Clear')
//             }
            
//           }
//         }}
//         title="Confirm Action"
//         message="Are you sure you want to proceed with this action? This cannot be undone."
//       />
//       <Card sx={{ mb: 3 }}>
//         <CardHeader
//           title={
//             <Typography
//               variant={isMobile ? "h5" : "h4"}
//               component="h1"
//               color="primary"
//               fontWeight="bold"
//             >
//               {businessCategory === "Food" ? 'Food Catalog' : 'Product Catalog'}
//             </Typography>
//           }
          
//           action={
//             <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//               <select
//                 value={businessCategory || ""}
//                 onChange={handleCategoryChange}
//                 style={{
//                   padding: "8px 12px",
//                   borderRadius: "8px",
//                   border: "1px solid #ccc",
//                   fontSize: "0.9rem",
//                   background: "#fff",
//                   color: "#333",
//                 }}
//               >
//                 {businesses && businesses.map((cat, index) => (
//                   <option key={index} value={cat.category}>
//                     {cat.category}
//                   </option>
//                 ))}
//               </select>

//               <Button
//                 variant="contained"
//                 startIcon={<Refresh />}
//                 onClick={refresh}
//                 disabled={loading}
//               >
//                 Refresh
//               </Button>

//               {businessCategory == 'Shopify-Ecommerce' &&
//                 <Button
//                   variant="outlined"
//                   startIcon={<Sync />}
//                   onClick={() => {
//                     setIsModalOpen(true)
//                     setModalAction('Meta')
//                     }}
//                   disabled={loading}
//                   color="secondary"
//                 >
//                   Sync All Products To Meta
//                 </Button>
//               }

//               {businessCategory == 'Shopify-Ecommerce' &&
//                 <Button
//                   variant="outlined"
//                   startIcon={<Sync />}
//                   onClick={() => {
//                     setIsModalOpen(true)
//                     setModalAction('Meta-Clear')
//                     }}
//                   disabled={loading}
//                   color="secondary"
//                 >
//                   Clear Meta Catalogue
//                 </Button>
//               }
//             </Box>
//           }
//           avatar={
//             <Search sx={{ width: 40, height: 40, color: "primary.main" }} />
//           }
//         />
//       </Card>
//     </>
//   );

//   // Items per page selector component
//   const ItemsPerPageSelector = () => (
//     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//       <Typography variant="body2" color="text.secondary">
//         Items per page:
//       </Typography>
//       <FormControl size="small" sx={{ minWidth: 80 }}>
//         <Select
//           value={itemsPerPage}
//           onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
//           displayEmpty
//         >
//           {ITEMS_PER_PAGE_OPTIONS.map((option) => (
//             <MenuItem key={option} value={option}>
//               {option}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </Box>
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//           <p className="mt-4 text-foreground">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
//           <p className="text-red-800">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     )
//   }

//   // Render Food Menu UI
//   if (businessCategory === "Food") {
//     return (
//       <div className="min-h-screen bg-background p-4 md:p-8">
//         <div className="max-w-6xl mx-auto">
          
//           {/* Business Selector */}
//           <BusinessSelector />

//           {/* Items Per Page Selector */}
//           <ItemsPerPageSelector />

//           {/* Menu Pagination Info */}
//           {(menuHasNextPage || menuHasPreviousPage) && (
//             <Card sx={{ mb: 3 }}>
//               <Box sx={{ p: 2 }}>
//                 <Grid container alignItems="center" justifyContent="space-between">
//                   <Grid item>
//                     <Typography variant="body2" color="text.secondary">
//                       Page {menuCurrentPage} • Showing {menuItems.length} of {menuTotalCount} menu items
//                     </Typography>
//                   </Grid>
                  
//                   <Grid item>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <Button
//                         onClick={handleMenuPreviousPage}
//                         disabled={!menuHasPreviousPage}
//                         startIcon={<ChevronLeft />}
//                         variant="outlined"
//                         size="small"
//                       >
//                         Previous
//                       </Button>

//                       <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
//                         Page {menuCurrentPage}
//                       </Typography>

//                       <Button
//                         onClick={handleMenuNextPage}
//                         disabled={!menuHasNextPage}
//                         endIcon={<ChevronRight />}
//                         variant="outlined"
//                         size="small"
//                       >
//                         Next
//                       </Button>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </Box>
//             </Card>
//           )}

//           {/* Add Button */}
//           <div className="mb-6">
//             {!showForm && (
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
//               >
//                 + Add Menu Item
//               </button>
//             )}
//           </div>

//           {/* Form */}
//           {showForm && (
//             <div className="bg-card border border-border rounded-lg p-6 mb-8">
//               <h2 className="text-xl font-bold text-foreground mb-4">
//                 {editingId ? "Edit Menu Item" : "Add New Menu Item"}
//               </h2>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Name */}
//                   <div>
//                     <label className="block text-sm font-medium text-foreground mb-1">Item Name *</label>
//                     <input
//                       type="text"
//                       required
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder="e.g., Burger"
//                     />
//                   </div>

//                   {/* Price */}
//                   <div>
//                     <label className="block text-sm font-medium text-foreground mb-1">Price ({currency}) *</label>
//                     <input
//                       type="number"
//                       required
//                       step="0.01"
//                       value={formData.price}
//                       onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                       className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder="0.00"
//                     />
//                   </div>

//                   {/* Category */}
//                   <div>
//                     <label className="block text-sm font-medium text-foreground mb-1">Category *</label>
//                     <select
//                       required
//                       value={formData.category}
//                       onChange={(e) => setFormData({ ...formData, category: e.target.value as MenuItem["category"] })}
//                       className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//                     >
//                       {MENU_CATEGORIES.map((cat) => (
//                         <option key={cat.value} value={cat.value}>
//                           {cat.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Image Link */}
//                   <div>
//                     <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
//                     <input
//                       type="url"
//                       value={formData.image_link}
//                       onChange={(e) => setFormData({ ...formData, image_link: e.target.value })}
//                       className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder="https://..."
//                     />
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-1">Description</label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="Item description..."
//                     rows={3}
//                   />
//                 </div>

               
//                 {/* Form Actions */}
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     type="submit"
//                     className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
//                   >
//                     {editingId ? "Update Item" : "Add Item"}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleCancel}
//                     className="px-6 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 font-medium"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {/* Menu Items Grid */}
//           {menuItems.length === 0 ? (
//             <div className="bg-card border border-border rounded-lg p-12 text-center">
//               <p className="text-muted-foreground text-lg">No menu items yet. Add your first item!</p>
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {menuItems.map((item) => (
//                   <div
//                     key={item.id}
//                     className={`bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
//                       !item.available ? "opacity-60 border-destructive/30" : "border-border"
//                     }`}
//                   >
//                     {/* Image */}
//                     {item.image_link && (
//                       <div className="w-full h-48 bg-muted overflow-hidden">
//                         <img
//                           src={item.image_link || "/placeholder.svg"}
//                           alt={item.name}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             ;(e.target as HTMLImageElement).src = "/diverse-food-spread.png"
//                           }}
//                         />
//                       </div>
//                     )}

//                     {/* Content */}
//                     <div className="p-4">
//                       <div className="flex justify-between items-start mb-2">
//                         <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
//                         <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
//                           {MENU_CATEGORIES.find((c) => c.value === item.category)?.label}
//                         </span>
//                       </div>

//                       <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>

//                       <div className="flex justify-between items-center mb-4">
//                         <span className="text-xl font-bold text-primary">
//                           {currency}
//                           {item.price}
//                         </span>
//                         <span
//                           className={`text-xs px-2 py-1 rounded ${
//                             item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {item.available ? "Available" : "Unavailable"}
//                         </span>
//                       </div>

//                       {/* Actions */}
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleEdit(item)}
//                           className="flex-1 px-3 py-2  cursor-pointer bg-primary/10 text-primary rounded hover:bg-primary/20 font-medium text-sm"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() =>{ 
//                             setSelectedId(item.id)
//                             if(item.available == true){
//                               setModalAction('Activate')
//                             }else{
//                               setModalAction('Deactivate')
//                             }
//                             setIsModalOpen(true)
//                             }}
//                           className={`flex-1 px-3 py-2 rounded cursor-pointer font-medium text-sm ${
//                             item.available
//                               ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
//                               : "bg-green-100 text-green-800 hover:bg-green-200"
//                           }`}
//                         >
//                           {item.available ? "Deactivate" : "Activate"}
//                         </button>
//                         <button
//                           onClick={()=>{
//                             setSelectedId(item.id)
//                             setModalAction("delete")
//                             setIsModalOpen(true)
//                           }}
//                           className="flex-1 px-3 py-2  cursor-pointer bg-destructive/10 text-destructive rounded hover:bg-destructive/20 font-medium text-sm"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Bottom Pagination Controls for Menu */}
//               {menuTotalPages > 1 && (
//                 <Card sx={{ mt: 3 }}>
//                   <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
//                     <Pagination
//                       count={menuTotalPages}
//                       page={menuCurrentPage}
//                       onChange={handleMenuPageChange}
//                       color="primary"
//                       showFirstButton
//                       showLastButton
//                       siblingCount={isMobile ? 0 : 1}
//                     />
//                   </Box>
                  
//                   {/* Additional navigation buttons */}
//                   <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, pb: 2 }}>
//                     <Button
//                       onClick={handleMenuPreviousPage}
//                       disabled={!menuHasPreviousPage}
//                       startIcon={<ChevronLeft />}
//                       variant="outlined"
//                     >
//                       Previous Page
//                     </Button>
                    
//                     <Button
//                       onClick={handleMenuNextPage}
//                       disabled={!menuHasNextPage}
//                       endIcon={<ChevronRight />}
//                       variant="outlined"
//                     >
//                       Next Page
//                     </Button>
//                   </Box>
//                 </Card>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     )
//   }

//   // Render Shopify Ecommerce UI
//   if (businessCategory == "Shopify-Ecommerce") {
//     return (
//       <>
//         <CartModal
//           showCartModal={showCartModal}
//           setShowCartModal={setShowCartModal}
//           cartItems={cart}
//           onRemoveItem={handleRemoveFromCart}
//           onCheckout={handleCheckout}
//           currency={currency}
//           checkoutLoading={placeOrderLoading}
//         />

//         {/* Place Order Modal */}
//         <PlaceOrderModal
//           showPlaceOrderModal={showPlaceOrderModal}
//           setShowPlaceOrderModal={setShowPlaceOrderModal}
//           placeOrderLoading={placeOrderLoading}
//           selectedProductVariant={selectedProductVariant}
//           orderFormData={orderFormData}
//           setOrderFormData={setOrderFormData}
//           currency={currency}
//           handlePlaceOrder={handlePlaceOrder}
//         />
//         <Box
//           sx={{
//             minHeight: '100vh',
//             bgcolor: 'background.default',
//             p: { xs: 1, sm: 2, md: 3 },
//           }}
//         >
//           <Container maxWidth="xl">
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//               <Box sx={{ flex: 1 }}>
//                 <BusinessSelector />
//               {businessCategory === "Shopify-Ecommerce" && (
//                 <Button
//                   variant="contained"
//                   startIcon={<ShoppingCart />}
//                   onClick={() => setShowCartModal(true)}
//                   sx={{ minWidth: 150 }}
//                 >
//                   Cart ({cart.length})
//                 </Button>
//               )}
//               </Box>
//             </Box>

//             {/* Search Bar for Shopify-Ecommerce */}
//             {businessCategory === "Shopify-Ecommerce" && (
//               <Card sx={{ mb: 3 }}>
//                 <Box sx={{ p: 2 }}>
//                   <TextField
//                     ref={searchInputRef}
//                     fullWidth
//                     variant="outlined"
//                     placeholder="Search products by title..."
//                     value={searchTerm}
//                     onChange={handleSearchChange}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <Search />
//                         </InputAdornment>
//                       ),
//                       endAdornment: searchTerm && (
//                         <InputAdornment position="end">
//                           <IconButton
//                             size="small"
//                             onClick={handleClearSearch}
//                             edge="end"
//                           >
//                             <Close />
//                           </IconButton>
//                         </InputAdornment>
//                       ),
//                     }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2,
//                       }
//                     }}
//                   />
//                 </Box>
//               </Card>
//             )}

//             {/* Items Per Page Selector */}
//             <ItemsPerPageSelector />

//             {/* Error Alert */}
//             {error && (
//               <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
//                 {error}
//               </Alert>
//             )}

//             {/* Pagination Info */}
//             {(hasNextPage || hasPreviousPage) && (
//               <Card sx={{ mb: 3 }}>
//                 <Box sx={{ p: 2 }}>
//                   <Grid container alignItems="center" justifyContent="space-between">
//                     <Grid item>
//                       <Typography variant="body2" color="text.secondary">
//                         {searchTerm ? (
//                           <>Search results for &quot;{searchTerm}&quot; • Page {currentPage} • Showing {products.length} of {totalCount} products</>
//                         ) : (
//                           <>Page {currentPage} • Showing {products.length} of {totalCount} products</>
//                         )}
//                       </Typography>
//                     </Grid>
                    
//                     <Grid item>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Button
//                           onClick={handlePreviousPage}
//                           disabled={!hasPreviousPage}
//                           startIcon={<ChevronLeft />}
//                           variant="outlined"
//                           size="small"
//                         >
//                           Previous
//                         </Button>

//                         <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
//                           Page {currentPage}
//                         </Typography>

//                         <Button
//                           onClick={handleNextPage}
//                           disabled={!hasNextPage}
//                           endIcon={<ChevronRight />}
//                           variant="outlined"
//                           size="small"
//                         >
//                           Next
//                         </Button>
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               </Card>
//             )}

//             {/* Products Grid */}
//             {loading ? (
//               <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
//                 <CircularProgress size={60} />
//               </Box>
//             ) : products.length === 0 ? (
//               <Card>
//                 <Box sx={{ textAlign: 'center', py: 10 }}>
//                   <Search sx={{ width: 64, height: 64, color: 'text.disabled', mb: 2, mx: 'auto' }} />
//                   <Typography variant="h6" color="text.secondary" gutterBottom>
//                     {searchTerm ? `No products found for "${searchTerm}"` : 'No products found'}
//                   </Typography>
//                   {searchTerm && (
//                     <Button 
//                       variant="text" 
//                       onClick={handleClearSearch}
//                       sx={{ mt: 1 }}
//                     >
//                       Clear search
//                     </Button>
//                   )}
//                   {(hasNextPage || hasPreviousPage) && !searchTerm && (
//                     <Typography variant="body2" color="text.secondary">
//                       Try checking other pages
//                     </Typography>
//                   )}
//                 </Box>
//               </Card>
//             ) : (
//               <>
//                 {/* Results count when no pagination controls are shown */}
//                 {!(hasNextPage || hasPreviousPage) && (
//                   <Card sx={{ mb: 3 }}>
//                     <Box sx={{ p: 2 }}>
//                       <Typography variant="body2" color="text.secondary">
//                         {searchTerm ? (
//                           <>Showing {products.length} product{products.length !== 1 ? 's' : ''} matching &quot;{searchTerm}&quot;</>
//                         ) : (
//                           <>Showing {products.length} product{products.length !== 1 ? 's' : ''}</>
//                         )}
//                       </Typography>
//                     </Box>
//                   </Card>
//                 )}

//                 <Grid container spacing={3}>
//                   {products.map((product:any) => (
//                     <Grid item xs={12} sm={6} md={4} key={product.id}>
//                       <ProductCard 
//                         product={product} 
//                         currency={currency} 
//                         setIsModalOpen={setIsModalOpen} 
//                         setModalAction={setModalAction} 
//                         setSelectedId={setSelectedId}
//                         onAddToCart={handleAddToCart} // Pass the add to cart handler
//                       />
//                     </Grid>
//                   ))}
//                 </Grid>

//                 {/* Bottom Pagination Controls */}
//                 {totalPages > 1 && (
//                   <Card sx={{ mt: 3 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
//                       <Pagination
//                         count={totalPages}
//                         page={currentPage}
//                         onChange={handlePageChange}
//                         color="primary"
//                         showFirstButton
//                         showLastButton
//                         siblingCount={isMobile ? 0 : 1}
//                       />
//                     </Box>
                    
//                     {/* Additional navigation buttons */}
//                     <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, pb: 2 }}>
//                       <Button
//                         onClick={handlePreviousPage}
//                         disabled={!hasPreviousPage}
//                         startIcon={<ChevronLeft />}
//                         variant="outlined"
//                       >
//                         Previous Page
//                       </Button>
                      
//                       <Button
//                         onClick={handleNextPage}
//                         disabled={!hasNextPage}
//                         endIcon={<ChevronRight />}
//                         variant="outlined"
//                       >
//                         Next Page
//                       </Button>
//                     </Box>
//                   </Card>
//                 )}
//               </>
//             )}
//           </Container>
//         </Box>
//       </>
//     )
//   }

//   return null;
// }

// export default CatalogueProductList


"use client"
import { useEffect, useState, useCallback, useRef } from "react"
import type React from "react"
import { Product as productType} from '@/types/poducts';
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast"
import { getAllBusiness } from "@/api/business"
import { GetWhatsApp } from "@/api/whatsapp"
import { getBaseUrl } from "@/api/vars/vars"
import {
  Box,
  Card,
  CardHeader,
  Typography,
  Container,
  Pagination,
  CircularProgress,
  Grid,
  Button,
  useTheme,
  useMediaQuery,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Refresh,
  Sync,
  Close,
  ShoppingCart,
} from '@mui/icons-material';
import { getAllMenuesByBusinessId, syncMenuData } from '@/api/menu';
import { ProductCard } from "@/views/apps/user/list/ProductCard"
import ConfirmationModal from '@/components/dialogs/confirm-modal'

// Types
interface MenuItem {
  id: number
  name: string
  description: string
  price: string
  category: "FAST_FOOD" | "NORMAL" | "DRINK" | "MAIN_COURSE" | "DESSERT" | "TOPPING"
  image_link: string
  available: boolean
  created_at: string
  business: number
}

interface MenuResponse {
  count: number
  next: string | null
  previous: string | null
  results: MenuItem[]
}

interface BusinessData {
  category: "Shopify-Ecommerce" | "Food"
  business_id: string
  currency?: { symbol: string }
  name?: string
}

interface Product {
  id: number
  title: string
  body_html: string
  status: string
  variants?: any[];
}

interface WhatsAppData {
  category: "Shopify-Ecommerce" | "Food"
  business_id: string
  name?: string
}

interface OrderFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  shipping_address1: string
  shipping_city: string
  shipping_country: string
  financial_status: "paid" | "pending"
  shipping_zip: string,
  partial_payment_amount: string
  note: string
  variant_id: string
  quantity: string
}

// Define the pagination response type
interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: productType[];
}

// Define the pagination response type for menu items
interface MenuPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MenuItem[];
}

interface CartItem {
  shopify_id: string | number;
  title: string;
  price: string;
  product_title: string;
  product_id: number;
  qty: number;
}

const MENU_CATEGORIES = [
  { value: "FAST_FOOD", label: "Fast Food" },
  { value: "NORMAL", label: "Normal Restaurant" },
  { value: "DRINK", label: "Drink" },
  { value: "MAIN_COURSE", label: "Main Course" },
  { value: "DESSERT", label: "Dessert" },
  { value: "TOPPING", label: "Topping" },
]

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36, 150];

// PlaceOrderModal Component
const PlaceOrderModal = ({ 
  showPlaceOrderModal, 
  setShowPlaceOrderModal, 
  placeOrderLoading, 
  selectedProductVariant,
  orderFormData,
  setOrderFormData,
  currency,
  handlePlaceOrder 
}: {
  showPlaceOrderModal: boolean
  setShowPlaceOrderModal: (show: boolean) => void
  placeOrderLoading: boolean
  selectedProductVariant: any
  orderFormData: OrderFormData
  setOrderFormData: React.Dispatch<React.SetStateAction<OrderFormData>>
  currency: string
  handlePlaceOrder: (e: React.FormEvent) => void
}) => {
  console.log('selectedProductVariant',selectedProductVariant)
  const theme = useTheme()

  const handleInputChange = useCallback((field: keyof OrderFormData, value: string | boolean) => {
    setOrderFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  }, [setOrderFormData]);

  const handleVariantChange = useCallback((e: any) => {
    setOrderFormData(prev => ({
      ...prev,
      variant_id: e.target.value
    }));
  }, [setOrderFormData]);

  const handleFinancialStatusChange = useCallback((e: any) => {
    setOrderFormData(prev => ({
      ...prev,
      financial_status: e.target.value as "paid" | "pending"
    }));
  }, [setOrderFormData]);

  function cleanNumber(value: string) {
  return value.toString().replace(/\.00$/, "");
}


  return (
    <Dialog
      open={showPlaceOrderModal}
      onClose={() => !placeOrderLoading && setShowPlaceOrderModal(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10],
        }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 2,
        }}
      >
        <ShoppingCart />
        <Typography variant="h6" component="span" fontWeight="bold">
          Place Shopify Order
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Button
          onClick={() => setShowPlaceOrderModal(false)}
          disabled={placeOrderLoading}
          sx={{
            minWidth: 'auto',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box component="form" onSubmit={handlePlaceOrder} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Product Variant */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                {selectedProductVariant?.variants?.map((variant: any, index: number) => (
  <MenuItem
    key={variant.shopify_id}
    value={variant.shopify_id.toString()}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 12px"
    }}
  >
    <span style={{ fontWeight: 600 }}>{variant.qty}x</span>

    <span style={{ flexGrow: 1 }}>
      {variant.title}
    </span>

    <span>
      {currency}{parseFloat(cleanNumber(variant.price))}
    </span>
  </MenuItem>
))}

                {/* </Select> */}
              </FormControl>
            </Grid>

            {/* Quantity */}
            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Quantity"
                value={orderFormData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                inputProps={{ min: 1 }}
              />
            </Grid> */}

            {/* Customer Details */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="First Name"
                value={orderFormData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Last Name"
                value={orderFormData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                value={orderFormData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Phone Number (with country code)"
                placeholder="+1234567890"
                value={orderFormData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                helperText="Include country code (e.g., +1 for US, +44 for UK)"
              />
            </Grid>

            {/* Shipping Address */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', borderBottom: `1px solid ${theme.palette.primary.light}`, pb: 1 }}>
                Shipping Address
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Street Address"
                value={orderFormData.shipping_address1}
                onChange={(e) => handleInputChange('shipping_address1', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="City"
                value={orderFormData.shipping_city}
                onChange={(e) => handleInputChange('shipping_city', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Country"
                value={orderFormData.shipping_country}
                onChange={(e) => handleInputChange('shipping_country', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ZIP/Postal Code"
                value={orderFormData.shipping_zip}
                onChange={(e) => handleInputChange('shipping_zip', e.target.value)}
              />
            </Grid>

            {/* Order Details */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', borderBottom: `1px solid ${theme.palette.primary.light}`, pb: 1 }}>
                Order Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Financial Status</InputLabel>
                <Select
                  value={orderFormData.financial_status}
                  onChange={handleFinancialStatusChange}
                  label="Financial Status"
                >
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {orderFormData.financial_status === "pending" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Partial Payment Amount"
                  value={orderFormData.partial_payment_amount}
                  onChange={(e) => handleInputChange('partial_payment_amount', e.target.value)}
                  helperText="Optional: Enter amount if customer pays partial amount"
                  inputProps={{ step: "0.01" }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Order Note"
                value={orderFormData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="Add a note to the order (optional)"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={() => {
            setShowPlaceOrderModal(false)
          }}
          disabled={placeOrderLoading}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePlaceOrder}
          disabled={placeOrderLoading}
          variant="contained"
          startIcon={placeOrderLoading ? <CircularProgress size={20} /> : <ShoppingCart />}
          sx={{ minWidth: 140 }}
        >
          {placeOrderLoading ? 'Placing...' : 'Place Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CartModal = ({ 
  showCartModal, 
  setShowCartModal, 
  cartItems, 
  onRemoveItem,
  onCheckout,
  currency,
  checkoutLoading
}: {
  showCartModal: boolean
  setShowCartModal: (show: boolean) => void
  cartItems: CartItem[]
  onRemoveItem: (shopify_id: string | number) => void
  onCheckout: () => void
  currency: string
  checkoutLoading: boolean
}) => {
  const theme = useTheme()
  const totalPrice = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0)

  function cleanNumber(value: string) {
  return value.toString().replace(/\.00$/, "");
}


  return (
    <Dialog
      open={showCartModal}
      onClose={() => !checkoutLoading && setShowCartModal(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10],
        }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          py: 2,
        }}
      >
        <ShoppingCart />
        <Typography variant="h6" component="span" fontWeight="bold">
          Your Cart ({cartItems.length} items)
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Button
          onClick={() => setShowCartModal(false)}
          disabled={checkoutLoading}
          sx={{
            minWidth: 'auto',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <ShoppingCart sx={{ width: 60, height: 60, color: 'text.disabled', mb: 2, mx: 'auto' }} />
            <Typography color="text.secondary">Your cart is empty</Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
              Items in your cart:
            </Typography>
            <Box sx={{ 
              maxHeight: '400px', 
              overflowY: 'auto',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
            }}>
              {cartItems.map((item, index) => (
                <Box 
                  key={`${item.shopify_id}-${index}`}
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: index < cartItems.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.product_title} - {item.qty}x
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Variant: {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: 'primary.main', fontWeight: 600 }}>
                      {currency}{parseFloat(cleanNumber(item.price))}
                    </Typography>
                  </Box>
                  <Button
                    onClick={() => onRemoveItem(item.shopify_id)}
                    size="small"
                    variant="outlined"
                    color="error"
                    disabled={checkoutLoading}
                    sx={{ ml: 2 }}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>
            
            <Box sx={{ 
              mt: 3, 
              pt: 2, 
              borderTop: `2px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Total:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {currency}{cleanNumber(totalPrice.toString())}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={() => setShowCartModal(false)}
          disabled={checkoutLoading}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Continue Shopping
        </Button>
        <Button
          onClick={onCheckout}
          disabled={checkoutLoading || cartItems.length === 0}
          variant="contained"
          startIcon={checkoutLoading ? <CircularProgress size={20} /> : <ShoppingCart />}
          sx={{ minWidth: 140 }}
        >
          {checkoutLoading ? 'Processing...' : 'Place Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function CatalogueProductList() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [businesses, setBusinesses] = useState<WhatsAppData[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<WhatsAppData | null>(null)
  const [businessCategory, setBusinessCategory] = useState<"Shopify-Ecommerce" | "Food" | null>(null)
  const [currency, setCurrency] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Food menu states with pagination
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [menuCurrentPage, setMenuCurrentPage] = useState(1)
  const [menuTotalCount, setMenuTotalCount] = useState(0)
  const [menuHasNextPage, setMenuHasNextPage] = useState(false)
  const [menuHasPreviousPage, setMenuHasPreviousPage] = useState(false)
  const [menuTotalPages, setMenuTotalPages] = useState(0)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "FAST_FOOD" as MenuItem["category"],
    image_link: "",
    available: true,
  })

  // Shopify-Ecommerce
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [BUSINESS_ID,setBusinessData] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Shopify states
  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState<string>('')
  const [selectedId, setSelectedId] = useState<number>(0)

  const [showPlaceOrderModal, setShowPlaceOrderModal] = useState(false)
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false)
  const [selectedProductVariant, setSelectedProductVariant] = useState<any>(null)
  const [orderFormData, setOrderFormData] = useState<OrderFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    shipping_address1: "",
    shipping_city: "",
    shipping_country: "",
    financial_status: "paid",
    partial_payment_amount: "0",
    shipping_zip:"",
    note: "",
    variant_id: "",
    quantity: "1",
  })

  const [cart, setCart] = useState<CartItem[]>([])
  const [showCartModal, setShowCartModal] = useState(false)

  // Items per page state
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  // Search debouncing - REMOVED
  // const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const fetchWhatsAppFeed = useCallback(async () => {
    try {
      const response = await GetWhatsApp();
      const data = response?.data?.results || [];

      const filteredData = data.filter(
        (item: any) =>
          item.category === "Food" || item.category === "Shopify-Ecommerce"
      );

      setBusinesses(filteredData);

      if (filteredData.length > 0) {
        console.log("GetWhatsApp Filtered:", filteredData);
        setSelectedBusiness(filteredData[0]);
        setBusinessCategory(filteredData[0].category);

        if (filteredData[0].category === "Food") {
          fetchMenuItems(BUSINESS_ID, 1);
        } else {
          fetchProducts(currentPage, '');
        }
      }
    } catch (error: any) {
      console.log(error);
      setError("Failed to fetch WhatsApp phone numbers.");
    }
  }, [currentPage, BUSINESS_ID]);

  const fetchBusinessData = useCallback(async () => {
    try {
      const data: any = await getAllBusiness(undefined)
      console.log('fetchBusinessData', data.data.results[0].business_id)
      if(data.data.results[0]){
        setBusinessData(data.data.results[0].business_id)
        setCurrency(data.data.results[0].currency.symbol)
      }
    } catch (err: any) {
      console.error("Error fetching business data:", err)
    }
  }, [])

  const fetchMenuItems = useCallback(async (businessId: string, page: number = 1) => {
    try {
      setLoading(true)
      const authToken = localStorage.getItem("auth_token")
      if (!authToken) {
        router.push("/en/login/")
        return
      }

      const response = await fetch(`${getBaseUrl()}products/menu/?business=${businessId}&page=${page}&page_size=${itemsPerPage}`, {
        headers: { Authorization: `Token ${authToken}` },
      })

      if (response.status === 401) {
        router.push("/en/login/")
        return
      }

      const data: MenuPaginatedResponse = await response.json()
      setMenuItems(data.results || [])
      setMenuTotalCount(data.count)
      setMenuHasNextPage(!!data.next)
      setMenuHasPreviousPage(!!data.previous)
      setMenuTotalPages(Math.ceil(data.count / itemsPerPage))
    } catch (err: any) {
      console.error("Error fetching menu items:", err)
      setError("Failed to fetch menu items")
    } finally {
      setLoading(false)
    }
  }, [router, itemsPerPage])

  // Updated fetchProducts function with search
  const fetchProducts = async (page: number, search: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('BUSINESS_ID', BUSINESS_ID)
      console.log('page', page)
      console.log('search', search)
      
      const response: PaginatedResponse = await getAllMenuesByBusinessId(BUSINESS_ID, page, itemsPerPage, search);
      console.log('response PaginatedResponse fetchProducts', response)
      
      setProducts(response.results);
      setTotalCount(response.count);
      setHasNextPage(!!response.next);
      setHasPreviousPage(!!response.previous);
    } catch (error) {
      console.error('Error fetching products:', error);
      setHasNextPage(false);
      setHasPreviousPage(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debouncing - REMOVED
  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setSearchTerm(value);

  //   // Clear previous timeout
  //   if (searchTimeout) {
  //     clearTimeout(searchTimeout);
  //   }

  //   // Set new timeout for debouncing (500ms)
  //   const newTimeout = setTimeout(() => {
  //     setCurrentPage(1); // Reset to first page when searching
  //     fetchProducts(1, value);
  //   }, 500);

  //   setSearchTimeout(newTimeout);
  // };

  // Now just updates searchTerm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts(1, searchTerm);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchProducts(1, '');
    searchInputRef.current?.focus();
  };

  const toggleAvailability = async (id: number, currentStatus: boolean) => {
    try {
      setLoading(true)
      const authToken = localStorage.getItem("auth_token")
      if (!authToken) {
        router.push("/en/login/")
        return
      }

      const itemToUpdate = menuItems.find(item => item.id === id)
      if (!itemToUpdate) return

      const payload = {
        ...itemToUpdate,
        available: !currentStatus
      }

      const response = await fetch(`${getBaseUrl()}products/menu/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.status === 401) {
        router.push("/en/login/")
        return
      }

      if (response.ok) {
        toast.success(`Item ${!currentStatus ? 'activated' : 'deactivated'}`)
        if (selectedBusiness) {
          fetchMenuItems(selectedBusiness.business_id, menuCurrentPage)
        }
      } else {
        toast.error("Failed to update item availability")
      }
    } catch (err: any) {
      console.error("Error updating availability:", err)
      toast.error("Error updating availability")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (variant: any, product: any, qty: number) => {
    const cartItem: CartItem = {
      shopify_id: variant.shopify_id,
      title: variant.title,
      price: variant.price,
      product_title: product.title,
      product_id: product.id,
      qty: qty
    }
    
    setCart([...cart, cartItem])
    toast.success('Item added to cart!')
  }

  const handleRemoveFromCart = (shopify_id: string | number) => {
    setCart(cart.filter(item => item.shopify_id !== shopify_id))
    toast.success('Item removed from cart')
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    
    setShowCartModal(false)
    // Set first item as selected and show order modal
    setSelectedProductVariant({ 
      variants: cart.map(item => ({
        shopify_id: item.shopify_id,
        title: `${item.product_title} - ${item.title}`,
        price: item.price,
        qty: item.qty // Placeholder
      }))
    })
    setOrderFormData(prev => ({
      ...prev,
      variant_id: '',
      // quantity: '1'
    }))
    setShowPlaceOrderModal(true)
  }

  const handlePlaceOrder = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setPlaceOrderLoading(true)
      const authToken = localStorage.getItem("auth_token")
      if (!authToken) {
        router.push("/en/login/")
        return
      }

      let lineItems: any = []
      
      if (cart.length > 0) {
        // Checkout from cart - include all items with their actual quantities
        lineItems = cart.map(item => ({
          variant_id: parseInt(item.shopify_id.toString()),
          quantity: item.qty  // Use item.qty instead of hardcoded 1
        }))
      } else if (orderFormData.variant_id) {
        // Checkout from single product selection
        lineItems = [
          {
            variant_id: parseInt(orderFormData.variant_id),
            quantity: parseInt(orderFormData.quantity) || 1
          }
        ]
      }

      if (!lineItems.length) {
        toast.error("Please select a product variant")
        setPlaceOrderLoading(false)
        return
      }

      const payload: any = {
        line_items: lineItems,
        customer: {
          first_name: orderFormData.first_name,
          last_name: orderFormData.last_name,
          email: orderFormData.email,
          phone: orderFormData.phone,
        },
        email: orderFormData.email,
        shipping_address: {
          first_name: orderFormData.first_name,
          last_name: orderFormData.last_name,
          address1: orderFormData.shipping_address1,
          city: orderFormData.shipping_city,
          country: orderFormData.shipping_country,
          zip: orderFormData.shipping_zip,
          phone: orderFormData.phone,
        },
        financial_status: orderFormData.financial_status,
        note: orderFormData.note,
        metafields: [
          {
            "namespace": "payment",
            "key": "partial_payment_amount",
            "type": "number_integer",
            "value": Number(orderFormData.partial_payment_amount) || 0
          }
        ]
      }

      
      const response = await fetch(`${getBaseUrl()}products/place-shopify-order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.status === 401) {
        router.push("/en/login/")
        return
      }

      if (response.ok) {
        toast.success("Order placed successfully!")
        setShowPlaceOrderModal(false)
        setCart([]) // Clear cart after successful order
        setOrderFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          shipping_address1: "",
          shipping_city: "",
          shipping_country: "",
          shipping_zip: "",
          financial_status: "paid",
          partial_payment_amount: "",
          note: "",
          variant_id: "",
          quantity: "1",
        })
        setSelectedProductVariant(null)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to place order")
      }
    } catch (err: any) {
      console.error("Error placing order:", err)
      toast.error("Error placing order")
    } finally {
      setPlaceOrderLoading(false)
    }
  }, [orderFormData, cart, router])

  useEffect(() => {
    fetchBusinessData()
  }, [fetchBusinessData])

  useEffect(() => {
    if (BUSINESS_ID) {
      fetchWhatsAppFeed()
    }
  }, [BUSINESS_ID, fetchWhatsAppFeed])

  useEffect(() => {
    if (BUSINESS_ID && businessCategory === "Shopify-Ecommerce") {
      fetchProducts(currentPage, searchTerm);
    }
  }, [currentPage, BUSINESS_ID, businessCategory]);

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleMenuNextPage = () => {
    if (menuHasNextPage && selectedBusiness) {
      setMenuCurrentPage(prev => prev + 1);
      fetchMenuItems(selectedBusiness.business_id, menuCurrentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMenuPreviousPage = () => {
    if (menuHasPreviousPage && selectedBusiness) {
      setMenuCurrentPage(prev => prev - 1);
      fetchMenuItems(selectedBusiness.business_id, menuCurrentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMenuPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setMenuCurrentPage(value);
    if (selectedBusiness) {
      fetchMenuItems(selectedBusiness.business_id, value);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setMenuCurrentPage(1);
    
    if (businessCategory === "Food" && selectedBusiness) {
      fetchMenuItems(selectedBusiness.business_id, 1);
    } else if (businessCategory === "Shopify-Ecommerce") {
      fetchProducts(1, searchTerm);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedBusiness) {
      toast.error("Please select a business first")
      return
    }

    try {
      setLoading(true)
      const authToken = localStorage.getItem("auth_token")
      if (!authToken) {
        router.push("/en/login/")
        return
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        image_link: formData.image_link,
        business: selectedBusiness.business_id,
      }

      let response
      if (editingId) {
        response = await fetch(`${getBaseUrl()}products/menu/${editingId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch(`${getBaseUrl()}products/menu/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
          body: JSON.stringify(payload),
        })
      }

      if (response.status === 401) {
        router.push("/en/login/")
        return
      }

      if (response.ok) {
        toast.success(editingId ? "Menu item updated" : "Menu item created")
        setFormData({ 
          name: "", 
          description: "", 
          price: "", 
          category: "FAST_FOOD", 
          image_link: "",
          available: true 
        })
        setEditingId(null)
        setShowForm(false)
        if (selectedBusiness) {
          fetchMenuItems(selectedBusiness.business_id, menuCurrentPage)
        }
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to save menu item")
      }
    } catch (err: any) {
      console.error("Error saving menu item:", err)
      toast.error("Error saving menu item")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      setLoading(true)
      const authToken = localStorage.getItem("auth_token")
      if (!authToken) {
        router.push("/en/login/")
        return
      }

      const response = await fetch(`${getBaseUrl()}products/menu/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${authToken}` },
      })

      if (response.status === 401) {
        router.push("/en/login/")
        return
      }

      if (response.ok) {
        toast.success("Menu item deleted")
        if (selectedBusiness) {
          fetchMenuItems(selectedBusiness.business_id, menuCurrentPage)
        }
      } else {
        toast.error("Failed to delete menu item")
      }
    } catch (err: any) {
      console.error("Error deleting menu item:", err)
      toast.error("Error deleting menu item")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_link: item.image_link,
      available: item.available,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setFormData({ 
      name: "", 
      description: "", 
      price: "", 
      category: "FAST_FOOD", 
      image_link: "",
      available: true 
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleCategoryChange = (e: any) => {
    const value = e.target.value;
    setBusinessCategory(value);
    console.log("Selected category:", value);
    
    setMenuItems([])
    setProducts([])
    setShowForm(false)
    setEditingId(null)
    setMenuCurrentPage(1)
    setCurrentPage(1)
    setSearchTerm('')
    
    if (value === "Food") {
      fetchMenuItems(BUSINESS_ID, 1)
    } else {
      fetchProducts(1, '')
    }
  };

  const refresh = () => {
    if (businessCategory === "Food") {
      fetchMenuItems(BUSINESS_ID, menuCurrentPage)
    } else {
      fetchProducts(currentPage, searchTerm)
    }
  };

  const activate_shopify_product= async (id: number) => {
    try {
      setLoading(true)
      const authToken = localStorage.getItem("auth_token")
      if (!authToken) {
        router.push("/en/login/")
        return
      }

      const response = await fetch(`${getBaseUrl()}products/shopify/${id}/activate/`, {
        method: "POST",
        headers: { Authorization: `Token ${authToken}` },
      })
      console.log('response;',response)

      if (response.status === 401) {
        router.push("/en/login/")
        return
      }

      if (response.ok) {
        toast.success("Product Activated")
        if (selectedBusiness) {
          fetchProducts(currentPage, searchTerm)
        }
      } else {
        toast.error("Failed to activate product")
      }
    } catch (err: any) {
      console.error("Error activating product:", err)
      toast.error("Error activating product")
    } finally {
      setLoading(false)
    }
  }

  const deactivate_shopify_product = async (id: number) => {
    try {
      setLoading(true)
      const authToken = localStorage.getItem("auth_token")
      if (!authToken) {
        router.push("/en/login/")
        return
      }

      const response = await fetch(`${getBaseUrl()}products/shopify/${id}/deactivate/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${authToken}` },
      })

      if (response.status === 401) {
        router.push("/en/login/")
        return
      }

      if (response.ok) {
        toast.success("Product Deactivated")
        if (selectedBusiness) {
          fetchProducts(currentPage, searchTerm)
        }
      } else {
        toast.error("Failed to deactivate product")
      }
    } catch (err: any) {
      console.error("Error deactivating product:", err)
      toast.error("Error deactivating product")
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrderFromProduct = (product: any) => {
    setSelectedProductVariant(product)
    setOrderFormData(prev => ({
      ...prev,
      variant_id: "",
      quantity: "1"
    }))
    setShowPlaceOrderModal(true)
  }

  // Business selector component
  const BusinessSelector = () => (
    <>
     <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() =>{
          if(selectedId!=null && modalAction == 'delete'){
            handleDelete(selectedId)
          }
          else if(selectedId!=null && modalAction == 'Activate' || modalAction == 'Deactivate'){
            if (modalAction == 'Activate'){
              toggleAvailability(selectedId, true)
            }else{
              toggleAvailability(selectedId, false)
            }
          }
          else if(modalAction == 'Meta'){
            if(businessCategory == 'Food'){
              syncMenuData(BUSINESS_ID,businessCategory)
              }
            else if(businessCategory == 'Shopify-Ecommerce'){
                syncMenuData(BUSINESS_ID,businessCategory)
              }
          }
          else if(modalAction == 'Product-Deactivate'){
             deactivate_shopify_product(selectedId).finally(()=>{
               fetchProducts(currentPage, searchTerm)
              })
          }
          else if(modalAction == 'Product-Activate'){
             activate_shopify_product(selectedId).finally(()=>{
               fetchProducts(currentPage, searchTerm)
              })
             
          }else if(modalAction == 'Meta-Clear'){
            if (businessCategory == 'Shopify-Ecommerce' || businessCategory == 'Food'){
                syncMenuData(BUSINESS_ID,businessCategory,'Meta-Clear')
            }
            
          }
        }}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action? This cannot be undone."
      />
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              color="primary"
              fontWeight="bold"
            >
              {businessCategory === "Food" ? 'Food Catalog' : 'Product Catalog'}
            </Typography>
          }
          
          action={
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <select
                value={businessCategory || ""}
                onChange={handleCategoryChange}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "0.9rem",
                  background: "#fff",
                  color: "#333",
                }}
              >
                {businesses && businesses.map((cat, index) => (
                  <option key={index} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>

              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={refresh}
                disabled={loading}
              >
                Refresh
              </Button>

              {/* {businessCategory == 'Shopify-Ecommerce' &&
                <Button
                  variant="outlined"
                  startIcon={<Sync />}
                  onClick={() => {
                    setIsModalOpen(true)
                    setModalAction('Meta')
                    }}
                  disabled={loading}
                  color="secondary"
                >
                  Sync All Products To Meta
                </Button>
              }

              {businessCategory == 'Shopify-Ecommerce' &&
                <Button
                  variant="outlined"
                  startIcon={<Sync />}
                  onClick={() => {
                    setIsModalOpen(true)
                    setModalAction('Meta-Clear')
                    }}
                  disabled={loading}
                  color="secondary"
                >
                  Clear Meta Catalogue
                </Button>
              } */}
            </Box>
          }
          avatar={
            <Search sx={{ width: 40, height: 40, color: "primary.main" }} />
          }
        />
      </Card>
    </>
  );

  // Items per page selector component
  const ItemsPerPageSelector = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Items per page:
      </Typography>
      <FormControl size="small" sx={{ minWidth: 80 }}>
        <Select
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          displayEmpty
        >
          {ITEMS_PER_PAGE_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Render Food Menu UI
  if (businessCategory === "Food") {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Business Selector */}
          <BusinessSelector />

          {/* Items Per Page Selector */}
          <ItemsPerPageSelector />

          {/* Menu Pagination Info */}
          {(menuHasNextPage || menuHasPreviousPage) && (
            <Card sx={{ mb: 3 }}>
              <Box sx={{ p: 2 }}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      Page {menuCurrentPage} • Showing {menuItems.length} of {menuTotalCount} menu items
                    </Typography>
                  </Grid>
                  
                  <Grid item>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        onClick={handleMenuPreviousPage}
                        disabled={!menuHasPreviousPage}
                        startIcon={<ChevronLeft />}
                        variant="outlined"
                        size="small"
                      >
                        Previous
                      </Button>

                      <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                        Page {menuCurrentPage}
                      </Typography>

                      <Button
                        onClick={handleMenuNextPage}
                        disabled={!menuHasNextPage}
                        endIcon={<ChevronRight />}
                        variant="outlined"
                        size="small"
                      >
                        Next
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          )}

          {/* Add Button */}
          <div className="mb-6">
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
              >
                + Add Menu Item
              </button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {editingId ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Item Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Burger"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Price ({currency}) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as MenuItem["category"] })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {MENU_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Image Link */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
                    <input
                      type="url"
                      value={formData.image_link}
                      onChange={(e) => setFormData({ ...formData, image_link: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Item description..."
                    rows={3}
                  />
                </div>

               
                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
                  >
                    {editingId ? "Update Item" : "Add Item"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Menu Items Grid */}
          {menuItems.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground text-lg">No menu items yet. Add your first item!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                      !item.available ? "opacity-60 border-destructive/30" : "border-border"
                    }`}
                  >
                    {/* Image */}
                    {item.image_link && (
                      <div className="w-full h-48 bg-muted overflow-hidden">
                        <img
                          src={item.image_link || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/diverse-food-spread.png"
                          }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                        <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                          {MENU_CATEGORIES.find((c) => c.value === item.category)?.label}
                        </span>
                      </div>

                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>

                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold text-primary">
                          {currency}
                          {item.price}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex-1 px-3 py-2  cursor-pointer bg-primary/10 text-primary rounded hover:bg-primary/20 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>{ 
                            setSelectedId(item.id)
                            if(item.available == true){
                              setModalAction('Activate')
                            }else{
                              setModalAction('Deactivate')
                            }
                            setIsModalOpen(true)
                            }}
                          className={`flex-1 px-3 py-2 rounded cursor-pointer font-medium text-sm ${
                            item.available
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }`}
                        >
                          {item.available ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={()=>{
                            setSelectedId(item.id)
                            setModalAction("delete")
                            setIsModalOpen(true)
                          }}
                          className="flex-1 px-3 py-2  cursor-pointer bg-destructive/10 text-destructive rounded hover:bg-destructive/20 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Pagination Controls for Menu */}
              {menuTotalPages > 1 && (
                <Card sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <Pagination
                      count={menuTotalPages}
                      page={menuCurrentPage}
                      onChange={handleMenuPageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                      siblingCount={isMobile ? 0 : 1}
                    />
                  </Box>
                  
                  {/* Additional navigation buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button
                      onClick={handleMenuPreviousPage}
                      disabled={!menuHasPreviousPage}
                      startIcon={<ChevronLeft />}
                      variant="outlined"
                    >
                      Previous Page
                    </Button>
                    
                    <Button
                      onClick={handleMenuNextPage}
                      disabled={!menuHasNextPage}
                      endIcon={<ChevronRight />}
                      variant="outlined"
                    >
                      Next Page
                    </Button>
                  </Box>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  // Render Shopify Ecommerce UI
  if (businessCategory == "Shopify-Ecommerce") {
    return (
      <>
        <CartModal
          showCartModal={showCartModal}
          setShowCartModal={setShowCartModal}
          cartItems={cart}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={handleCheckout}
          currency={currency}
          checkoutLoading={placeOrderLoading}
        />

        {/* Place Order Modal */}
        <PlaceOrderModal
          showPlaceOrderModal={showPlaceOrderModal}
          setShowPlaceOrderModal={setShowPlaceOrderModal}
          placeOrderLoading={placeOrderLoading}
          selectedProductVariant={selectedProductVariant}
          orderFormData={orderFormData}
          setOrderFormData={setOrderFormData}
          currency={currency}
          handlePlaceOrder={handlePlaceOrder}
        />
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            p: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <BusinessSelector />
              {businessCategory === "Shopify-Ecommerce" && (
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={() => setShowCartModal(true)}
                  sx={{ minWidth: 150 }}
                >
                  Cart ({cart.length})
                </Button>
              )}
              </Box>
            </Box>

            {/* Search Bar for Shopify-Ecommerce */}
            {businessCategory === "Shopify-Ecommerce" && (
              <Card sx={{ mb: 3 }}>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center'}}>
                    <TextField
                      ref={searchInputRef}
                      fullWidth
                      variant="outlined"
                      placeholder="Search products by title..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          height:'40px' 
                        }
                      }}
                      // Add onKeyDown to trigger search on Enter key press
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      sx={{ minWidth: 120 }}
                    >
                      Search
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleClearSearch}
                      sx={{ minWidth: 120 }}
                    >
                      Reset
                    </Button>
                  </Box>
                </Box>
              </Card>
            )}

            {/* Items Per Page Selector */}
            <ItemsPerPageSelector />

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Pagination Info */}
            {(hasNextPage || hasPreviousPage) && (
              <Card sx={{ mb: 3 }}>
                <Box sx={{ p: 2 }}>
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm ? (
                          <>Search results for &quot;{searchTerm}&quot; • Page {currentPage} • Showing {products.length} of {totalCount} products</>
                        ) : (
                          <>Page {currentPage} • Showing {products.length} of {totalCount} products</>
                        )}
                      </Typography>
                    </Grid>
                    
                    <Grid item>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                          onClick={handlePreviousPage}
                          disabled={!hasPreviousPage}
                          startIcon={<ChevronLeft />}
                          variant="outlined"
                          size="small"
                        >
                          Previous
                        </Button>

                        <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                          Page {currentPage}
                        </Typography>

                        <Button
                          onClick={handleNextPage}
                          disabled={!hasNextPage}
                          endIcon={<ChevronRight />}
                          variant="outlined"
                          size="small"
                        >
                          Next
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            )}

            {/* Products Grid */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
                <CircularProgress size={60} />
              </Box>
            ) : products.length === 0 ? (
              <Card>
                <Box sx={{ textAlign: 'center', py: 10 }}>
                  <Search sx={{ width: 64, height: 64, color: 'text.disabled', mb: 2, mx: 'auto' }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {searchTerm ? `No products found for "${searchTerm}"` : 'No products found'}
                  </Typography>
                  {searchTerm && (
                    <Button 
                      variant="text" 
                      onClick={handleClearSearch}
                      sx={{ mt: 1 }}
                    >
                      Clear search
                    </Button>
                  )}
                  {(hasNextPage || hasPreviousPage) && !searchTerm && (
                    <Typography variant="body2" color="text.secondary">
                      Try checking other pages
                    </Typography>
                  )}
                </Box>
              </Card>
            ) : (
              <>
                {/* Results count when no pagination controls are shown */}
                {!(hasNextPage || hasPreviousPage) && (
                  <Card sx={{ mb: 3 }}>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm ? (
                          <>Showing {products.length} product{products.length !== 1 ? 's' : ''} matching &quot;{searchTerm}&quot;</>
                        ) : (
                          <>Showing {products.length} product{products.length !== 1 ? 's' : ''}</>
                        )}
                      </Typography>
                    </Box>
                  </Card>
                )}

                <Grid container spacing={3}>
                  {products.map((product:any) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <ProductCard 
                        product={product} 
                        currency={currency} 
                        setIsModalOpen={setIsModalOpen} 
                        setModalAction={setModalAction} 
                        setSelectedId={setSelectedId}
                        onAddToCart={handleAddToCart} // Pass the add to cart handler
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Bottom Pagination Controls */}
                {totalPages > 1 && (
                  <Card sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                        siblingCount={isMobile ? 0 : 1}
                      />
                    </Box>
                    
                    {/* Additional navigation buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, pb: 2 }}>
                      <Button
                        onClick={handlePreviousPage}
                        disabled={!hasPreviousPage}
                        startIcon={<ChevronLeft />}
                        variant="outlined"
                      >
                        Previous Page
                      </Button>
                      
                      <Button
                        onClick={handleNextPage}
                        disabled={!hasNextPage}
                        endIcon={<ChevronRight />}
                        variant="outlined"
                      >
                        Next Page
                      </Button>
                    </Box>
                  </Card>
                )}
              </>
            )}
          </Container>
        </Box>
      </>
    )
  }

  return null;
}

export default CatalogueProductList
