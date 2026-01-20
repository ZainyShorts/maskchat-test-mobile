// MUI Imports
import Grid from '@mui/material/Grid'
import UserListTable from './apps/user/list/UserListTable'
import type { UsersType } from '@/types/apps/userTypes'

const UserList = ({ userData }: { userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default UserList
