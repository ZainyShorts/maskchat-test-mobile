// MUI Imports
import Grid from '@mui/material/Grid'
import ResturantDetails from './ResturantDetails'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const ResturantPreview = ({ params }: PageProps) => {
  return (
    <Grid container spacing={6}>
      {/* hello how are you */}
      <Grid item xs={6}>
        <ResturantDetails id={params.id} />
      </Grid>
    </Grid>
  )
}

export default ResturantPreview
