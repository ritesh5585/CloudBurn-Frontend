"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { generateCostTrendData, serviceCosts, formatCurrency } from "@/api/mock-data"
import { CHART_COLORS, chartTooltipStyle, axisTickStyle } from "@/shared/components/common/chart-config"

const TIME_RANGES = ["7d", "30d", "90d"]

function ChartContainer({ title, children, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {actions}
        </CardHeader>
        <CardContent className="pt-0">{children}</CardContent>
      </Card>
    </motion.div>
  )
}

export function CostTrendChart() {
  const [timeRange, setTimeRange] = useState("30d")

  const data = useMemo(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    return generateCostTrendData(days)
  }, [timeRange])

  return (
    <ChartContainer
      title="Cost Over Time"
      actions={
        <div className="flex gap-1">
          {TIME_RANGES.map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      }
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0 / 0.2)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={axisTickStyle}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <YAxis
              tick={axisTickStyle}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={chartTooltipStyle}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value) => [formatCurrency(value), "Cost"]}
            />
            <Line type="monotone" dataKey="cost" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="forecast" stroke={CHART_COLORS[1]} strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-primary rounded" />
          <span className="text-muted-foreground">Actual Cost</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-chart-2 rounded" />
          <span className="text-muted-foreground">Forecast</span>
        </div>
      </div>
    </ChartContainer>
  )
}

export function ServiceBreakdownChart() {
  const [view, setView] = useState("bar")

  const data = useMemo(() =>
    serviceCosts?.slice(0, 6).map((service) => ({
      name: service?.name || 'Unknown',
      cost: service?.cost || 0,
    })) || [],
  [/* dependencies can go here if serviceCosts becomes dynamic */])

  return (
    <ChartContainer
      title="Service Breakdown"
      actions={
        <div className="flex gap-1">
          {["bar", "pie"].map((v) => (
            <Button
              key={v}
              variant={view === v ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs capitalize"
              onClick={() => setView(v)}
            >
              {v}
            </Button>
          ))}
        </div>
      }
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {view === "bar" ? (
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0 / 0.2)" horizontal={false} />
              <XAxis type="number" tick={axisTickStyle} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={axisTickStyle} tickLine={false} axisLine={false} width={100} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [formatCurrency(value), "Cost"]} />
              <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="cost">
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [formatCurrency(value), "Cost"]} />
              <Legend formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}
