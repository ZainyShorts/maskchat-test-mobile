// MUI Imports
import Grid from '@mui/material/Grid'

import type { ResturantsType } from '@/types/apps/restoTypes'
import RestoListTable from './apps/user/list/RestoListTable'
import type { getDictionary } from '@/utils/getDictionary'
import type { Mode, SystemMode } from '@core/types'

type ResturantsListProps = {
  dictionary?: Awaited<ReturnType<typeof getDictionary>>
  mode?: Mode
  systemMode?: SystemMode
  restoData?: ResturantsType[]
}

const ResturantsList = (props: ResturantsListProps) => {
  const { dictionary, mode, systemMode, restoData } = props

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <RestoListTable  />
      </Grid>
    </Grid>
  )
}

export default ResturantsList
