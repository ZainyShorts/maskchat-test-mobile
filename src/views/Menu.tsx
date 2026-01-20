// MUI Imports
import Grid from '@mui/material/Grid'

import MenuListTable from './apps/user/list/MenuListTable'
import type { MenuesType } from '@/types/apps/menuTypes'

const MenuList = ({ orderData }: { orderData?: MenuesType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <MenuListTable tableData={orderData} />
      </Grid>
    </Grid>
  )
}

export default MenuList
