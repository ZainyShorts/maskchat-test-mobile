"use client"

import type React from "react"

// React Imports
import { useState, useEffect } from "react"

// MUI Imports
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import MenuItem from "@mui/material/MenuItem"
import Alert from "@mui/material/Alert"
import Collapse from "@mui/material/Collapse"

// Component Imports
import CustomTextField from "@core/components/mui/TextField"

// API Imports
import { updateStore } from "@/api/shopify" // Adjust path as needed

interface ShopifyAccount {
  id: number
  user: number
  admin_access_token: string
  shopify_domain_url: string
  shopify_version: string
  created_at: string
  updated_at: string
}

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: ShopifyAccount
  onTypeAdded?: () => void
}

type AlertState = {
  show: boolean
  type: "success" | "error"
  message: string
}

const EditShopifyInfo = ({ open, setOpen, data, onTypeAdded }: Props) => {
  const [formData, setFormData] = useState({
    admin_access_token: "",
    shopify_domain_url: "",
    shopify_version: "",
  })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: "success",
    message: "",
  })

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
    if (data && open) {
      setFormData({
        admin_access_token: data.admin_access_token,
        shopify_domain_url: data.shopify_domain_url,
        shopify_version: data.shopify_version,
      })
    }
  }, [data, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!data?.id) {
      showAlert("error", "No account ID found")
      return
    }

    setLoading(true)

    try {
      // Call your actual API function
      const response = await updateStore(data.id, formData)
      console.log("Store updated successfully:", response)

      showAlert("success", "Shopify account updated successfully")

      // Close dialog and call callback after showing success message
      setTimeout(() => {
        setOpen(false)
        onTypeAdded?.()
      }, 2000)
    } catch (error: any) {
      console.error("Error updating store:", error)

      // Handle different types of errors
      if (error?.data?.message) {
        showAlert("error", error.data.message)
      } else if (error?.message) {
        showAlert("error", error.message)
      } else {
        showAlert("error", "Error updating Shopify account")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setAlert({ show: false, type: "success", message: "" })
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Shopify Account</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Alert Message */}
          <Collapse in={alert.show} sx={{ mb: 2 }}>
            <Alert severity={alert.type} onClose={() => setAlert((prev) => ({ ...prev, show: false }))} sx={{ mb: 2 }}>
              {alert.message}
            </Alert>
          </Collapse>

          <Grid container spacing={5}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label="Admin Access Token"
                type="password"
                value={formData.admin_access_token}
                onChange={(e) => setFormData((prev) => ({ ...prev, admin_access_token: e.target.value }))}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label="Shopify Domain URL"
                type="url"
                placeholder="https://yourstore.myshopify.com"
                value={formData.shopify_domain_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, shopify_domain_url: e.target.value }))}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label="Shopify Version"
                value={formData.shopify_version}
                onChange={(e) => setFormData((prev) => ({ ...prev, shopify_version: e.target.value }))}
                required
              >
                <MenuItem value="2025-01">2025-01</MenuItem>
                <MenuItem value="2024-01">2024-01</MenuItem>
                <MenuItem value="2023-10">2023-10</MenuItem>
                <MenuItem value="2023-07">2023-07</MenuItem>
                <MenuItem value="2023-04">2023-04</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Updating..." : "Update Account"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditShopifyInfo
