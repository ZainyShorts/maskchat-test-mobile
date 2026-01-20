import { CardContent, Typography, Button, Chip } from '@mui/material'
import classnames from 'classnames'

import type { PricingPlanType } from '@/types/pages/pricingTypes'

type PlanDetailsProps = {
  pricingPlan: 'monthly' | 'annually'
  data: PricingPlanType
}

const PlanDetails = ({ data, pricingPlan }: PlanDetailsProps) => {
  return (
    <CardContent
      className={classnames('relative border rounded pli-5 pbs-[3.75rem] flex flex-col gap-5', {
        'border-primary': data.popularPlan
      })}
    >
      {data.popularPlan && (
        <Chip
          color='primary'
          label='Popular'
          size='small'
          className='absolute block-start-4 inline-end-5'
          variant='tonal'
        />
      )}
      <div className='flex justify-center'>
        <img
          src={data.imgSrc}
          height={data.imgHeight}
          width={data.imgWidth}
          alt={`${data.title.toLowerCase().replace(' ', '-')}-img`}
        />
      </div>
      <Typography variant='h4' className='text-center'>
        {data.title}
      </Typography>
      <Typography className='text-center'>{data.subtitle}</Typography>

      <div className='relative mbe-4'>
        <div className='flex justify-center'>
          <Typography component='sup' className='self-start font-medium'>
            $
          </Typography>
          <Typography variant='h1' component='span' color='primary'>
            {pricingPlan === 'monthly' ? data.monthlyPrice : data.yearlyPlan.monthly}
          </Typography>
          <Typography component='sub' className='self-end font-medium'>
            /month
          </Typography>
        </div>
        {pricingPlan === 'annually' && data.monthlyPrice !== 0 && (
          <Typography variant='caption' className='absolute inline-end-1/2 translate-x-[50%]'>
            USD {data.yearlyPlan.annually}/year
          </Typography>
        )}
      </div>

      <div className='flex flex-col gap-4'>
        {data.planBenefits.map((benefit, index) => (
          <Typography key={index} className='flex items-center gap-2'>
            <i className='tabler-circle-filled text-[8px]' /> {benefit}
          </Typography>
        ))}
      </div>

      <Button
        fullWidth
        color={data.currentPlan ? 'success' : 'primary'}
        variant={data.popularPlan ? 'contained' : 'tonal'}
      >
        {data.currentPlan ? 'Your Current Plan' : 'Upgrade'}
      </Button>
    </CardContent>
  )
}

export default PlanDetails
