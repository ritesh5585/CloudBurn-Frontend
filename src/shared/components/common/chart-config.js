// Shared chart colours — used by cost-charts and reports page
export const CHART_COLORS = [
  "oklch(0.7 0.18 250)",
  "oklch(0.75 0.15 165)",
  "oklch(0.8 0.12 85)",
  "oklch(0.7 0.18 320)",
  "oklch(0.65 0.2 25)",
  "oklch(0.6 0.15 200)",
  "oklch(0.72 0.16 140)",
  "oklch(0.68 0.14 280)",
]

// Shared tooltip style for Recharts — dark background matching app theme
export const chartTooltipStyle = {
  backgroundColor: "oklch(0.15 0.01 250)",
  border: "1px solid oklch(0.25 0.01 250)",
  borderRadius: "8px",
  fontSize: "12px",
}

// Shared axis tick style
export const axisTickStyle = { fontSize: 11, fill: "oklch(0.6 0 0)" }
