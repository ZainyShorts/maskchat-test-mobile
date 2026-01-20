// MUI Imports
import Grid from '@mui/material/Grid'
import MenuDetails from './MenuDetails'

// Component Imports
// import UserDetails from './UserDetails'
// import UserPlan from './UserPlan'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const MenuPreview = ({ params }: PageProps) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <MenuDetails id={params.id} />
      </Grid>
    </Grid>
  )
}

export default MenuPreview
