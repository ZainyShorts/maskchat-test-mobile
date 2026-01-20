"use client"

// React Imports
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

// MUI Imports
import Grid from "@mui/material/Grid"
import Dialog from "@mui/material/Dialog"
import Button from "@mui/material/Button"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Typography from "@mui/material/Typography"
import { MenuItem, Box } from "@mui/material"

// Component Imports
import DialogCloseButton from "../DialogCloseButton"
import CustomTextField from "@core/components/mui/TextField"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import type { BusinessEditPayload, BusinessType } from "@/types/apps/businessTypes"
import { getAllBusiness, getBusinessById, updateBusiness } from "@/api/business"
import { useAuthStore } from "@/store/authStore"
import ConfirmationDialog from "@/components/ConfirmationDialog"
import type { CurrencyDataType } from "@/api/interface/currencyInterface"
import { ENDPOINTS, getBaseUrl } from "@/api/vars/vars"

type EditBusinessInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  businessId: number // Add businessId prop
  onTypeAdded?: any
}

const EditBusinessInfo = ({ open, setOpen, businessId, onTypeAdded }: EditBusinessInfoProps) => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue
  } = useForm<BusinessEditPayload>()

  const [currencyData, setCurrencyData] = useState<CurrencyDataType[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null)
  const { businessAction } = useAuthStore()
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [payloadData, setPayloadData] = useState<BusinessEditPayload | null>(null)

  const [businessDocPreview, setBusinessDocPreview] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const watchedBusinessDoc: any = watch("business_doc")
  const watchedLogo: any = watch("logo")

  // Fetch business data when component mounts or businessId changes
  useEffect(() => {
    console.log('businessId',businessId)
    const fetchBusinessData = async () => {
      if (!businessId) return
      
      try {
        setLoading(true)
        const response = await getBusinessById(businessId)
        const businessData = response.data
        
        // Set form values
        reset({
          name: businessData.name,
          business_id: businessData.business_id,
          business_desc: businessData.business_desc,
          business_email: businessData.business_email,
          app_code: businessData.app_code,
          business_address: businessData.business_address,
          business_initial: businessData.business_initial,
          contact_number: businessData.contact_number,
          mail_server: businessData.mail_server,
          marketing_template_url: businessData.marketing_template_url,
          feedback: businessData.feedback,
          abandonedCheckouts: businessData.abandonedCheckouts,
          client_id: businessData.client_id
          // Note: Files (logo, business_doc) can't be set in the form state
        })
        
        // Set currency
        if (businessData.currency) {
          setSelectedCurrency(businessData.currency)
          setValue("currency", businessData.currency.id)
        }
        
        // Set previews for existing files
        if (businessData.logo) {
          setLogoPreview(businessData.logo)
        }
        if (businessData.business_doc) {
          setBusinessDocPreview(businessData.business_doc)
        }
        
      } catch (error) {
        console.error("Failed to fetch business data:", error)
        toast.error("Failed to load business data")
      } finally {
        setLoading(false)
      }
    }
    
    if (open && businessId) {
      fetchBusinessData()
    }
  }, [open, businessId, reset, setValue])

  // Fetch currencies
  useEffect(() => {
    async function getData() {
      const authToken = localStorage.getItem("auth_token")
      const currencyResponse = await fetch(`${getBaseUrl()}whatseat/${ENDPOINTS.currencies}/`, {
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      })
      if (currencyResponse.ok) {
        const currencyData = await currencyResponse.json()
        setCurrencyData(currencyData?.data || [])
      }
    }
    getData()
  }, [])

  const createFilePreview = (file: any): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      } else if (file.type === "application/pdf") {
        resolve("/api/placeholder/64/64?text=PDF")
      } else {
        resolve("/api/placeholder/64/64?text=FILE")
      }
    })
  }

  useEffect(() => {
    if (watchedBusinessDoc && watchedBusinessDoc.length > 0) {
      const file = watchedBusinessDoc[0]
      createFilePreview(file).then(setBusinessDocPreview)
    }
  }, [watchedBusinessDoc])

  useEffect(() => {
    if (watchedLogo && watchedLogo.length > 0) {
      const file = watchedLogo[0]
      createFilePreview(file).then(setLogoPreview)
    }
  }, [watchedLogo])

  const FilePreview = ({ preview, fileName }: { preview: string | null; fileName?: string }) => {
    if (!preview) return null

    return (
      <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <img
          src={preview || "/placeholder.svg"}
          alt="Preview"
          style={{
            width: 48,
            height: 48,
            objectFit: "cover",
            borderRadius: 4,
            border: "1px solid #e0e0e0",
          }}
        />
        {fileName && (
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {fileName}
          </Typography>
        )}
      </Box>
    )
  }

  const handleConfirm = async () => {
    if (!payloadData) return

    const formData = new FormData()

    // Add all text fields
    formData.append("business_address", payloadData.business_address || "")
    formData.append("contact_number", payloadData.contact_number || "")
    formData.append("business_desc", payloadData.business_desc || "")
    formData.append("business_id", payloadData.business_id || "")
    formData.append("business_initial", payloadData.business_initial || "")
    formData.append("name", payloadData.name || "")
    formData.append("currency", selectedCurrency?.id?.toString() || "")
    formData.append("app_code", payloadData.app_code || "")
    formData.append("business_email", payloadData.business_email || "")
    formData.append("mail_server", payloadData.mail_server || "")
    formData.append("marketing_template_url", payloadData.marketing_template_url || "")
    formData.append('feedback', payloadData.feedback ? 'true' : 'false')
    formData.append('client_id', payloadData.client_id || "")
    formData.append('abandonedCheckouts', payloadData.abandonedCheckouts ? 'true' : 'false')
    
    

    // Add files if they were uploaded
    if (payloadData.logo && payloadData.logo.length > 0) {
      formData.append("logo", payloadData.logo[0])
    }

    if (payloadData.business_doc && payloadData.business_doc.length > 0) {
      formData.append("business_doc", payloadData.business_doc[0])
    }

    try {
      setLoading(true)
      await updateBusiness(businessId, formData)
      setOpen(false)
      if (onTypeAdded) onTypeAdded()
    } catch (error: any) {
      console.log(error?.data, "error-------->")
      if (error?.data?.user) {
        toast.error(error?.data?.user[0], {
          duration: 5000,
        })
      } else if (error?.data?.business_doc) {
        toast.error(error?.data?.business_doc[0], {
          duration: 5000,
        })
      } else {
        toast.error(error?.data?.message || "Error Updating Business", {
          duration: 5000,
        })
      }
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const onSubmit = (formData: BusinessEditPayload, e: any) => {
    const payload = {
      ...formData,
      feedback: typeof formData.feedback === "string" ? formData.feedback === "true" : !!formData.feedback,
      abandonedCheckouts: typeof formData.abandonedCheckouts === "string" ? formData.abandonedCheckouts === "true" : !!formData.abandonedCheckouts,
    }
    e.preventDefault()
    setPayloadData(payload)
    setOpenConfirmation(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog fullWidth open={open} maxWidth="md" scroll="body" sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className="tabler-x" />
      </DialogCloseButton>
      <DialogTitle variant="h4" className="flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16">
        Edit Business Information
        <Typography component="span" className="flex flex-col text-center">
          Updating Business details will receive a privacy audit.
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className="overflow-visible pbs-0 sm:pli-16">
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Business Name *"
                fullWidth
                placeholder="Enter Business Name"
                {...register("name", { required: "Business Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Select Business Meta Id"
                inputProps={{ placeholder: "Business", ...register("business_id") }}
                error={!!errors.business_id}
                helperText={errors.business_id?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Business Description"
                {...register("business_desc", { required: "Business Description is required" })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <CustomTextField
                  select
                  fullWidth
                  id="feedback"
                  label="Feedback *"
                  {...register("feedback")}
                  error={!!errors.feedback}
                  helperText={errors.feedback?.message}
                  value={watch("feedback") ?? ""} // default value
                >
                  <MenuItem value="true">True</MenuItem>
                  <MenuItem value="false">False</MenuItem>

                </CustomTextField>
                </Grid>
              
            <Grid item xs={12} sm={6}>
            <CustomTextField
                  select
                  fullWidth
                  id="abandonedCheckouts"
                  label="Abandoned Checkout *"
                  {...register("abandonedCheckouts")}
                  error={!!errors.abandonedCheckouts}
                  helperText={errors.abandonedCheckouts?.message}
                  value={watch("abandonedCheckouts") ?? ""} // default value
                >
                  <MenuItem value="true">True</MenuItem>
                  <MenuItem value="false">False</MenuItem>

                </CustomTextField>
                </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Business Email"
                {...register("business_email", { required: "Business email is required" })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="App code"
                {...register("app_code", { required: "App code is required" })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Business Address"
                {...register("business_address", { required: "Business Address is required" })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Business Initial"
                {...register("business_initial", {
                  required: "Business initial is required",
                  pattern: {
                    value: /^[A-Z]{1,5}$/,
                    message: "Only up to 5 capital letters are allowed",
                  },
                })}
                error={!!errors.business_initial}
                helperText={errors.business_initial?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id="currency"
                label="Select Currency *"
                value={selectedCurrency?.id || ""}
                {...register("currency", { required: "Currency is required" })}
                onChange={(e) => {
                  const selected = currencyData.find((curr: any) => curr.id === Number.parseInt(e.target.value))
                  setSelectedCurrency(selected)
                }}
                error={!!errors.currency}
                helperText={errors.currency?.message}
              >
                {currencyData &&
                  currencyData.map((item: any) => (
                    <MenuItem key={item?.id} value={item?.id}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: "bold", minWidth: "24px" }}>{item?.symbol}</span>
                        <span>{item?.code}</span>
                        <span style={{ color: "#666" }}>- {item?.label}</span>
                      </div>
                    </MenuItem>
                  ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Business Contact"
                {...register("contact_number", {
                  required: "Business Contact is required",
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Mail Server *"
                fullWidth
                placeholder="Enter SMTP server (e.g., smtp.gmail.com)"
                {...register("mail_server", {
                  required: "Mail server is required",
                  pattern: {
                    value: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid SMTP server address",
                  },
                })}
                error={!!errors.mail_server}
                helperText={errors.mail_server?.message}
              />
            </Grid>

           
           <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Template logo *"
                fullWidth
                placeholder="Enter Template logo (e.g., https://logo.png"
                {...register("marketing_template_url", {
                  required: "Template logo is required",
                })}
                error={!!errors.marketing_template_url}
                helperText={errors.marketing_template_url?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label="Client ID *"
                fullWidth
                placeholder="Enter Client ID (e.g.,41324213123"
                {...register("client_id", {
                  required: "Client ID is required",
                })}
                error={!!errors.client_id}
                helperText={errors.client_id?.message}
              />
            </Grid>


                            <Grid item xs={12} sm={6}>
   <CustomTextField
    type="file"
    label="Business Document"
    fullWidth
    inputProps={{ accept: "*" }}
    {...register("business_doc")}
  />
  
    <Typography
      variant="caption"
      color="textSecondary"
      sx={{ mt: 1, display: "block" }}
    >
      Current:{" "}
      <a
        href={businessDocPreview!}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }}
      >
        View PDF
      </a>
    </Typography>
  {/* )} */}
</Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                type="file"
                label="Business Logo"
                fullWidth
                inputProps={{ accept: "image/*" }}
                {...register("logo")}
              />
              <FilePreview
                preview={logoPreview}
                fileName={watchedLogo?.[0]?.name}
              />
            </Grid>

            
        
          </Grid>
        </DialogContent>
        <DialogActions className="justify-center pbs-0 sm:pbe-16 sm:pli-16">
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <Button variant="tonal" color="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        </DialogActions>
        <ConfirmationDialog
          openConfirmation={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onConfirm={handleConfirm}
          title="Edit Business"
          description="Are you sure you want to edit this business?"
        />
      </form>
    </Dialog>
  )
}

export default EditBusinessInfo
