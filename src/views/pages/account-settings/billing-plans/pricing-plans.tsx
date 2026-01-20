"use client"

import * as React from "react"
import {
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Typography,
  Divider,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
  Tooltip, // added
} from "@mui/material"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined" // added
import { plans, featureGroups, PLAN_KEYS, type BillingCycle, type PlanKey } from "./data"

function SectionLabel({ children }: { children: React.ReactNode }) {
  const theme = useTheme()
  return (
    <Typography
      component="h3"
      sx={{
        fontWeight: 600,
        color: theme.palette.text.primary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        fontSize: "0.75rem",
      }}
    >
      {children}
    </Typography>
  )
}

function PriceDisplay({
  value,
  currency,
}: {
  value: number | "Custom"
  currency?: string
}) {
  const theme = useTheme()
  if (value === "Custom") {
    return (
      <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
        On request
      </Typography>
    )
  }
  return (
    <Box display="flex" alignItems="baseline" gap={0.5}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
        {currency ?? "€"}
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        / monthly
      </Typography>
    </Box>
  )
}

function PlanCard({
  title,
  priceMonthly,
  priceAnnually,
  badge,
  highlight,
  cta,
  color = "primary",
  currency = "€",
  cycle,
}: {
  title: string
  priceMonthly: number | "Custom"
  priceAnnually: number | "Custom"
  badge?: string
  highlight?: boolean
  cta: string
  color?: "primary" | "secondary" | "info" | "warning" | "success" | "error"
  currency?: string
  cycle: BillingCycle
}) {
  const theme = useTheme()
  const borderColor = highlight ? alpha(theme.palette[color].main, 0.4) : theme.palette.divider

  const bgHover = highlight
    ? alpha(theme.palette[color].main, theme.palette.mode === "light" ? 0.08 : 0.16)
    : alpha(theme.palette.action.hover, 0.3)

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        transition: theme.transitions.create(["transform", "box-shadow", "border-color"]),
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: highlight ? 6 : 3,
          borderColor: highlight ? theme.palette[color].main : theme.palette.divider,
          backgroundColor: bgHover,
        },
      }}
    >
      <CardContent sx={{ p: 3, display: "grid", gap: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.2,
              textTransform: "none",
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>
          {badge ? (
            <Chip
              size="small"
              label={badge}
              color={color}
              variant={highlight ? "filled" : "outlined"}
              sx={{
                fontWeight: 600,
              }}
            />
          ) : null}
        </Box>

        <PriceDisplay value={cycle === "monthly" ? priceMonthly : priceAnnually} currency={currency} />

        <Button
          fullWidth
          variant={highlight ? "contained" : "outlined"}
          color={color}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            py: 1.25,
          }}
        >
          {cta}
        </Button>
      </CardContent>
    </Card>
  )
}

function LegendCell({ children }: { children: React.ReactNode }) {
  const theme = useTheme()
  return (
    <TableCell
      sx={{
        fontWeight: 600,
        color: theme.palette.text.secondary,
        width: { xs: "55%", md: "28%" },
      }}
    >
      {children}
    </TableCell>
  )
}

function ValueCell({
  value,
  emphasized = false,
}: {
  value: boolean | string | undefined
  emphasized?: boolean
}) {
  const theme = useTheme()
  const isBool = typeof value === "boolean"
  const isTrue = value === true
  const isFalse = value === false

  return (
    <TableCell
      align="center"
      sx={{
        color: theme.palette.text.primary,
        fontWeight: emphasized ? 700 : 500,
      }}
    >
      {isBool ? (
        isTrue ? (
          <CheckRoundedIcon color="success" fontSize="small" />
        ) : (
          <CloseRoundedIcon color="disabled" fontSize="small" />
        )
      ) : (
        <Typography variant="body2" color="text.primary">
          {value ?? "—"}
        </Typography>
      )}
    </TableCell>
  )
}

export default function PricingTable() {
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down("md"))
  const [cycle, setCycle] = React.useState<BillingCycle>("monthly")

  // Normalize plans for rendering
  const byKey: Record<PlanKey, (typeof plans)[number]> = plans.reduce(
    (acc, p) => {
      acc[p.key] = p
      return acc
    },
    {} as Record<PlanKey, (typeof plans)[number]>,
  )

  return (
    <Box
      component="section"
      className="container mx-auto"
      sx={{ py: { xs: 4, md: 8 }, maxWidth: 1200, px: { xs: 2, md: 3 } }}
    >
      {/* Header */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems={{ md: "center" }}
        justifyContent="space-between"
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
            Pricing
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose the plan that fits your business. Switch billing anytime.
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" gap={1}>
          <SectionLabel>Billing</SectionLabel>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={cycle}
            onChange={(_, value) => value && setCycle(value)}
            color="primary"
            sx={{
              borderRadius: 999,
              "& .MuiToggleButtonGroup-grouped": {
                textTransform: "none",
                px: 2,
                border: "none",
                "&.Mui-selected": {
                  fontWeight: 700,
                },
              },
            }}
          >
            <ToggleButton value="annually">Annually</ToggleButton>
            <ToggleButton value="monthly">Monthly</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>

      {/* Plan cards */}
      <Grid container spacing={2} mb={4}>
        {plans.map((p) => (
          <Grid key={p.key} item xs={12} sm={6} md={3}>
            <PlanCard
              title={p.title}
              badge={p.badge}
              highlight={p.highlight}
              cta={p.ctaLabel}
              color={(p.color as any) ?? "primary"}
              priceMonthly={p.price.monthly}
              priceAnnually={p.price.annually}
              currency={p.price.currency}
              cycle={cycle}
            />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Feature matrix */}
      {featureGroups.map((group) => (
        <Box key={group.title} sx={{ mb: 4 }}>
          <SectionLabel>{group.title}</SectionLabel>

          {/* Wide table on md+; stacked list on mobile for readability */}
          {!hidden ? (
            <Box
              sx={{
                mt: 1.5,
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
                borderRadius: 2,
              }}
            >
              <Table
                aria-label="Feature comparison"
                size="small"
                sx={{
                  minWidth: 720, // prevents cramped columns on smaller laptops
                  borderCollapse: "separate",
                  borderSpacing: "0 6px",
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        borderBottom: "none",
                        position: "sticky", // sticky header
                        top: 0,
                        zIndex: 1,
                        backgroundColor: (t) => t.palette.background.paper,
                      },
                    }}
                  >
                    <LegendCell>Feature</LegendCell>
                    {PLAN_KEYS.map((k) => (
                      <TableCell
                        key={k}
                        align="center"
                        sx={{
                          fontWeight: k === "PRO" ? 800 : 700,
                          color: (t) => (k === "PRO" ? t.palette.text.primary : t.palette.text.secondary),
                        }}
                      >
                        {byKey[k].title}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {group.rows.map((row) => (
                    <TableRow
                      key={row.label}
                      sx={{
                        "& td": {
                          backgroundColor: (t) =>
                            t.palette.mode === "light"
                              ? alpha(t.palette.common.black, 0.015)
                              : alpha(t.palette.common.white, 0.03),
                          borderTop: (t) => `1px solid ${t.palette.divider}`,
                          borderBottom: (t) => `1px solid ${t.palette.divider}`,
                        },
                      }}
                    >
                      <LegendCell>
                        <Box display="flex" alignItems="center" gap={1.0}>
                          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                            {row.label}
                          </Typography>
                          {row.hint ? (
                            <Tooltip title={row.hint} arrow>
                              <InfoOutlinedIcon
                                fontSize="small"
                                sx={{ color: (t) => t.palette.text.disabled, cursor: "help" }}
                              />
                            </Tooltip>
                          ) : null}
                        </Box>
                      </LegendCell>
                      {PLAN_KEYS.map((k) => (
                        <ValueCell key={k} value={row.values[k]} emphasized={k === "PRO"} />
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Stack gap={1.5} mt={1.5}>
              {group.rows.map((row) => (
                <Card variant="outlined" key={row.label} sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={1}>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {row.label}
                      </Typography>
                      {row.hint ? (
                        <Tooltip title={row.hint} arrow>
                          <InfoOutlinedIcon color="disabled" fontSize="small" />
                        </Tooltip>
                      ) : null}
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    <Grid container spacing={1}>
                      {PLAN_KEYS.map((k) => (
                        <Grid item xs={6} key={k}>
                          <Typography variant="caption" color="text.secondary">
                            {byKey[k].title}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            {typeof row.values[k] === "boolean" ? (
                              row.values[k] ? (
                                <CheckRoundedIcon color="success" fontSize="small" />
                              ) : (
                                <CloseRoundedIcon color="disabled" fontSize="small" />
                              )
                            ) : (
                              <Typography variant="body2">{row.values[k] as string}</Typography>
                            )}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      ))}
    </Box>
  )
}
