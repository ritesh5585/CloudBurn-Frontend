"use client"

import { useState, useMemo } from "react"
import { AlertTriangle, AlertCircle, Info, Clock, DollarSign, Filter, CheckCircle2, ChevronDown, Sparkles, TrendingUp, Server } from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible"
import { cn } from "@/utils/utils"
import { alerts, formatCurrency, formatRelativeTime } from "@/api/mock-data"
import { getSeverityIcon } from "@/features/alerts/components/alert-panel"
import { PageHeader } from "@/shared/components/common/page-header"
import { StatCard } from "@/shared/components/common/stat-card"

// Returns an object with separate bg/text/border for flexible usage in this page
function getSeverityDetail(severity) {
  switch (severity) {
    case "critical": return { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20" }
    case "warning": return { bg: "bg-warning/10", text: "text-warning-foreground", border: "border-warning/20" }
    case "info": return { bg: "bg-info/10", text: "text-info", border: "border-info/20" }
    default: return { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" }
  }
}

function AlertDetailCard({ alert }) {
  const [isOpen, setIsOpen] = useState(false)
  const styles = getSeverityDetail(alert.severity)

  return (
    <div className="animate-fade-in">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className={cn("transition-all", isOpen && "ring-1 ring-primary/20")}>
          <CollapsibleTrigger asChild>
            <CardContent className="p-5 cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={cn("p-3 rounded-xl", styles.bg, styles.text)}>
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline" className={cn(styles.bg, styles.text, styles.border)}>
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline" className="bg-secondary">
                      <Server className="w-3 h-3 mr-1" />
                      {alert.service}
                    </Badge>
                    {alert.status === "acknowledged" && (
                      <Badge variant="outline" className="bg-muted">Acknowledged</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{alert.title}</h3>
                  <p className="text-muted-foreground">{alert.description}</p>
                  <div className="flex items-center gap-6 mt-3">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {formatRelativeTime(alert.timestamp)}
                    </div>
                    {alert.costImpact > 0 && (
                      <div className="flex items-center gap-1.5 text-sm text-destructive">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(alert.costImpact)}/mo impact
                      </div>
                    )}
                  </div>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")} />
              </div>
            </CardContent>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-5 pb-5 pt-0">
              <div className="border-t border-border pt-5 space-y-6">
                {alert.rootCause && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <h4 className="font-medium">Root Cause Analysis</h4>
                    </div>
                    <p className="text-muted-foreground pl-6">{alert.rootCause}</p>
                  </div>
                )}
                {alert.recommendation && (
                  <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h4 className="font-medium text-primary">AI Recommendation</h4>
                    </div>
                    <p className="text-muted-foreground">{alert.recommendation}</p>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Button>Take Action</Button>
                  <Button variant="outline">Acknowledge</Button>
                  <Button variant="ghost" className="text-muted-foreground">Dismiss</Button>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  )
}

export default function AlertsPage() {
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (severityFilter !== "all" && alert.severity !== severityFilter) return false
      if (statusFilter !== "all" && alert.status !== statusFilter) return false
      if (searchQuery && !alert.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [severityFilter, statusFilter, searchQuery])

  const criticalCount = alerts.filter((a) => a.severity === "critical" && a.status === "active").length
  const warningCount = alerts.filter((a) => a.severity === "warning" && a.status === "active").length
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length
  const totalImpact = alerts.filter((a) => a.status === "active").reduce((sum, a) => sum + a.costImpact, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts"
        subtitle="Real-time cost anomaly detection and alerts"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard delay={0.05} label="Critical" value={criticalCount} variant="danger"
          icon={<div className="p-2.5 rounded-xl bg-destructive/10"><AlertTriangle className="w-5 h-5 text-destructive" /></div>} />
        <StatCard delay={0.1} label="Warning" value={warningCount} variant="warning"
          icon={<div className="p-2.5 rounded-xl bg-warning/10"><AlertCircle className="w-5 h-5 text-warning-foreground" /></div>} />
        <StatCard delay={0.15} label="Resolved" value={resolvedCount} variant="success"
          icon={<div className="p-2.5 rounded-xl bg-success/10"><CheckCircle2 className="w-5 h-5 text-success" /></div>} />
        <StatCard delay={0.2} label="Total Impact" value={formatCurrency(totalImpact)}
          icon={<div className="p-2.5 rounded-xl bg-chart-1/10"><DollarSign className="w-5 h-5 text-chart-1" /></div>} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input placeholder="Search alerts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Severity" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <AlertDetailCard key={alert.id} alert={alert} />
        ))}
        {filteredAlerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-1">No alerts found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
