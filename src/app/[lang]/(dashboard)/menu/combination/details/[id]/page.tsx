// MUI Imports
import Grid from '@mui/material/Grid'
import ToppingDetails from './ToppingDetails'

type PageProps = {
  params: {
    id: string
  }

  searchParams?: { [key: string]: string | string[] | undefined }
}

const ToppingDetailsPreview = ({ params }: PageProps) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <ToppingDetails id={params.id} />
      </Grid>
    </Grid>
  )
}

export default ToppingDetailsPreview
