export type PricingPlanType = {
  title: string
  monthlyPrice: number
  currentPlan: boolean
  popularPlan: boolean
  subtitle: string
  imgSrc: string
  imgHeight: number
  imgWidth?: number
  yearlyPlan: {
    monthly: number
    annually: number
  }
  planBenefits: string[]
}

// export type PricingPlanType = {
//   title: string
//   imgSrc: string
//   subtitle: string
//   imgWidth?: number
//   imgHeight?: number
//   currentPlan: boolean
//   popularPlan: boolean
//   monthlyPrice: number
//   planBenefits: string[]
//   yearlyPlan: {
//     monthly: number
//     annually: number
//   }
// }
