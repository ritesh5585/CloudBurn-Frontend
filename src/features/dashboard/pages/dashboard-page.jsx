"use client"

import { KPICards } from "@/features/dashboard/components/kpi-cards"
import { CostTrendChart, ServiceBreakdownChart } from "@/features/dashboard/components/cost-charts"
import { AlertPanel } from "@/features/alerts/components/alert-panel"
import { AIInsightsPanel } from "@/features/ai/components/ai-insights"
import { RecentActivity } from "@/features/dashboard/components/recent-activity"
import { FlowIndicator } from "@/features/dashboard/components/flow-indicator"
import { PageHeader } from "@/shared/components/common/page-header"
import { useAuth } from "@/store/auth-context"

export default function DashboardPage() {
  const { user, canView } = useAuth()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name?.split(" ")[0] || "Guest"}. Here's your cloud cost overview.`}
      />

      <FlowIndicator currentStep="monitor" />

      <KPICards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <CostTrendChart />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ServiceBreakdownChart />
            <RecentActivity />
          </div>
        </div>

        <div className="space-y-6">
          <AlertPanel />
          {canView("all-costs") && <AIInsightsPanel />}
        </div>
      </div>
    </div>
  )
}
