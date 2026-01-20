// MUI Imports
import Grid from '@mui/material/Grid'
import BusinessDetails from './BusinessDetails'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const BusinessPreview = ({ params }: PageProps) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <BusinessDetails id={params.id} />
      </Grid>
    </Grid>
  )
}

export default BusinessPreview
