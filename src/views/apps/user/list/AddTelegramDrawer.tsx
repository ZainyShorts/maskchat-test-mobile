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

// Component Imports
import CustomTextField from "@core/components/mui/TextField"
import type { WhatsAppDataType } from "@/api/interface/whatsappInterface"
import { getFeedToChatGpt } from "@/api/feedToChatGPT"
import { getAllBusiness } from "@/api/business"
import type { BusinessType } from "@/types/apps/businessTypes"
import type { FeedToChatGptType } from "@/api/interface/interfaceFeedToGPT"
import { TelegramDataType } from "@/api/interface/telegramInterface"
import { FeedTelegram } from "@/api/telegram"
import { getLocalizedUrl } from "@/utils/i18n"
import { Locale } from "@/configs/i18n"


type Props = {
  open: boolean
  handleClose: () => void
}

type AlertState = {
  show: boolean
  type: "success" | "error"
  message: string
}

const AddTelegramDrawer = ({ open, handleClose }: Props) => {
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
  } = useForm<TelegramDataType>()

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

  const onSubmit = (data: TelegramDataType, e: any) => {
    e.preventDefault()
    // setLoading(true)
    console.log("trigger")

    FeedTelegram(data)
    // reset()
    // handleClose()
    // showAlert("success", "✅ WhatsApp platform process started in the background.")
      .then((res) => {
        console.log(res, "create FeedWhatsApp")
        showAlert("success", "Telegram connected successfully")
        setTimeout(() => {
          handleClose()
          router.replace(getLocalizedUrl("/account-settings", locale as Locale))
        }, 2000)
      })
      .catch((error) => {
        if (error?.data && error?.data?.feed_to_gpt) {
          showAlert("error", error?.data?.feed_to_gpt[0])
        } else {
          showAlert("error", "Error in Feed Telegram")
        }
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
        reset() // Reset the form after submission
      })
  }

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
        Add Telegram Feed
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
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Bot Name *"
                fullWidth
                placeholder="Enter Bot Name"
                {...register("bot_name", { required: " Bot Name is required" })}
                error={!!errors.bot_name}
                helperText={errors.bot_name?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Access Token *"
                fullWidth
                placeholder="Enter Access Token"
                {...register("token", { required: "Access Token is required" })}
                error={!!errors.token}
                helperText={errors.token?.message}
              />
            </Grid>

           

            
          </Grid>
        </DialogContent>

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

export default AddTelegramDrawer

