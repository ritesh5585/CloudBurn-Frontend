"use client"

import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, Ghost } from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { cn } from "@/utils/utils"
import { kpiData, formatCurrency } from "@/api/mock-data"

// Variant border/bg classes — defined outside to avoid per-render recreation
const variantStyles = {
  default: "border-border",
  warning: "border-warning/30 bg-warning/5",
  success: "border-success/30 bg-success/5",
  danger: "border-destructive/30 bg-destructive/5",
}

function KPICard({ title, value, change, icon, trend, subtitle, delay = 0, variant = "default", showProgress = false }) {
  return (
    <div className="animate-fade-in" style={{ animationDelay: `${delay * 1000}ms` }}>
      <Card className={cn("relative overflow-hidden", variantStyles[variant])}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold tracking-tight font-mono">{value}</p>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              {change !== undefined && (
                <div className="flex items-center gap-1">
                  {trend === "up" && <TrendingUp className="w-4 h-4 text-success" />}
                  {trend === "down" && <TrendingDown className="w-4 h-4 text-destructive" />}
                  <span className={cn(
                    "text-sm font-medium",
                    trend === "up" && "text-success",
                    trend === "down" && "text-destructive"
                  )}>
                    {change > 0 ? "+" : ""}{change}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              )}
            </div>
            <div className="p-3 rounded-xl bg-primary/10 shrink-0">
              {icon}
            </div>
          </div>

          {/* Progress bar — only shown when explicitly requested */}
          {showProgress && (
            <div className="mt-4">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    Number(value) > 90 ? "bg-destructive" : Number(value) > 75 ? "bg-warning" : "bg-success"
                  )}
                  style={{ width: `${Math.min(Number(value), 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Total Cost"
        value={formatCurrency(kpiData.totalCost)}
        change={8.2}
        trend="up"
        icon={<DollarSign className="w-5 h-5 text-primary" />}
        delay={0}
      />
      <KPICard
        title="Forecast"
        value={formatCurrency(kpiData.forecast)}
        subtitle="End of month projection"
        icon={<TrendingUp className="w-5 h-5 text-primary" />}
        delay={0.05}
      />
      <KPICard
        title="Budget Usage"
        value={kpiData.budgetUsed}
        subtitle={`${formatCurrency(kpiData.totalBudget)} total budget`}
        icon={<Target className="w-5 h-5 text-primary" />}
        delay={0.1}
        showProgress
        variant={kpiData.budgetUsed > 90 ? "danger" : kpiData.budgetUsed > 75 ? "warning" : "default"}
      />
      <KPICard
        title="Savings Opportunity"
        value={formatCurrency(kpiData.savingsOpportunity)}
        subtitle={`${kpiData.zombieCount} zombie resources`}
        icon={<Ghost className="w-5 h-5 text-primary" />}
        delay={0.15}
        variant="success"
      />
    </div>
  )
}

export function AlertKPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KPICard
        title="Active Alerts"
        value={kpiData.activeAlerts}
        icon={<AlertTriangle className="w-5 h-5 text-warning" />}
        delay={0}
        variant="warning"
      />
      <KPICard
        title="Zombie Resources"
        value={kpiData.zombieCount}
        icon={<Ghost className="w-5 h-5 text-destructive" />}
        delay={0.05}
        variant="danger"
      />
      <KPICard
        title="Monthly Waste"
        value={formatCurrency(kpiData.zombieWaste)}
        icon={<DollarSign className="w-5 h-5 text-destructive" />}
        delay={0.1}
        variant="danger"
      />
    </div>
  )
}
