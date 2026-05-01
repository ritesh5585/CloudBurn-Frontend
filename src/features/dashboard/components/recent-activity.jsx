"use client"

import { AlertTriangle, RefreshCw, FileText, UserPlus, Wallet, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { cn } from "@/utils/utils"
import { recentActivity, formatRelativeTime } from "@/api/mock-data"

const activityIcons = {
  alert: AlertTriangle,
  sync: RefreshCw,
  cost: FileText,
  member: UserPlus,
  budget: Wallet,
}

const activityColors = {
  alert: "text-destructive bg-destructive/10",
  sync: "text-success bg-success/10",
  cost: "text-info bg-info/10",
  member: "text-primary bg-primary/10",
  budget: "text-warning bg-warning/10",
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activityIcons[activity.type] || AlertTriangle
              const colorClass = activityColors[activity.type] || "text-muted-foreground bg-muted"
              return (
                <div key={activity.id} className="relative flex items-start gap-4 pl-10">
                  <div className={cn("absolute left-0 w-10 h-10 rounded-full flex items-center justify-center shrink-0", colorClass)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 pt-2">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(activity.timestamp)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
