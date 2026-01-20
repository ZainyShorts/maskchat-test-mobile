"use client"// React

import React from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'

// Store
import { useAuthStore } from '@/store/authStore'

// Components
import BusinessPage from './businessPage'
import BusinessListTable from '@/views/apps/user/list/SettingBusinessTable'

const BusinessList = () => {
  const { user } = useAuthStore()
const isAdmin = Number(user?.user_type) === 2

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {isAdmin ? <BusinessListTable /> : <BusinessPage />}
      </Grid>
    </Grid>
  )
}

export default BusinessList
