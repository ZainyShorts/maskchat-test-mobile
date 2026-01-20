// MUI Imports
import Grid from '@mui/material/Grid'
import ChatGptDetails from './ChatGptDetails'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

const ChatGptPreview = ({ params }: PageProps) => {
  return (
    <Grid container spacing={6}>
      {/* hello how are you */}
      <Grid item xs={6}>
        <ChatGptDetails id={params.id} />
      </Grid>
    </Grid>
  )
}

export default ChatGptPreview
