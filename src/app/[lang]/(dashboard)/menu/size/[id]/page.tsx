// MUI Imports
'use client'
import Grid from '@mui/material/Grid'
import SizeListTable from '@/views/apps/user/list/SizeListTable'
import AddSize from './AddSize'
import { useState } from 'react'

type PageProps = {
  params: {
    id: string
  }

  searchParams?: { [key: string]: string | string[] | undefined }
}

const SizePreview = ({ params }: PageProps) => {
  const [isCreated, setIsCreated] = useState<boolean>(false)
  const handleStateChange = (isCreated: boolean): void => {
    setIsCreated(isCreated)
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AddSize id={params.id} isCreated={isCreated} onCreateSize={handleStateChange} />
      </Grid>
      <Grid item xs={12}>
        <SizeListTable id={params.id} isCreated={isCreated} />
      </Grid>
    </Grid>
  )
}

export default SizePreview
