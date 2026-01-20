// 'use client'

// // React Imports
// import { useState } from 'react'
// import { useForm } from 'react-hook-form'

// // MUI Imports
// import Grid from '@mui/material/Grid'
// import Dialog from '@mui/material/Dialog'
// import Button from '@mui/material/Button'
// import DialogTitle from '@mui/material/DialogTitle'
// import DialogContent from '@mui/material/DialogContent'
// import DialogActions from '@mui/material/DialogActions'

// import Typography from '@mui/material/Typography'

// // Component Imports
// import DialogCloseButton from '../DialogCloseButton'
// import CustomTextField from '@core/components/mui/TextField'

// import toast, { Toaster } from 'react-hot-toast'
// import { useParams, useRouter } from 'next/navigation'
// import { useAuthStore } from '@/store/authStore'
// import { ResturantDataType } from '@/api/interface/resturantInterface'
// import { updateResturant } from '@/api/resturant'
// import { getLocalizedUrl } from '@/utils/i18n'
// import { Locale } from '@/configs/i18n'

// type EditResturantInfoProps = {
//   open: boolean
//   setOpen: (open: boolean) => void
//   data?: ResturantDataType
//   onTypeAdded?: any
// }

// const EditResturantInfo = ({ open, setOpen, data, onTypeAdded }: EditResturantInfoProps) => {
//   const [loading, setLoading] = useState<boolean>(false)
//   const router = useRouter()
//   const { lang: locale } = useParams()
//   const {
//     register,
//     handleSubmit,
//     formState: { errors }
//   } = useForm<ResturantDataType>()

//   const handleClose = () => {
//     setOpen(false)
//   }

//   const onSubmit = (data1: ResturantDataType, e: any) => {
//     e.preventDefault()

//     const id: number = data?.id ?? 0
//     updateResturant(id, data1)
//       .then(res => {
//         toast.success('Outlet Updated Successfully', {
//           duration: 5000 // Duration in milliseconds (5 seconds)
//         })
//         if (onTypeAdded) {
//           onTypeAdded()
//         }
//         setOpen(false)
//       })
//       .catch(error => {
//         console.log(error, 'error Outlet Update api')
//       })
//       .finally(() => {
//         setLoading(false)
//       })
//   }

//   return (
//     <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
//       <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
//         <i className='tabler-x' />
//       </DialogCloseButton>
//       <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
//         Edit Outlet Information
//         <Typography component='span' className='flex flex-col text-center'>
//           Updating Outlet details will receive a privacy audit.
//         </Typography>
//       </DialogTitle>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
//           <Grid container spacing={5}>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='Name'
//                 defaultValue={data?.name || ''}
//                 {...register('name', {
//                   required: 'Name is required'
//                 })}
//                 error={!!errors.name}
//                 helperText={errors.name?.message}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='Postal code delivery'
//                 defaultValue={data?.postal_code_delivery || ''}
//                 {...register('postal_code_delivery', {
//                   required: 'Postal code delivery is required'
//                 })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='City'
//                 defaultValue={data?.city || ''}
//                 {...register('city', {
//                   required: 'City is required'
//                 })}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='Catalog Link'
//                 defaultValue={data?.catalog_link || ''}
//                 {...register('catalog_link', {
//                   required: 'Catalog Link is required'
//                 })}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='Description'
//                 defaultValue={data?.description || ''}
//                 {...register('description', {
//                   required: 'Description is required'
//                 })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='Cuisine type'
//                 defaultValue={data?.cuisine_type || ''}
//                 {...register('cuisine_type', {
//                   required: 'Cuisine type is required'
//                 })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 fullWidth
//                 label='Business id'
//                 defaultValue={data?.business.business_id || ''}
//                 {...register('business_id', {
//                   required: 'Business id is required'
//                 })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <CustomTextField
//                 label='Contact Number'
//                 fullWidth
//                 defaultValue={data?.contact_number || ''}
//                 {...register('contact_number', {
//                   required: 'Contact Number is required'
//                 })}
//                 error={!!errors.contact_number}
//                 helperText={errors.contact_number?.message}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
//           <Button variant='contained' type='submit'>
//             Submit
//           </Button>
//           <Button variant='tonal' color='secondary' type='reset' onClick={handleClose}>
//             Cancel
//           </Button>
//         </DialogActions>
//       </form>
//       <Toaster />
//     </Dialog>
//   )
// }

// export default EditResturantInfo

"use client"

// React Imports
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"

// MUI Imports
import Grid from "@mui/material/Grid"
import Dialog from "@mui/material/Dialog"
import Button from "@mui/material/Button"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import Typography from "@mui/material/Typography"

import toast, { Toaster } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { ResturantDataType } from "@/api/interface/resturantInterface"
import { updateResturant } from "@/api/resturant"

// ✅ Import Loader
import Loader from "../../../components/loader/LoaderRing"

type EditResturantInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: ResturantDataType
  onTypeAdded?: any
}

const EditResturantInfo = ({ open, setOpen, data, onTypeAdded }: EditResturantInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { lang: locale } = useParams()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResturantDataType>()

  const generateTimeOptions = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        const ampm = hour < 12 ? "AM" : "PM"
        const time12 = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`
        times.push({ value: time12, label: time12 })
      }
    }
    return times
  }

  const timeOptions = generateTimeOptions()

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = (data1: ResturantDataType, e: any) => {
    e.preventDefault()

    setLoading(true) // ✅ start loader

    const id: number = data?.id ?? 0
    updateResturant(id, data1)
      .then((res) => {
        toast.success("Outlet Updated Successfully", { duration: 5000 })
        if (onTypeAdded) {
          onTypeAdded()
        }
        setOpen(false)
      })
      .catch((error) => {
        console.log(error, "error Outlet Update api")
        toast.error("Failed to update outlet", { duration: 5000 })
      })
      .finally(() => {
        setLoading(false) // ✅ stop loader
      })
  }

  return (
    <Dialog fullWidth open={open} maxWidth="md" scroll="body" sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}>
      <IconButton
        onClick={() => setOpen(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle variant="h4" className="flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16">
        Edit Outlet Information
        <Typography component="span" className="flex flex-col text-center">
          Updating Outlet details will receive a privacy audit.
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="overflow-visible pbs-0 sm:pli-16">
          <Grid container spacing={5}>
            {/* --- your input fields stay unchanged --- */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                defaultValue={data?.name || ""}
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal code delivery"
                defaultValue={data?.postal_code_delivery || ""}
                {...register("postal_code_delivery", { required: "Postal code delivery is required" })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                defaultValue={data?.city || ""}
                {...register("city", { required: "City is required" })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Google Map Location Link"
                defaultValue={data?.catalog_link || ""}
                {...register("catalog_link", { required: "Google Map Location Link is required" })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                defaultValue={data?.description || ""}
                {...register("description", { required: "Description is required" })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business id"
                defaultValue={data?.business.business_id || ""}
                {...register("business_id", { required: "Business id is required" })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact Number"
                fullWidth
                defaultValue={data?.contact_number || ""}
                {...register("contact_number", { required: "Contact Number is required" })}
                error={!!errors.contact_number}
                helperText={errors.contact_number?.message}
              />
            </Grid>

            

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Delivery Radius (km)"
                defaultValue={data?.deliveryRadius || ""}
                {...register("deliveryRadius", {
                  required: "Delivery radius is required",
                  min: { value: 0, message: "Delivery radius cannot be negative" },
                })}
                error={!!errors.deliveryRadius}
                helperText={errors.deliveryRadius?.message}
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Open Time"
                defaultValue={data?.openTime || ""}
                {...register("openTime", { required: "Open time is required" })}
                error={!!errors.openTime}
                helperText={errors.openTime?.message}
                SelectProps={{ native: true }}
              >
                <option value="">Select Open Time</option>
                {timeOptions.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Close Time"
                defaultValue={data?.closeTime || ""}
                {...register("closeTime", { required: "Close time is required" })}
                error={!!errors.closeTime}
                helperText={errors.closeTime?.message}
                SelectProps={{ native: true }}
              >
                <option value="">Select Close Time</option>
                {timeOptions.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </TextField>
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="End Time"
                defaultValue={data?.endBreakTime || ""}
                {...register("endBreakTime", { required: "End time is required" })}
                error={!!errors.endBreakTime}
                helperText={errors.endBreakTime?.message}
                SelectProps={{ native: true }}
              >
                <option value="">Select End Time</option>
                {timeOptions.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </TextField>
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Start Break"
                defaultValue={data?.startBreakTime || ""}
                {...register("startBreakTime", { required: "Start time is required" })}
                error={!!errors.startBreakTime}
                helperText={errors.startBreakTime?.message}
                SelectProps={{ native: true }}
              >
                <option value="">Select Start Time</option>
                {timeOptions.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </TextField>
            </Grid>

            

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Checkbox defaultChecked={data?.active ?? true} {...register("active")} color="primary" />}
                label="Active (Outlet is currently open for business)"
              />
            </Grid>
          </Grid>

          {/* ✅ Loader */}
          {loading && <Loader />}
        </DialogContent>

        <DialogActions className="justify-center pbs-0 sm:pbe-16 sm:pli-16">
          <Button variant="contained" type="submit" disabled={loading}>
            Submit
          </Button>
          <Button variant="tonal" color="secondary" type="reset" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>

      <Toaster />
    </Dialog>
  )
}

export default EditResturantInfo
