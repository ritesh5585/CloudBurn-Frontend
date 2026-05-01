"use client"

import { useState } from "react"
import { AlertTriangle, AlertCircle, Info, ChevronRight, Clock, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/utils/utils"
import { alerts, formatCurrency, formatRelativeTime } from "@/api/mock-data"

// Exported so alerts/page.jsx can import them
export function getSeverityIcon(severity) {
  switch (severity) {
    case "critical": return <AlertTriangle className="w-4 h-4" />
    case "warning": return <AlertCircle className="w-4 h-4" />
    case "info": return <Info className="w-4 h-4" />
    default: return null
  }
}

export function getSeverityStyles(severity) {
  switch (severity) {
    case "critical": return "bg-destructive/10 text-destructive border-destructive/20"
    case "warning": return "bg-warning/10 text-warning-foreground border-warning/20"
    case "info": return "bg-info/10 text-info border-info/20"
    default: return "bg-muted text-muted-foreground"
  }
}

function AlertCard({ alert, expanded, onToggle }) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-colors cursor-pointer",
        "hover:bg-accent/50",
        expanded && "bg-accent/30"
      )}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg", getSeverityStyles(alert.severity))}>
          {getSeverityIcon(alert.severity)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={cn("text-xs", getSeverityStyles(alert.severity))}>
              {alert.severity}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(alert.timestamp)}
            </span>
          </div>
          <h4 className="font-medium text-sm mb-1 truncate">{alert.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-1">{alert.description}</p>

          {/* Expanded detail — CSS transition instead of Framer AnimatePresence */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-border space-y-3 animate-fade-in">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Affected Service</p>
                <p className="text-sm">{alert.service}</p>
              </div>
              {alert.costImpact > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Cost Impact</p>
                  <p className="text-sm flex items-center gap-1 text-destructive">
                    <DollarSign className="w-3 h-3" />
                    {formatCurrency(alert.costImpact)} / month
                  </p>
                </div>
              )}
              {alert.rootCause && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Root Cause</p>
                  <p className="text-sm">{alert.rootCause}</p>
                </div>
              )}
              {alert.recommendation && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Recommendation</p>
                  <p className="text-sm text-primary">{alert.recommendation}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="default" className="h-8">Take Action</Button>
                <Button size="sm" variant="outline" className="h-8">Acknowledge</Button>
              </div>
            </div>
          )}
        </div>
        <ChevronRight className={cn(
          "w-4 h-4 text-muted-foreground transition-transform shrink-0",
          expanded && "rotate-90"
        )} />
      </div>
    </div>
  )
}

export function AlertPanel() {
  const [expandedId, setExpandedId] = useState(null)
  const activeAlerts = alerts.filter((a) => a.status === "active")

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          Active Alerts
          {activeAlerts.length > 0 && (
            <Badge variant="destructive" className="h-5 px-1.5 text-xs">
              {activeAlerts.length}
            </Badge>
          )}
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-7 text-xs">View All</Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              expanded={expandedId === alert.id}
              onToggle={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
            />
          ))}
          {activeAlerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6 text-success" />
              </div>
              <p className="font-medium">No Active Alerts</p>
              <p className="text-sm text-muted-foreground">All systems operating normally</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
