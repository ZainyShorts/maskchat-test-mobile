// 'use client'

// // React Imports
// import { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'

// // MUI Imports
// import Grid from '@mui/material/Grid'
// import Dialog from '@mui/material/Dialog'
// import Button from '@mui/material/Button'
// import DialogTitle from '@mui/material/DialogTitle'
// import DialogContent from '@mui/material/DialogContent'
// import DialogActions from '@mui/material/DialogActions'
// import MenuItem from '@mui/material/MenuItem'
// import Typography from '@mui/material/Typography'

// // Component Imports
// import DialogCloseButton from '../DialogCloseButton'
// import CustomTextField from '@core/components/mui/TextField'
// import { MenuDataType } from '@/api/interface/menuIterface'
// import toast, { Toaster } from 'react-hot-toast'
// import { useRouter } from 'next/navigation'

// import OpenDialogOnElementClick from '../OpenDialogOnElementClick'
// import type { ButtonProps } from '@mui/material/Button'
// import type { ThemeColor } from '@core/types'
// import Loader from '@/components/loader/Loader'
// import type { User } from '@/api/interface/userInterface'
// import { createUser, getUserTypes } from '@/api/user'
// import { InputAdornment } from '@mui/material'
// import IconButton from '@mui/material/IconButton'
// import { getAllBusiness } from '@/api/business'
// import { ResturantDataType } from '@/api/interface/resturantInterface'
// import { BusinessType } from '@/types/apps/businessTypes'
// import { createResturant } from '@/api/resturant'

// type AddOutletFormProps = {
//   open: boolean
//   setOpen: (open: boolean) => void
//   data?: MenuDataType
//   onTypeAdded?: any
// }

// const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
//   children,
//   color,
//   variant
// })

// const AddOutletForm = ({ open, setOpen, onTypeAdded }: AddOutletFormProps) => {
//   const router = useRouter()

//   const [loading, setLoading] = useState<boolean>(false)
//   const [businessData, setBusinessData] = useState<BusinessType[]>([])

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     control
//   } = useForm<ResturantDataType>()

//   // States
//   const onSubmit = (data: ResturantDataType, e: any) => {
//     e.preventDefault()

//     setLoading(true)

//     createResturant(data)
//       .then(res => {
//         console.log(res, 'register restorant')
//         toast.success('Outlet registerd successfully', {
//           duration: 5000 // Duration in milliseconds (5 seconds)
//         })
//         if (onTypeAdded) {
//           onTypeAdded()
//         }

//         setOpen(false)
//         reset()
//       })
//       .catch(error => {
//         console.log(error, 'error in register resto')
//         toast.error(error?.data?.detail, {
//           duration: 5000 // Duration in milliseconds (5 seconds)
//         })
//       })
//       .finally(() => {
//         setLoading(false)
//         reset()
//       })
//   }

//   const handleReset = () => {
//     setOpen(false)
//     reset()
//   }

//   useEffect(() => {
//     const fetchBusiness = async () => {
//       try {
//         const response = await getAllBusiness()

//         setBusinessData(response?.data?.results || [])
//       } catch (err: any) {
//         // setError(err.message || 'Failed to fetch users')
//       } finally {
//         // setLoading(false)
//       }
//     }

//     fetchBusiness()
//   }, [])

//   return (
//     <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
//       <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
//         <i className='tabler-x' />
//       </DialogCloseButton>

//       <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
//         Add Outlet Information
//       </DialogTitle>
//       <div>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
//             <Grid container spacing={5} alignItems='center'>
//               <Grid item xs={12} sm={6}>
//                 <CustomTextField
//                   label='Name *'
//                   fullWidth
//                   placeholder='Enter Resturant Name'
//                   {...register('name', { required: 'Name is required' })}
//                   error={!!errors.name}
//                   helperText={errors.name?.message}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <CustomTextField
//                   label='Postal Code Delivery *'
//                   fullWidth
//                   placeholder='Enter Postalcode Delivery'
//                   {...register('postal_code_delivery', { required: 'Postal Code Delivery is required' })}
//                   error={!!errors.postal_code_delivery}
//                   helperText={errors.postal_code_delivery?.message}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <CustomTextField
//                   label='City *'
//                   fullWidth
//                   placeholder='Enter City Name'
//                   {...register('city', { required: 'city is required' })}
//                   error={!!errors.city}
//                   helperText={errors.city?.message}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <CustomTextField
//                   label='Cuisine Type *'
//                   fullWidth
//                   placeholder='Enter Cuisine Type'
//                   {...register('cuisine_type', { required: 'Cuisine Type is required' })}
//                   error={!!errors.cuisine_type}
//                   helperText={errors.cuisine_type?.message}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <CustomTextField
//                   label='Contact number *'
//                   type='number'
//                   fullWidth
//                   placeholder='(397) 294-5153'
//                   {...register('contact_number', { required: 'Contact number is required' })}
//                   error={!!errors.contact_number}
//                   helperText={errors.contact_number?.message}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <CustomTextField
//                   label='Description *'
//                   fullWidth
//                   placeholder='Enter description'
//                   {...register('description', { required: 'Description is required' })}
//                   error={!!errors.description}
//                   helperText={errors.description?.message}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <CustomTextField
//                   label='Catalog link *'
//                   fullWidth
//                   placeholder='Enter Catalog Link'
//                   {...register('catalog_link', { required: 'Catalog Link is required' })}
//                   error={!!errors.catalog_link}
//                   helperText={errors.catalog_link?.message}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <CustomTextField
//                   select
//                   fullWidth
//                   id='business'
//                   label='Select Business *'
//                   inputProps={{ placeholder: 'Select Business', ...register('business') }}
//                   error={!!errors.business}
//                   helperText={errors.business?.message}
//                 >
//                   {businessData &&
//                     businessData?.map(business => (
//                       <MenuItem key={business.business_id} value={business.id}>
//                         {business.business_id}
//                       </MenuItem>
//                     ))}
//                 </CustomTextField>
//               </Grid>
//             </Grid>
//             <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16 mt-5'>
//               <Button variant='contained' type='submit' disabled={loading}>
//                 Submit
//               </Button>
//               <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
//                 Cancel
//               </Button>
//             </DialogActions>

//             {loading && <Loader />}
//           </DialogContent>
//         </form>

//         <Toaster />
//       </div>
//     </Dialog>
//   )
// }

// export default AddOutletForm

"use client"

// React Imports
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

// MUI Imports
import Grid from "@mui/material/Grid"
import Dialog from "@mui/material/Dialog"
import Button from "@mui/material/Button"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import MenuItem from "@mui/material/MenuItem"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"

// Component Imports
import type { MenuDataType } from "@/api/interface/menuIterface"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"
import type { ButtonProps } from "@mui/material/Button"
import type { ThemeColor } from "@core/types"
import Loader from "../../../components/loader/LoaderRing"
import { getAllBusiness } from "@/api/business"
import type { ResturantDataType } from "@/api/interface/resturantInterface"
import type { BusinessType } from "@/types/apps/businessTypes"
import { createResturant } from "@/api/resturant"

type AddOutletFormProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: MenuDataType
  onTypeAdded?: any
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps["variant"]): ButtonProps => ({
  children,
  color,
  variant,
})

const AddOutletForm = ({ open, setOpen, onTypeAdded }: AddOutletFormProps) => {
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(false)
  const [businessData, setBusinessData] = useState<BusinessType[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResturantDataType>()

  // Submit Handler
  const onSubmit = (data: ResturantDataType, e: any) => {
    e.preventDefault()
    setLoading(true)

    createResturant(data)
      .then((res) => {
        toast.success("Outlet registered successfully", { duration: 5000 })
        if (onTypeAdded) onTypeAdded()
        setOpen(false)
        reset()
      })
      .catch((error) => {
        toast.error(error?.data?.detail || "Failed to register", { duration: 5000 })
      })
      .finally(() => {
        setLoading(false)
        reset()
      })
  }

  const handleReset = () => {
    setOpen(false)
    reset()
  }

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()
        setBusinessData(response?.data?.results || [])
      } catch {}
    }
    fetchBusiness()
  }, [])

  return (
    <Dialog fullWidth open={open} maxWidth="md" scroll="body" sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}>
      <IconButton
        onClick={() => setOpen(false)}
        sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle variant="h4" className="flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16">
        Add Outlet Information
      </DialogTitle>

      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className="overflow-visible pbs-0 sm:pli-16">
            <Grid container spacing={5} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name *"
                  fullWidth
                  placeholder="Enter Restaurant Name"
                  {...register("name", { required: "Name is required" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Postal Code Delivery *"
                  fullWidth
                  placeholder="Enter Postalcode Delivery"
                  {...register("postal_code_delivery", { required: "Postal Code Delivery is required" })}
                  error={!!errors.postal_code_delivery}
                  helperText={errors.postal_code_delivery?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City *"
                  fullWidth
                  placeholder="Enter City Name"
                  {...register("city", { required: "city is required" })}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contact number *"
                  type="number"
                  fullWidth
                  placeholder="(397) 294-5153"
                  {...register("contact_number", { required: "Contact number is required" })}
                  error={!!errors.contact_number}
                  helperText={errors.contact_number?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Description *"
                  fullWidth
                  placeholder="Enter description"
                  {...register("description", { required: "Description is required" })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Google Map*"
                  fullWidth
                  placeholder="Enter Google Map Location Link"
                  {...register("catalog_link", { required: "Google Map Location Link is required" })}
                  error={!!errors.catalog_link}
                  helperText={errors.catalog_link?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Delivery Radius (km) *"
                  type="number"
                  fullWidth
                  placeholder="Enter delivery radius in kilometers"
                  {...register("deliveryRadius", {
                    required: "Delivery radius is required",
                    min: { value: 0, message: "Delivery radius cannot be negative" },
                  })}
                  error={!!errors.deliveryRadius}
                  helperText={errors.deliveryRadius?.message}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox {...register("active")} defaultChecked={true} />}
                  label="Active (Outlet is Open)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  id="business"
                  label="Select Business *"
                  {...register("business")}
                  error={!!errors.business}
                  helperText={errors.business?.message}
                >
                  {businessData &&
                    businessData?.map((business) => (
                      <MenuItem key={business.business_id} value={business.id}>
                        {business.business_id}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            </Grid>

            <DialogActions className="justify-center pbs-0 sm:pbe-16 sm:pli-16 mt-5">
              <Button variant="contained" type="submit" disabled={loading}>
                Submit
              </Button>
              <Button variant="outlined" color="error" type="reset" onClick={() => handleReset()}>
                Cancel
              </Button>
            </DialogActions>

            {loading && <Loader />}
          </DialogContent>
        </form>

        <Toaster />
      </div>
    </Dialog>
  )
}

export default AddOutletForm

