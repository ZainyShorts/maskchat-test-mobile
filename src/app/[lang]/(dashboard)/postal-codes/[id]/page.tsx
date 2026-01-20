// MUI Imports
import Grid from '@mui/material/Grid'
import PostalCodesDetails from './PostalCodesDetails'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const PostalCodesPreview = ({ params }: PageProps) => {
  return (
    <Grid container spacing={6}>
      {/* hello how are you */}
      <Grid item xs={6}>
        <PostalCodesDetails id={params.id} />
      </Grid>
    </Grid>
  )
}

export default PostalCodesPreview
