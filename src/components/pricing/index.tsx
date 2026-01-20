'use client'
import { useState } from 'react'
import type { ChangeEvent } from 'react'
import Grid from '@mui/material/Grid'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'

import PlanDetails from './PlanDetails'
import type { PricingPlanType } from '@/types/pages/pricingTypes'
import Button from '@mui/material/Button'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { useParams, useRouter } from 'next/navigation'

type PricingProps = {
  data: PricingPlanType[]
}

const Pricing = ({ data }: PricingProps) => {
  const [pricingPlan, setPricingPlan] = useState<'monthly' | 'annually'>('annually')
  const router = useRouter()
  const { lang: locale } = useParams()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPricingPlan(e.target.checked ? 'annually' : 'monthly')
  }
  const handleBackToHome = () => {
    router.push(getLocalizedUrl('/home', locale as Locale))
  }

  return (
    <div className='flex flex-col gap-6' style={{ padding: '10px' }}>
      <div className='flex flex-col justify-center items-center gap-2'>
        <Typography variant='h3'>Pricing Plans</Typography>

        <Typography>
          <Button variant='contained' color='primary' onClick={handleBackToHome} style={{ marginRight: '10px' }}>
            Back To Home
          </Button>
          All plans include 40+ advanced tools and features to boost your product. Choose the best plan to fit your
          needs.
        </Typography>
        <div className='flex justify-center items-center'>
          <InputLabel htmlFor='pricing-switch' className='cursor-pointer'>
            Monthly
          </InputLabel>
          <Switch id='pricing-switch' onChange={handleChange} checked={pricingPlan === 'annually'} />
          <InputLabel htmlFor='pricing-switch' className='cursor-pointer'>
            Annually
          </InputLabel>
        </div>
      </div>

      <Grid container spacing={6}>
        {data.map((plan, index) => (
          <Grid item xs={12} md={4} key={index}>
            <PlanDetails data={plan} pricingPlan={pricingPlan} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default Pricing
