// MUI Imports
import Grid from '@mui/material/Grid'

import OrderReturnDetails from './OrderReturnDetails'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const OrderReturnPreview = ({ params }: PageProps) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <OrderReturnDetails id={params.id} />
      </Grid>
    </Grid>
  )
}

export default OrderReturnPreview
