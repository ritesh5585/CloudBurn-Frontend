"use client"

import { useState, useMemo } from "react"
import { Ghost, DollarSign, Clock, Trash2, Eye, CheckCircle2, Filter, ArrowUpDown, Server, Database, HardDrive, Globe, AlertTriangle, Download } from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/components/ui/dialog"
import { cn } from "@/utils/utils"
import { zombieResources, formatCurrency, getProviderColor } from "@/api/mock-data"
import { useRole } from "@/store/role-context"
import { PageHeader } from "@/shared/components/common/page-header"
import { StatCard } from "@/shared/components/common/stat-card"

// Plain object — no TypeScript Record type needed
const resourceIcons = {
  "EC2 Instance": <Server className="w-4 h-4" />,
  "RDS Instance": <Database className="w-4 h-4" />,
  "S3 Bucket": <HardDrive className="w-4 h-4" />,
  "GKE Cluster": <Server className="w-4 h-4" />,
  "ELB": <Globe className="w-4 h-4" />,
  "Elastic IP": <Globe className="w-4 h-4" />,
  "EBS Snapshot": <HardDrive className="w-4 h-4" />,
  "Azure VM": <Server className="w-4 h-4" />,
}

function getIdleDaysColor(days) {
  if (days > 90) return "text-destructive"
  if (days > 30) return "text-warning-foreground"
  return "text-muted-foreground"
}

export default function ZombieResourcesPage() {
  const [selectedResources, setSelectedResources] = useState([])
  const [providerFilter, setProviderFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("cost")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const { canEdit } = useAuth()

  const filteredResources = useMemo(() => {
    return zombieResources
      .filter((r) => {
        if (providerFilter !== "all" && r.provider !== providerFilter) return false
        if (typeFilter !== "all" && r.type !== typeFilter) return false
        if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
      })
      .sort((a, b) => sortBy === "cost" ? b.monthlyCost - a.monthlyCost : b.idleDays - a.idleDays)
  }, [providerFilter, typeFilter, searchQuery, sortBy])

  const totalWaste = zombieResources.reduce((sum, r) => sum + r.monthlyCost, 0)
  const avgIdleDays = Math.round(zombieResources.reduce((sum, r) => sum + r.idleDays, 0) / zombieResources.length)
  const selectedWaste = selectedResources.reduce((sum, id) => {
    return sum + (zombieResources.find((r) => r.id === id)?.monthlyCost || 0)
  }, 0)
  const resourceTypes = [...new Set(zombieResources.map((r) => r.type))]

  const handleSelectAll = () => {
    setSelectedResources(selectedResources.length === filteredResources.length ? [] : filteredResources.map((r) => r.id))
  }

  const handleSelectResource = (id) => {
    setSelectedResources((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id])
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Zombie Resources"
        subtitle="Identify and cleanup idle resources wasting money"
        actions={
          <>
            <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export Report</Button>
            {canEdit("zombie-resources") && selectedResources.length > 0 && (
              <Button variant="destructive" onClick={() => setConfirmDialogOpen(true)}>
                <Trash2 className="w-4 h-4 mr-2" />Cleanup Selected ({selectedResources.length})
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard delay={0.05} label="Zombie Resources" value={zombieResources.length} variant="danger"
          icon={<div className="p-2.5 rounded-xl bg-destructive/10"><Ghost className="w-5 h-5 text-destructive" /></div>} />
        <StatCard delay={0.1} label="Monthly Waste" value={formatCurrency(totalWaste)} variant="warning"
          icon={<div className="p-2.5 rounded-xl bg-warning/10"><DollarSign className="w-5 h-5 text-warning-foreground" /></div>} />
        <StatCard delay={0.15} label="Avg. Idle Days" value={avgIdleDays}
          icon={<div className="p-2.5 rounded-xl bg-chart-1/10"><Clock className="w-5 h-5 text-chart-1" /></div>} />
        <StatCard delay={0.2} label="Annual Savings" value={formatCurrency(totalWaste * 12)} variant="success"
          icon={<div className="p-2.5 rounded-xl bg-success/10"><CheckCircle2 className="w-5 h-5 text-success" /></div>} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input placeholder="Search resources..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Provider" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="aws">AWS</SelectItem>
            <SelectItem value="gcp">GCP</SelectItem>
            <SelectItem value="azure">Azure</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Resource Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {resourceTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-36">
            <ArrowUpDown className="w-4 h-4 mr-2" /><SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cost">By Cost</SelectItem>
            <SelectItem value="idle">By Idle Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table — fixed DOM nesting: plain <TableRow> with CSS class instead of motion.tr */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedResources.length === filteredResources.length && filteredResources.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Idle Days</TableHead>
                <TableHead className="text-right">Monthly Cost</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow
                  key={resource.id}
                  className={cn("group animate-fade-in", selectedResources.includes(resource.id) && "bg-primary/5")}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedResources.includes(resource.id)}
                      onCheckedChange={() => handleSelectResource(resource.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        {resourceIcons[resource.type] || <Server className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium font-mono text-sm">{resource.name}</p>
                        <p className="text-xs text-muted-foreground">Last active: {new Date(resource.lastActivity).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="font-normal">{resource.type}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={getProviderColor(resource.provider)}>{resource.provider.toUpperCase()}</Badge></TableCell>
                  <TableCell><span className="text-sm text-muted-foreground">{resource.region}</span></TableCell>
                  <TableCell className="text-right">
                    <span className={cn("font-medium", getIdleDaysColor(resource.idleDays))}>{resource.idleDays} days</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold">{formatCurrency(resource.monthlyCost)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                      {canEdit("zombie-resources") && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredResources.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-1">No zombie resources found</h3>
              <p className="text-muted-foreground">Your infrastructure is running efficiently</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cleanup Confirmation */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />Confirm Cleanup
            </DialogTitle>
            <DialogDescription>
              You are about to terminate {selectedResources.length} resource(s). This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm mb-2">Resources to be terminated:</p>
              <ul className="space-y-1">
                {selectedResources.slice(0, 5).map((id) => {
                  const r = zombieResources.find((res) => res.id === id)
                  return <li key={id} className="text-sm font-mono">{r?.name}</li>
                })}
                {selectedResources.length > 5 && (
                  <li className="text-sm text-muted-foreground">...and {selectedResources.length - 5} more</li>
                )}
              </ul>
              <p className="text-sm mt-3 font-medium">
                Estimated monthly savings: <span className="text-success">{formatCurrency(selectedWaste)}</span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setConfirmDialogOpen(false); setSelectedResources([]) }}>
              <Trash2 className="w-4 h-4 mr-2" />Confirm Cleanup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
