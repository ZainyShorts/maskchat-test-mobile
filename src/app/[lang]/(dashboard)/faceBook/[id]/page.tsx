// MUI Imports
import Grid from '@mui/material/Grid'

import FaceBookDetails from './FaceBookDetails'
// import MenuDetails from './MenuDetails'

// Component Imports
// import UserDetails from './UserDetails'
// import UserPlan from './UserPlan'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const WhatsAppPreview = ({ params }: PageProps) => {
  return (
    <Grid container spacing={6}>
      {/* hello how are you */}
      <Grid item xs={6}>
        <FaceBookDetails id={params.id} />
      </Grid>
    </Grid>
  )
}

export default WhatsAppPreview
