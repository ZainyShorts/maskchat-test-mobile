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
import Typography from "@mui/material/Typography"
import Alert from "@mui/material/Alert"
import Collapse from "@mui/material/Collapse"

// Component Imports
import DialogCloseButton from "../DialogCloseButton"
import CustomTextField from "@core/components/mui/TextField"
import type { WhatsAppDataType } from "@/api/interface/whatsappInterface"
import { updateWhatsApp } from "@/api/whatsapp"
import type { BusinessType } from "@/types/apps/businessTypes"
import { getAllBusiness } from "@/api/business"
import { Checkbox, FormControl, FormControlLabel, FormHelperText } from "@mui/material"

type EditWhatsAppInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: WhatsAppDataType
  onTypeAdded?: any
}

type AlertState = {
  show: boolean
  type: "success" | "error"
  message: string
}

const EditWhatsAppInfo = ({ open, setOpen, data, onTypeAdded }: EditWhatsAppInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: "success",
    message: "",
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WhatsAppDataType>()

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [alert.show])

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({
      show: true,
      type,
      message,
    })
  }

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getAllBusiness()
        setUserBusinessData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch business')
      } finally {
        // setLoading(false)
      }
    }
    fetchBusiness()
  }, [])

  const handleClose = () => {
    setOpen(false)
    setAlert({ show: false, type: "success", message: "" })
  }

  const onSubmit = (data1: WhatsAppDataType, e: any) => {
    e.preventDefault()
    setLoading(true)
    const id: number = data?.id ?? 0

    updateWhatsApp(id, data1)
      .then((res) => {
        showAlert("success", "WhatsApp Feed Updated Successfully")

        if (onTypeAdded) {
          onTypeAdded()
        }

        // Close modal after showing success message
        setTimeout(() => {
          setOpen(false)
        }, 2000)
      })
      .catch((error) => {
        if (error?.data?.business) {
          showAlert("error", error?.data?.business[0])
        } else if (error?.data?.active) {
          showAlert("error", error?.data?.active[0])
        } else {
          showAlert("error", "Error In Updating WhatsApp Feed")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Dialog fullWidth open={open} maxWidth="md" scroll="body" sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className="tabler-x" />
      </DialogCloseButton>

      <DialogTitle variant="h4" className="flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16">
        Edit WhatsApp Information
        <Typography component="span" className="flex flex-col text-center">
          Updating WhatsApp details will receive a privacy audit.
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="overflow-visible pbs-0 sm:pli-16">
          {/* Alert Message */}
          <Collapse in={alert.show} sx={{ mb: 2 }}>
            <Alert severity={alert.type} onClose={() => setAlert((prev) => ({ ...prev, show: false }))} sx={{ mb: 2 }}>
              {alert.message}
            </Alert>
          </Collapse>

          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id="business"
                label="Select Business"
                defaultValue={data?.business || ""}
                inputProps={{ placeholder: "Business", ...register("business") }}
                error={!!errors.business}
                helperText={errors.business?.message}
                disabled={true}
                
              >
                {userBusinessData &&
                  userBusinessData?.map((business) => (
                    <MenuItem key={business.id} value={business.id}>
                      {business.business_id}
                    </MenuItem>
                  ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Phone Id"
                defaultValue={data?.phone_id || ""}
                {...register("phone_id", {
                  required: "Phone Id is required",
                })}
                error={!!errors.phone_id}
                helperText={errors.phone_id?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label="Access Token"
                defaultValue={data?.access_token || ""}
                {...register("access_token", {
                  required: "Access Token is required",
                })}
                error={!!errors.access_token}
                helperText={errors.access_token?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="WhatsApp Account Id"
                defaultValue={data?.whatsapp_account_id || ""}
                {...register("whatsapp_account_id", {
                  required: "WhatsApp Account Id is required",
                })}
                error={!!errors.whatsapp_account_id}
                helperText={errors.whatsapp_account_id?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Catalog Id"
                defaultValue={data?.catalog_id || ""}
                {...register("catalog_id", {
                  required: "Catalog Id is required",
                })}
                error={!!errors.catalog_id}
                helperText={errors.catalog_id?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Web Hook Token"
                defaultValue={data?.webhook_token || ""}
                {...register("webhook_token", {
                  required: "Web Hook Token is required",
                })}
                error={!!errors.webhook_token}
                helperText={errors.webhook_token?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Phone Number"
                defaultValue={data?.phone_no || ""}
                {...register("phone_no", {
                  required: "Phone Number is required",
                })}
                error={!!errors.phone_no}
                helperText={errors.phone_no?.message}
              />
            </Grid>

            

            

            {/* Category Selection */}
<Grid item xs={12} sm={6}>
  <CustomTextField
    select
    fullWidth
    label="Select Category"
    defaultValue={data?.category || "Shopify-Ecommerce"}
    {...register("category", { required: "Category is required" })}
    error={!!errors.category}
    helperText={errors.category?.message}
    disabled={true}
  >
    {[
      'Shopify-Ecommerce',
      'Food',
      'Reservation',
      'Appointment',
      'Real-Estate'
    ].map((cat) => (
      <MenuItem key={cat} value={cat}>
        {cat}
      </MenuItem>
    ))}
  </CustomTextField>
</Grid>

{/* Primary Agent Checkbox */}
<Grid item xs={12} sm={6} style={{ marginTop: "20px" }}>
  <FormControl error={!!errors.primary_agent}>
    <FormControlLabel
      control={
        <Checkbox
          defaultChecked={data?.primary_agent || false}
          {...register("primary_agent")}
          color="primary"
        />
      }
      label="Primary Agent"
    />
    {errors.primary_agent && <FormHelperText>{errors.primary_agent.message}</FormHelperText>}
  </FormControl>
</Grid>


          </Grid>
        </DialogContent>

        <DialogActions className="justify-center pbs-0 sm:pbe-16 sm:pli-16">
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Submit"}
          </Button>
          <Button variant="tonal" color="secondary" type="reset" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditWhatsAppInfo
