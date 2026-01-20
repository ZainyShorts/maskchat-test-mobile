"use client"

import type React from "react"

// React Imports
import { useState, useEffect, useCallback } from "react"

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

// API Import
import { createStore } from "@/api/shopify" // Adjust the path to match your project structure
import { getAllBusiness } from "@/api/business"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  onTypeAdded?: () => void
}

type AlertState = {
  show: boolean
  type: "success" | "error"
  message: string
}

const AddShopifyForm = ({ open, setOpen, onTypeAdded }: Props) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Submitting form data:", formData)
      const response = await createStore(formData)
      console.log("API Response:", response)

      showAlert("success", "Shopify account added successfully")

      // Close dialog and reset form after showing success message
      setTimeout(() => {
        setOpen(false)
        onTypeAdded?.()
        // Reset form data
        setFormData({
          admin_access_token: "",
          shopify_domain_url: "",
          shopify_version: "",
        })
      }, 2000)
    } catch (error: any) {
      console.error("Error creating store:", error)

      // Handle different error types
      let errorMessage = "Error adding Shopify account"
      if (error?.data?.message) {
        errorMessage = "Error adding Shopify account"
      } else if (error?.message) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = "Error adding Shopify account"
      }

      showAlert("error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setFormData({
      admin_access_token: "",
      shopify_domain_url: "",
      shopify_version: "",
    })
    setAlert({ show: false, type: "success", message: "" })
  }

  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Shopify Account</DialogTitle>
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
                placeholder="https://yourstore.myshopify.com/"
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
            {loading ? "Adding..." : "Add Account"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddShopifyForm

