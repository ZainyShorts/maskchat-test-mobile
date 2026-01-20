// MUI Imports
import Grid from '@mui/material/Grid'

import OrderListTable from './apps/user/list/OrderListTable'
import type { OrdersType } from '@/types/apps/orderTypes'
// import OrderCards from './OrderCards'

const OrdersList = ({ orderData }: { orderData?: OrdersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <OrderCards /> */}
      </Grid>
      <Grid item xs={12}>
        <OrderListTable tableData={orderData} />
      </Grid>
    </Grid>
  )
}

export default OrdersList
