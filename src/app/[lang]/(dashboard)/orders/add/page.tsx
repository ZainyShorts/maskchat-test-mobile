// MUI Imports
import Grid from '@mui/material/Grid'
import AddOrderCard from './AddOrderCard'
import OrderMenuBar from './OrderMenuBar'

const InvoiceAdd = async () => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12} md={11}>
        <AddOrderCard />
      </Grid> */}
      <Grid item xs={12} md={11}>
        <OrderMenuBar />
      </Grid>
    </Grid>
  )
}

export default InvoiceAdd
