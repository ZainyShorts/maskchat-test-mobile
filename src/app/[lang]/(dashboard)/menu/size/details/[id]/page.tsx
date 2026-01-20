// MUI Imports
import Grid from '@mui/material/Grid'
import SizeDetails from './SizeDetails'

type PageProps = {
  params: {
    id: string
  }

  searchParams?: { [key: string]: string | string[] | undefined }
}

const SizeDetailsPreview = ({ params }: PageProps) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SizeDetails id={params.id} />
      </Grid>
    </Grid>
  )
}

export default SizeDetailsPreview
