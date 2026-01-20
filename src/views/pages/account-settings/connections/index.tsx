'use client'

// MUI Imports

import Grid from '@mui/material/Grid'
import WhatsppAppListTable from '@/views/apps/user/list/WhatsAppListTable'
import InstagramTableList from '@/views/apps/user/list/InstagramListTable'
import FaceBookListTable from '@/views/apps/user/list/FaceBookListTable'
import TelagramListTable from '@/views/apps/user/list/TelagramListTable'
import ShopifyListTable from '@/views/apps/user/list/ShopifyListTable'
const Connections = () => {
  return (
    <Grid container spacing={4}>
      
      <Grid item xs={12}>
        <ShopifyListTable />
      </Grid>
      <Grid item xs={12}>
        <WhatsppAppListTable />
      </Grid>
      <Grid item xs={12}>
        <FaceBookListTable />
      </Grid>
      <Grid item xs={12}>
        <InstagramTableList />
      </Grid>
      <Grid item xs={12}>
        <TelagramListTable />
      </Grid>
    </Grid>
  )
}

export default Connections
