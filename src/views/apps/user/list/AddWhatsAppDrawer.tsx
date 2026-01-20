"use client"

// React Imports
import { useEffect, useState } from "react"

// MUI Imports
import { useParams, useRouter } from "next/navigation"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import IconButton from "@mui/material/IconButton"
import Grid from "@mui/material/Grid"
import Alert from "@mui/material/Alert"
import Collapse from "@mui/material/Collapse"
import { MenuItem } from "@mui/material"
import { useForm } from "react-hook-form"
import CircularProgress from "@mui/material/CircularProgress"
import Select from "@mui/material/Select"

// Component Imports
import CustomTextField from "@core/components/mui/TextField"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormHelperText from "@mui/material/FormHelperText"
import FormControl from "@mui/material/FormControl"
import type { WhatsAppDataType } from "@/api/interface/whatsappInterface"
import { FeedWhatsApp } from "@/api/whatsapp"
import { getFeedToChatGpt } from "@/api/feedToChatGPT"
import { getAllBusiness } from "@/api/business"
import type { BusinessType } from "@/types/apps/businessTypes"
import type { FeedToChatGptType } from "@/api/interface/interfaceFeedToGPT"
import { getLocalizedUrl } from "@/utils/i18n"
import type { Locale } from "@/configs/i18n"

type Props = {
  open: boolean
  handleClose: () => void
}

type AlertState = {
  show: boolean
  type: "success" | "error"
  message: string
}

const AddWhatsAppModal = ({ open, handleClose }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [userBusinessData, setUserBusinessData] = useState<BusinessType[]>([])
  const [feedToGptData, setFeedToGptData] = useState<FeedToChatGptType[]>([])
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: "success",
    message: "",
  })

  const router = useRouter()
  const { lang: locale } = useParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
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

  useEffect(() => {
    const fetchFeedToChatGpt = async () => {
      try {
        const response = await getFeedToChatGpt()
        console.log(response?.data?.results, "All getFeedToChatGpt Data")
        setFeedToGptData(response?.data?.results || [])
      } catch (err: any) {
        // setError(err.message || 'Failed to fetch business')
      } finally {
        // setLoading(false)
      }
    }
    fetchFeedToChatGpt()
  }, [])



  const onSubmit = (data: WhatsAppDataType, e: any) => {
  e.preventDefault();
  console.log("trigger");

  setLoading(true); // ✅ Start loader

  FeedWhatsApp({ ...data, active: true })
    .then(() => {
      // ✅ Success handling
      showAlert("success", "✅ WhatsApp platform process started in the background.");
      reset();        // reset form
      handleClose();  // close modal
    })
    .catch((err: any) => {
      console.log("err", err);

      // ✅ Error handling
      if (err?.data?.business?.[0]) {
        showAlert("error", err.data.business[0]);
      } else if (err?.data?.[0]) {
        showAlert("error", err.data[0]);
      } else {
        showAlert("error", "An unexpected error occurred.");
      }
    })
    .finally(() => {
      console.log("API call finished"); // ✅ Optional cleanup
      setLoading(false); // ✅ Stop loader
    });
};
  const handleReset = () => {
    handleClose()
    reset()
    setAlert({ show: false, type: "success", message: "" })
  }

  return (
    <Dialog fullWidth open={open} maxWidth="md" scroll="body" sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}>
      {/* Close Button */}
      <IconButton
        onClick={handleReset}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <i className="tabler-x" />
      </IconButton>

      <DialogTitle variant="h4" className="flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16">
        Add WhatsApp Feed
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
                label="Select Business *"
                inputProps={{ placeholder: "Business", ...register("business") }}
                error={!!errors.business}
                helperText={errors.business?.message}
              >
                {userBusinessData &&
                  userBusinessData?.map((business) => (
                    <MenuItem key={business.id} value={business.id}>
                      {business.business_id}
                    </MenuItem>
                  ))}
                  {/* <MenuItem value={'0000000000000'}>
                      0000000000000
                    </MenuItem> */}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Phone id *"
                fullWidth
                placeholder="Enter Phone id"
                {...register("phone_id", { required: "Phone id is required" })}
                error={!!errors.phone_id}
                helperText={errors.phone_id?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Access Token *"
                fullWidth
                placeholder="Enter Access Token"
                {...register("access_token", { required: "Access Token is required" })}
                error={!!errors.access_token}
                helperText={errors.access_token?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Webhook Token *"
                fullWidth
                {...register("webhook_token", { required: "Webhook Token is required" })}
                error={!!errors.webhook_token}
                helperText={errors.webhook_token?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="WhatsApp Account ID *"
                fullWidth
                type="number" // Set the input type to 'number'
                {...register("whatsapp_account_id", {
                  required: "WhatsApp Account ID is required",
                  valueAsNumber: true, // This ensures the value is parsed as a number
                })}
                error={!!errors.whatsapp_account_id}
                helperText={errors.whatsapp_account_id?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Catalog ID *"
                fullWidth
                {...register("catalog_id", { required: "Catalog ID is required" })}
                error={!!errors.catalog_id}
                helperText={errors.catalog_id?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Phone Number"
                fullWidth
                {...register("phone_no", { required: "Phone Number is required" })}
                error={!!errors.phone_no}
                helperText={errors.phone_no?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
  <CustomTextField
    select
    fullWidth
    id="category"
    label="Select Category *"
    {...register("category", { required: "Category is required" })}
    error={!!errors.category}
    helperText={errors.category?.message}
  >
    {[
      'Shopify-Ecommerce',
      'Food',
      'Reservation',
      'Appointment',
      'Real-Estate',
    ].map((cat) => (
      <MenuItem key={cat} value={cat}>
        {cat}
      </MenuItem>
    ))}
  </CustomTextField>
</Grid>

<Grid item xs={12} sm={6} style={{ marginTop: "20px" }}>
  <FormControl error={!!errors.primary_agent}>
    <FormControlLabel
      control={<Checkbox {...register("primary_agent")} color="primary" />}
      label="Primary Agent"
    />
    {errors.primary_agent && <FormHelperText>{errors.primary_agent.message}</FormHelperText>}
  </FormControl>
</Grid>

          </Grid>
        </DialogContent>

        {/* <DialogActions className="justify-center pbs-0 sm:pbe-16 sm:pli-16">
          <Button variant="contained" type="submit" disabled={loading}>
            Submit
          </Button>
          <Button variant="tonal" color="error" type="reset" onClick={handleReset}>
            Cancel
          </Button>
        </DialogActions> */}
        <DialogActions className="justify-center pbs-0 sm:pbe-16 sm:pli-16">
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : "Submit"}
        </Button>
        <Button variant="tonal" color="error" type="reset" onClick={handleReset} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>

      </form>
    </Dialog>
  )
}

export default AddWhatsAppModal
