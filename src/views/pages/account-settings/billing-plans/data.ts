// Local type to keep this 2-file implementation self-contained.
// In your app you can replace with: import type { ThemeColor } from '@core/types'
export type ThemeColor = "primary" | "secondary" | "success" | "info" | "warning" | "error"

export const PLAN_KEYS = ["BASIC", "PRO", "ADVANCED", "CUSTOM"] as const
export type PlanKey = (typeof PLAN_KEYS)[number]

export type BillingCycle = "monthly" | "annually"

export type Plan = {
  key: PlanKey
  title: string
  badge?: string
  color?: ThemeColor
  highlight?: boolean
  ctaLabel: string
  price: {
    monthly: number | "Custom"
    annually: number | "Custom"
    currency?: string
  }
  note?: string
}

export type FeatureRow = {
  label: string
  // The value can be boolean (render ✓/✗) or string (render text/price)
  values: Partial<Record<PlanKey, boolean | string>>
  hint?: string
}

export type FeatureGroup = {
  title: string
  rows: FeatureRow[]
}

// Pricing plans — names exactly as requested: BASIC, PRO, ADVANCED, CUSTOM.
export const plans: Plan[] = [
  {
    key: "BASIC",
    title: "BASIC",
    ctaLabel: "Try for free",
    color: "secondary",
    price: { monthly: 29, annually: 24, currency: "€" },
    note: "/ monthly",
  },
  {
    key: "PRO",
    title: "PRO",
    ctaLabel: "Try for free",
    color: "primary",
    highlight: true,
    badge: "Popular",
    price: { monthly: 79, annually: 64, currency: "€" },
    note: "/ monthly",
  },
  {
    key: "ADVANCED",
    title: "ADVANCED",
    ctaLabel: "Try for free",
    color: "info",
    price: { monthly: 149, annually: 119, currency: "€" },
    note: "/ monthly",
  },
  {
    key: "CUSTOM",
    title: "CUSTOM",
    ctaLabel: "Book a demo",
    color: "warning",
    price: { monthly: "Custom", annually: "Custom", currency: "€" },
    note: "on request",
  },
]

// Feature matrix (dummy data but structured professionally)
// Matches sections seen in the reference with representative rows.
export const featureGroups: FeatureGroup[] = [
  {
    title: "WhatsApp conversations",
    rows: [
      {
        label: "Initiated by contact",
        values: { BASIC: "Free", PRO: "Free", ADVANCED: "Free", CUSTOM: "Free" },
      },
      {
        label: "Initiated by the company",
        hint: "depends on region",
        values: {
          BASIC: "€0 to €0.04",
          PRO: "€0 to €0.04",
          ADVANCED: "€0 to €0.04",
          CUSTOM: "€0 to €0.04",
        },
      },
      {
        label: "Superchat bonus",
        values: { BASIC: false, PRO: "€10", ADVANCED: "€25", CUSTOM: "On request" },
      },
    ],
  },
  {
    title: "Functions",
    rows: [
      { label: "Universal Inbox", values: { BASIC: true, PRO: true, ADVANCED: true, CUSTOM: true } },
      { label: "Templates", values: { BASIC: true, PRO: true, ADVANCED: true, CUSTOM: true } },
      { label: "Chat labels", values: { BASIC: true, PRO: true, ADVANCED: true, CUSTOM: true } },
      { label: "Employee assignment", values: { BASIC: false, PRO: true, ADVANCED: true, CUSTOM: true } },
    ],
  },
  {
    title: "Admin & Security",
    rows: [
      { label: "Role-based access", values: { BASIC: true, PRO: true, ADVANCED: true, CUSTOM: true } },
      { label: "Two-Factor Authentication", values: { BASIC: false, PRO: false, ADVANCED: true, CUSTOM: true } },
    ],
  },
  {
    title: "Support",
    rows: [
      { label: "Onboarding", values: { BASIC: false, PRO: true, ADVANCED: true, CUSTOM: true } },
      {
        label: "Chat support",
        values: { BASIC: "Default", PRO: "Standard", ADVANCED: "Premium", CUSTOM: "Enterprise" },
      },
      { label: "Customer Success Manager", values: { BASIC: false, PRO: true, ADVANCED: true, CUSTOM: true } },
      { label: "User training", values: { BASIC: false, PRO: false, ADVANCED: true, CUSTOM: true } },
      { label: "Account Manager", values: { BASIC: false, PRO: false, ADVANCED: true, CUSTOM: true } },
    ],
  },
]
