'use client'

// MUI Imports

import Grid from '@mui/material/Grid'

import PostalCodesComp from '@/components/PostalCodesComp'
import PostalCodesListTable from '@/views/apps/user/list/PostalCodesListTable'

const PostalCodes = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <PostalCodesComp />
      </Grid>
      <Grid item xs={12}>
        <PostalCodesListTable />
      </Grid>
    </Grid>
  )
}

export default PostalCodes
