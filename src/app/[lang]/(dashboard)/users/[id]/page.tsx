// MUI Imports
import Grid from '@mui/material/Grid'
import UserDetails from './UserDetails'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const UserPreview = ({ params }: PageProps) => {
  return (
    <Grid container spacing={6}>
      {/* hello how are you */}
      <Grid item xs={6}>
        <UserDetails id={params.id} />
      </Grid>
    </Grid>
  )
}

export default UserPreview
