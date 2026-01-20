// MUI Imports
import Grid from '@mui/material/Grid'

import TelegramDetails from './TelegramDetails'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const TelegramPreview = ({ params }: PageProps) => {
  return (
    <Grid container spacing={6}>
      {/* hello how are you */}
      <Grid item xs={6}>
        <TelegramDetails id={params.id} />
      </Grid>
    </Grid>
  )
}

export default TelegramPreview
