'use client'
import Grid from '@mui/material/Grid'
import AddToppings from './AddToppings'
import ToppingListTable from '@/views/apps/user/list/ToppingListTable'
import { useState } from 'react'

type PageProps = {
  params: {
    id: string
  }

  searchParams?: { [key: string]: string | string[] | undefined }
}

const ToppingsPreview = ({ params }: PageProps) => {
  const [isCreated, setIsCreated] = useState<boolean>(false)
  const handleStateChange = (isCreated: boolean): void => {
    setIsCreated(isCreated)
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AddToppings id={params.id} isCreated={isCreated} onCreateTopping={handleStateChange} />
      </Grid>
      <Grid item xs={12}>
        <ToppingListTable isCreated={isCreated} id={params.id} />
      </Grid>
    </Grid>
  )
}

export default ToppingsPreview
