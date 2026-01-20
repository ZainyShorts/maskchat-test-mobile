"use client"

import { useEffect, useState, type ChangeEvent } from "react"
import { useForm, Controller } from "react-hook-form"

// MUI
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import MenuItem from "@mui/material/MenuItem"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"
import Alert from "@mui/material/Alert"

// UI
import CustomTextField from "@core/components/mui/TextField"

// Notifications
import toast from "react-hot-toast"

// APIs
import { createBusiness, getAllBusiness, updateBusiness, deleteBusiness } from "@/api/business"
import { getAllCurrencies } from "@/api/currencies"
import { getAllUsers } from "@/api/user"

// Store
import { useAuthStore } from "@/store/authStore"

// Components
import ConfirmationModal from "@/components/dialogs/confirm-modal"

// Types
type BusinessRecord = {
  id?: number
  business_id?: string
  name?: string
  business_address?: string
  business_desc?: string
  contact_number?: string
  business_initial?: string
  currency?: number | string
  business_email?: string
  app_code?: string
  mail_server?: string
  marketing_template_url?: string
  feedback?: boolean | string
  feedback_url?: string
  abandonedCheckouts?: boolean | string
  client_id?: string
  user?: number | string
  logo?: FileList | null
  business_doc?: FileList | null
  logo_url?: string
  business_doc_url?: string
  timezone?: string
  website?: string
  meta_category?: string
}

// WhatsApp Business categories (uppercase)
const WHATSAPP_CATEGORIES = [
  "RESTAURANT",
  "HEALTH",
  "RETAIL",
  "SERVICES",
  "ENTERTAINMENT",
  "TECHNOLOGY",
  "EDUCATION",
  "TRAVEL",
  "FINANCE",
  "BEAUTY",
  "HEALTH_FITNESS"
]

type Currency = { id: number; label: string; symbol?: string; code?: string }
type UserLite = { id: number; first_name?: string; email?: string }

const BusinessPage = () => {
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [businessPk, setBusinessPk] = useState<number | undefined>(undefined) 
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
const [docPreview, setDocPreview] = useState<string | null>(null)



  const [imgSrc, setImgSrc] = useState<string>("/images/avatars/1.png")
  const [fileInputLogo, setFileInputLogo] = useState<File | null>(null)
  const [fileInputDoc, setFileInputDoc] = useState<File | null>(null)
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [users, setUsers] = useState<UserLite[]>([])
  const [businessList, setBusinessList] = useState<BusinessRecord[]>([])
  const [mode, setMode] = useState<"create" | "edit">("edit")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)
  const [fieldsEnabled, setFieldsEnabled] = useState(false)
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<number | "">("")

  const { user } = useAuthStore()
  const isAdmin = user?.user_type === "admin"

  const {
    register,
    handleSubmit,
    control,
    formState: { errors: formErrors },
    reset,
    watch,
    setValue,
  } = useForm<BusinessRecord>({
    defaultValues: {
      name: "",
      business_id: "",
      business_desc: "",
      feedback: false,
      abandonedCheckouts:false,
      business_address: "",
      business_initial: "",
      business_email: "",
      app_code: "",
      currency: "",
      contact_number: "",
      mail_server: "",
      marketing_template_url: "",
      client_id: "",
      user: "",
      feedback_url:"",
      timezone: "Asia/Karachi",
      website:"",
      meta_category:"SERVICES"
    },
  })

  // Load metadata (currencies and users)
  useEffect(() => {
    let ignore = false
    const loadMeta = async () => {
      try {
        const promises = [getAllCurrencies()]
        if (isAdmin) promises.push(getAllUsers())
        const results = await Promise.allSettled(promises)

        if (!ignore) {
          if (results[0].status === "fulfilled") {
            setCurrencies(results[0].value?.data?.data || [])
          }
          if (isAdmin && results[1] && results[1].status === "fulfilled") {
            setUsers((results[1] as any).value?.data?.results || [])
          }
        }
      } catch (error) {
        console.error("Failed to load metadata:", error)
        toast.error("Failed to load currencies and users")
      }
    }
    loadMeta()
    return () => {
      ignore = true
    }
  }, [isAdmin])




  // Load business data
useEffect(() => {
  let ignore = false
  const loadBusinesses = async () => {
    setLoading(true)
    try {
      const res = await getAllBusiness()
      const businesses: BusinessRecord[] = res?.data?.results || []

      if (!ignore) {
        setBusinessList(businesses)

        if (businesses.length > 0) {
          setMode("edit")
          setBusinessPk(businesses[0].id)
          setFieldsEnabled(true)
          // Move setValue here, after confirming businesses[0] exists
          setValue("timezone", businesses[0].timezone || "Asia/Karachi")
          loadBusinessData(businesses[0])
        } else {
          setMode("create")
          setBusinessPk(undefined)
          setFieldsEnabled(false)
          reset()
        }
      }
    } catch (err: any) {
      if (!ignore) {
        const errorMsg = err?.data?.message || err?.message || "Failed to load businesses"
        toast.error(errorMsg)
      }
    } finally {
      if (!ignore) setLoading(false)
    }
  }
  loadBusinesses()
  return () => {
    ignore = true
  }
}, [reset])

  const loadBusinessData = (business: BusinessRecord) => {
    reset({
      name: business.name || "",
      business_id: business.business_id || "",
      business_desc: business.business_desc || "",
      feedback: business.feedback ?? false,
      abandonedCheckouts: business.abandonedCheckouts ?? false,
      business_address: business.business_address || "",
      business_initial: business.business_initial || "",
      business_email: business.business_email || "",
      app_code: business.app_code || "",
      contact_number: business.contact_number || "",
      mail_server: business.mail_server || "",
      marketing_template_url: business.marketing_template_url || "",
      client_id: business.client_id || "",
      user: (business.user as any) ?? "",
      timezone: business.timezone || "Asia/Karachi", 
      feedback_url: business.feedback_url || "",
      website: business.website || "",
      meta_category: business.meta_category || "SERVICES",
      // category: business.category || "Shopify-Ecommerce", 
    }) 
if (business.logo_url) {
  setLogoPreview(business.logo_url) // existing logo URL from backend
} else {
  setLogoPreview(null)
}
if (business.business_doc_url) {
  setDocPreview(business.business_doc_url) // existing doc URL from backend
} else {
  setDocPreview(null)
}

    if (business.currency) {
      const currId = typeof business.currency === "object" ? (business.currency as any).id : Number(business.currency)
      setSelectedCurrencyId(currId || "")
      setValue("currency", currId as any)
    } else {
      setSelectedCurrencyId("")
    }

    setValue("feedback", (business.feedback ? "true" : "false") as any)

    if (business.logo_url) {
      setImgSrc(business.logo_url)
    } else {
      setImgSrc("/images/avatars/1.png")
    }

    setFileInputLogo(null)
    setFileInputDoc(null)
  }

  const handleAddBusiness = () => {
    setMode("create")
    setBusinessPk(undefined)
    setFieldsEnabled(true)
    reset()
    setImgSrc("/images/avatars/1.png")
    setFileInputLogo(null)
    setFileInputDoc(null)
    setErrors({})
  }

  const handleDeleteBusiness = async (businessId: number) => {
    try {
      setSubmitting(true)
      await deleteBusiness(String(businessId))
      const refreshRes = await getAllBusiness()
      const businesses = refreshRes?.data?.results || []
      setBusinessList(businesses)
      if (businesses.length > 0) {
        setBusinessPk(businesses[0].id)
        loadBusinessData(businesses[0])
        setMode("edit")
        setFieldsEnabled(true)
      } else {
        setMode("create")
        setBusinessPk(undefined)
        setFieldsEnabled(false)
        reset()
        setImgSrc("/images/avatars/1.png")
      }
    } catch (error: any) {
      console.error("Delete error:", error)
      const errorMsg = error?.data?.detail || error?.data?.message || error?.message || "Error deleting business"
      toast.error(errorMsg)
    } finally {
      setSubmitting(false)
      setIsModalOpen(false)
    }
  }

  const handleDeleteClick = () => {
    if (businessPk) {
      setSelectedMenuId(businessPk)
      setIsModalOpen(true)
    }
  }

  const validateForm = (data: BusinessRecord): Record<string, string> => {
    const validationErrors: Record<string, string> = {}
    if (!data.name?.trim()) validationErrors.name = "Business name is required"
    if (!data.business_id?.trim()) validationErrors.business_id = "Business Meta ID is required"
    if (!data.business_desc?.trim()) validationErrors.business_desc = "Business description is required"
    if (!data.business_address?.trim()) validationErrors.business_address = "Business address is required"
    if (!data.business_email?.trim()) validationErrors.business_email = "Business email is required"
    if (!data.app_code?.trim()) validationErrors.app_code = "App code is required"
    if (!data.contact_number?.trim()) validationErrors.contact_number = "Contact number is required"
    if (!data.mail_server?.trim()) validationErrors.mail_server = "Mail server is required"
    if (!data.marketing_template_url?.trim()) validationErrors.marketing_template_url = "Template logo URL is required"
    if (!data.client_id?.trim()) validationErrors.client_id = "Client ID is required"
    if (!data.timezone?.trim()) validationErrors.timezone = "Timezone is required"
    if (!data.feedback_url?.trim()) validationErrors.feedback_url = 'Feedback Url is required'
    if (!data.website?.trim()) validationErrors.website = 'Website is required'
    if (!data.meta_category?.trim()) validationErrors.meta_category = 'Category is required'
    
    if (data.business_initial && !/^[A-Z]{1,5}$/.test(data.business_initial)) {
      validationErrors.business_initial = "Only up to 5 capital letters are allowed"
    } else if (!data.business_initial?.trim()) {
      validationErrors.business_initial = "Business initial is required"
    }

    if (data.mail_server && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.mail_server)) {
      validationErrors.mail_server = "Please enter a valid SMTP server address"
    }

    if (data.business_email && !/\S+@\S+\.\S+/.test(data.business_email)) {
      validationErrors.business_email = "Please enter a valid email address"
    }

    if (mode === "create") {
      if (!fileInputDoc) {
        validationErrors.business_doc = "Business document is required for new businesses"
      }
    }

    if (isAdmin && mode === "create" && !data.user) {
      validationErrors.user = "Please select a user"
    }

    return validationErrors
  }

  const onSubmit = async (data: BusinessRecord) => {
    try {
      setSubmitting(true)
      setErrors({})
      const validationErrors = validateForm(data)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        toast.error("Please fix the validation errors")
        return
      }

      const formData: any = new FormData()
      formData.append("business_id", data.business_id || "")
      formData.append("name", data.name || "")
      formData.append("business_address", data.business_address || "")
      formData.append("business_desc", data.business_desc || "")
      formData.append("contact_number", data.contact_number || "")
      formData.append("business_initial", data.business_initial || "")
      formData.append("currency", (data.currency as any)?.toString?.() || "")
      formData.append("business_email", data.business_email || "")
      formData.append("app_code", data.app_code || "")
      formData.append("mail_server", data.mail_server || "")
      formData.append("marketing_template_url", data.marketing_template_url || "")
      const feedbackNormalized = typeof data.feedback === "string" ? data.feedback === "true" : !!data.feedback
      formData.append("feedback", feedbackNormalized ? "true" : "false")

      const abandonedCheckoutsNormalized = typeof data.abandonedCheckouts === "string" ? data.abandonedCheckouts === "true" : !!data.abandonedCheckouts
      formData.append("abandonedCheckouts", abandonedCheckoutsNormalized ? "true" : "false")
      
      formData.append("client_id", data.client_id || "")
      formData.append("timezone", data.timezone || "")
      formData.append('feedback_url',data.feedback_url|| "")
      formData.append('website',data.website || "")
      formData.append('meta_category',data.meta_category || "SERVICES")


      if (isAdmin && data.user) {
        formData.append("user", String(data.user))
      } else if (!isAdmin && user?.id) {
        formData.append("user", String(user.id))
      }

      if (fileInputDoc) formData.append("business_doc", fileInputDoc)
      if (fileInputLogo) formData.append("logo", fileInputLogo)

      if (mode === "create") {
        const response = await createBusiness(formData)
        const refreshRes = await getAllBusiness()
        const businesses = refreshRes?.data?.results || []
        setBusinessList(businesses)
        if (response?.data?.id) {
          setBusinessPk(response.data.id)
          setMode("edit")
          setFieldsEnabled(true)
        }
      } else if (businessPk) {
        await updateBusiness(businessPk, formData)
        const refreshRes = await getAllBusiness()
        const businesses = refreshRes?.data?.results || []
        setBusinessList(businesses)
        const updatedBusiness = businesses.find((b:any) => b.id === businessPk)
        if (updatedBusiness) {
          loadBusinessData(updatedBusiness)
        }
      }
    } catch (error: any) {
      console.error("Form submission error:", error)
      let errorMessage = mode === "create" ? "Error creating business" : "Error updating business"
      if (error?.data) {
        if (error.data.business_doc) {
          setErrors({ business_doc: error.data.business_doc[0] })
          errorMessage = error.data.business_doc[0]
        } else if (error.data.user) {
          setErrors({ user: error.data.user[0] })
          errorMessage = error.data.user[0]
        } else if (error.data.business_id) {
          setErrors({ business_id: error.data.business_id[0] })
          errorMessage = error.data.business_id[0]
        } else if (error.data.business_email) {
          setErrors({ business_email: error.data.business_email[0] })
          errorMessage = error.data.business_email[0]
        } else if (error.data.message) {
          errorMessage = error.data.message
        } else if (error.data.detail) {
          errorMessage = error.data.detail
        }else if(error.data.website){
          errorMessage = error.data.website
        }
        else if(error.data.meta_category){
          errorMessage = error.data.meta_category
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const currentBusiness = businessList[0]
  const isEditing = mode === "edit" && !!businessPk

  return (
    <Card>
      <CardContent className="mbe-4">
        <Box className="mb-6 flex justify-start">
          {businessList.length === 0 ? (
            <Button variant="contained" onClick={handleAddBusiness} disabled={submitting}>
              Add Business
            </Button>
          ) : (
            <Button variant="outlined" color="error" onClick={handleDeleteClick} disabled={submitting}>
              Delete Business
            </Button>
          )}
        </Box>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" className="mt-4">
            <Typography variant="subtitle2">Please fix the following errors:</Typography>
            <ul>
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}
      </CardContent>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            {/* Business Name */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                autoFocus
                label="Business Name *"
                placeholder="Enter business name"
                {...register("name", { required: "Business name is required" })}
                error={!!formErrors.name || !!errors.name}
                helperText={formErrors.name?.message || errors.name}
                disabled={submitting || !fieldsEnabled}
              />
            </Grid>

            {/* Business Meta ID */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Business Meta ID *"
                placeholder="Enter business Meta ID"
                {...register("business_id", { required: "Business Meta ID is required" })}
                error={!!formErrors.business_id || !!errors.business_id}
                helperText={formErrors.business_id?.message || errors.business_id}
                disabled={submitting || !fieldsEnabled}
              />
            </Grid>

            {/* Business Description */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Business Description *"
                placeholder="Enter business description"
                {...register("business_desc", { required: "Business description is required" })}
                error={!!formErrors.business_desc || !!errors.business_desc}
                helperText={formErrors.business_desc?.message || errors.business_desc}
                disabled={submitting || !fieldsEnabled}
              />
            </Grid>


            {/* Feedback */}
            <Grid item xs={12} sm={6}>
            <CustomTextField
              select
              fullWidth
              id="feedback"
              label="Feedback *"
              {...register("feedback")}
              value={watch("feedback")}    // ✅ Add this
              error={!!formErrors.feedback || !!errors.feedback}
              helperText={formErrors.feedback?.message || errors.feedback}
              disabled={submitting || !fieldsEnabled}
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
  <Controller
    name="meta_category"
    control={control}   // from useForm()
    render={({ field }) => (
      <CustomTextField
        select
        fullWidth
        label="Meta Category *"
        {...field}
        error={!!formErrors.meta_category || !!errors.meta_category}
        helperText={formErrors.meta_category?.message || errors.meta_category}
        disabled={submitting || !fieldsEnabled}
      >
        {WHATSAPP_CATEGORIES.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </CustomTextField>
    )}
  />
</Grid>

            {/* Business feedback_url */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Business feedback URL *"
                placeholder="Enter business feedback url"
                {...register("feedback_url", { required: "Business feedback url is required" })}
                error={!!formErrors.feedback_url || !!errors.feedback_url}
                helperText={formErrors.feedback_url?.message || errors.feedback_url}
                disabled={submitting || !fieldsEnabled}
              />
            </Grid>
             <Grid item xs={12} sm={6}>
            <CustomTextField
              select
              fullWidth
              id="abandonedCheckouts"
              label="Abandoned Checkouts *"
              {...register("abandonedCheckouts")}
              value={watch("abandonedCheckouts")}    // ✅ Add this
              error={!!formErrors.abandonedCheckouts || !!errors.abandonedCheckouts}
              helperText={formErrors.abandonedCheckouts?.message || errors.abandonedCheckouts}
              disabled={submitting || !fieldsEnabled}
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </CustomTextField>
            </Grid>




            {/* Business Address */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Business Address *"
                placeholder="Enter business address"
                {...register("business_address", { required: "Business address is required" })}
                error={!!formErrors.business_address || !!errors.business_address}
                helperText={formErrors.business_address?.message || errors.business_address}
                disabled={submitting || !fieldsEnabled}
              />
            </Grid>

            {/* Business Address */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Website *"
                placeholder="Enter business Website"
                {...register("website", { required: "Website is required" })}
                error={!!formErrors.website || !!errors.website}
                helperText={formErrors.website?.message || errors.website}
                disabled={submitting || !fieldsEnabled}
              />
            </Grid>

            {/* Business Initial */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Business Initial *"
                placeholder="Enter up to 5 capital letters"
                {...register("business_initial", {
                  required: "Business initial is required",
                  pattern: {
                    value: /^[A-Z]{1,5}$/,
                    message: "Only up to 5 capital letters are allowed",
                  },
                })}
                error={!!formErrors.business_initial || !!errors.business_initial}
                helperText={formErrors.business_initial?.message || errors.business_initial}
                disabled={submitting || !fieldsEnabled}
              />
            </Grid>

            {/* Business Email */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Business Email *"
                placeholder="Enter business email"
                {...register("business_email", { required: "Business email is required" })}
                error={!!formErrors.business_email || !!errors.business_email}
                helperText={formErrors.business_email?.message || errors.business_email}
                disabled={submitting || !fieldsEnabled}
              />
            </Grid>

            {/* App Code */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="App Code *"
                placeholder="Enter app code"
                {...register("app_code", { required: "App code is required" })}
                error={!!formErrors.app_code || !!errors.app_code}
                helperText={formErrors.app_code?.message || errors.app_code}
                disabled={submitting || !fieldsEnabled}
              />
            </Grid>

            {/* Currency */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label="Currency *"
                value={selectedCurrencyId}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value)
                  setSelectedCurrencyId(val)
                  setValue("currency", val as any)
                }}
                error={!!formErrors.currency || !!errors.currency}
                helperText={formErrors.currency?.message || errors.currency}
                disabled={submitting || !fieldsEnabled}
              >
                <MenuItem value="">Select Currency</MenuItem>
                {currencies.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.label} {c.symbol ? `(${c.symbol})` : ""}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            {/* Contact Number */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Contact Number *"
                placeholder="Enter contact number"
                {...register("contact_number", { required: "Contact number is required" })}
                error={!!formErrors.contact_number || !!errors.contact_number}
                helperText={formErrors.contact_number?.message || errors.contact_number}
                disabled={submitting || !fieldsEnabled}
              />
            </Grid>

            {/* Mail Server */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Mail Server *"
                placeholder="Enter SMTP server address"
                {...register("mail_server", { required: "Mail server is required" })}
                error={!!formErrors.mail_server || !!errors.mail_server}
                helperText={formErrors.mail_server?.message || errors.mail_server}
                disabled={submitting || !fieldsEnabled}
              />
            </Grid>

            {/* Template Logo URL */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Template Logo URL *"
                placeholder="Enter template logo URL"
                {...register("marketing_template_url", { required: "Template logo URL is required" })}
                error={!!formErrors.marketing_template_url || !!errors.marketing_template_url}
                helperText={formErrors.marketing_template_url?.message || errors.marketing_template_url}
                disabled={submitting || !fieldsEnabled}
              />
            </Grid>

            {/* Client ID */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Client ID *"
                placeholder="Enter client ID"
                {...register("client_id", { required: "Client ID is required" })}
                error={!!formErrors.client_id || !!errors.client_id}
                helperText={formErrors.client_id?.message || errors.client_id}
                disabled={submitting || !fieldsEnabled}
              />
            </Grid>

            {/* Business Category */}
            <Grid item xs={12} sm={6}>
            <CustomTextField
  select
  fullWidth
  label="Timezone *"
  value={watch("timezone") || ""}
  onChange={(e) => setValue("timezone", e.target.value)}
  error={!!formErrors.timezone || !!errors.timezone}
  helperText={formErrors.timezone?.message || errors.timezone}
  disabled={submitting || !fieldsEnabled}
>
  <MenuItem value="Asia/Karachi">Pakistan (Asia/Karachi)</MenuItem>
  <MenuItem value="Europe/Berlin">Germany (Europe/Berlin)</MenuItem>
  <MenuItem value="America/New_York">United States (America/New_York)</MenuItem>
  <MenuItem value="Europe/Paris">France (Europe/Paris)</MenuItem>
  <MenuItem value="Asia/Dubai">Dubai (Asia/Dubai)</MenuItem>
</CustomTextField>

          </Grid>
          

           

            {/* User (Admin only, Create mode only) */}
            {isAdmin && mode === "create" && (
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  fullWidth
                  label="Assign User *"
                  {...register("user", { required: "User is required" })}
                  error={!!formErrors.user || !!errors.user}
                  helperText={formErrors.user?.message || errors.user}
                  disabled={submitting || !fieldsEnabled}
                >
                  <MenuItem value="">Select User</MenuItem>
                  {users.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.first_name || u.email}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
            )}

           {/* Business Logo */}
<Grid item xs={12} sm={6}>
  <Box>
    <CustomTextField
      fullWidth
      type="file"
      label="Business Logo"
      inputProps={{ accept: "image/*" }}
      onChange={(e) => {
        const input = e.target as HTMLInputElement
        const file = input.files?.[0]
        if (file) {
          setFileInputLogo(file)
          setLogoPreview(URL.createObjectURL(file)) // show immediate preview
        }
      }}
      disabled={submitting || !fieldsEnabled}
    />
    {logoPreview && (
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
          Preview:
        </Typography>
        <img
          src={logoPreview}
          alt="Business Logo"
          style={{ maxWidth: "120px", borderRadius: "6px", cursor: "pointer" }}
          onClick={() => window.open(logoPreview!, "_blank")}
        />
      </Box>
    )}
  </Box>
</Grid>

            {/* Business Document Upload */}
      {/* Business Document */}
<Grid item xs={12} sm={6}>
  <Box>
    <CustomTextField
      fullWidth
      type="file"
      label="Business Document"
      inputProps={{ accept: ".pdf,.doc,.docx,.jpg,.png" }}
      onChange={(e) => {
        const input = e.target as HTMLInputElement
        const file = input.files?.[0] || null
        if (file) {
          setFileInputDoc(file)
          setDocPreview(file.name) // just show file name when re-upload
        }
      }}
      disabled={submitting || !fieldsEnabled}
    />
    {docPreview && (
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
          Current Document:
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => window.open(docPreview!, "_blank")}
        >
          View Document
        </Button>
      </Box>
    )}
  </Box>
</Grid>


            {/* Submit Buttons */}
            <Grid item xs={12}>
              <Box className="flex gap-4">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting || !fieldsEnabled}
                  startIcon={submitting ? <CircularProgress size={18} /> : null}
                >
                  {mode === "create" ? "Create Business" : "Update Business"}
                </Button>
                {/* <Button
                  type="reset"
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    if (isEditing && currentBusiness) {
                      loadBusinessData(currentBusiness)
                    } else {
                      reset()
                    }
                  }}
                  disabled={submitting || !fieldsEnabled}
                >
                  Reset
                </Button> */}
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete Business"
        message="Are you sure you want to delete this business? This action cannot be undone."
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          if (selectedMenuId) {
            handleDeleteBusiness(selectedMenuId)
          }
        }}
      />

      {/* <Toaster position="top-right" /> */}
    </Card>
  )
}

export default BusinessPage
