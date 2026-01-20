// MUI Imports
import Grid from '@mui/material/Grid'
import AddReturnOrder from './AddReturnOrder'

const ReturnOrderPage = async () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={11}>
        <AddReturnOrder />
      </Grid>
    </Grid>
  )
}

export default ReturnOrderPage
