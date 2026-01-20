// MUI Imports
import Grid from '@mui/material/Grid'

import type { BusinessTypeForFile } from '@/types/apps/businessTypes'
import BusinessListTable from './apps/user/list/BusinessListTable'

const BusinessList = ({ orderData }: { orderData?: BusinessTypeForFile[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <BusinessListTable tableData={orderData} />
      </Grid>
    </Grid>
  )
}

export default BusinessList
