import Pricing from '@/components/pricing'

import { data } from '@/data/pricingData' // Adjust the path as necessary

// Main Page Component
const PricePage = () => {
  return <Pricing data={data} />
}

export default PricePage
