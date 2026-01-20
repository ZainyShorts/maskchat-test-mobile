// MUI Imports
import Grid from '@mui/material/Grid'
import FeedToGptDetails from './FeedToGptDetails'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const FeedToGptPreview = ({ params }: PageProps) => {
  return (
    <Grid container spacing={6}>
      {/* hello how are you */}
      <Grid item xs={6}>
        <FeedToGptDetails id={params.id} />
      </Grid>
    </Grid>
  )
}

export default FeedToGptPreview
