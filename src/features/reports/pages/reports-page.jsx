"use client"

import { useState, useMemo } from "react"
import { Download, Calendar, TrendingUp, TrendingDown, BarChart3, Table as TableIcon, Plus, Star, Clock, FileBarChart } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { cn } from "@/utils/utils"
import { generateCostTrendData, serviceCosts, teams, cloudAccounts, formatCurrency } from "@/api/mock-data"
import { CHART_COLORS, chartTooltipStyle, axisTickStyle } from "@/shared/components/common/chart-config"
import { PageHeader } from "@/shared/components/common/page-header"
import { StatCard } from "@/shared/components/common/stat-card"

const savedReports = [
  { id: "1", name: "Monthly Cost Summary", lastRun: "2024-03-01", starred: true },
  { id: "2", name: "Team Cost Breakdown", lastRun: "2024-02-28", starred: true },
  { id: "3", name: "EC2 Usage Analysis", lastRun: "2024-02-25", starred: false },
  { id: "4", name: "Q1 Budget Report", lastRun: "2024-02-20", starred: false },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("30d")
  const [reportView, setReportView] = useState("chart")

  const costData = useMemo(() => {
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90
    return generateCostTrendData(days)
  }, [dateRange])

  const { totalCost, avgDailyCost, changePercent, teamCostData, providerCostData } = useMemo(() => {
    const total = costData.reduce((sum, d) => sum + d.cost, 0)
    const avg = total / costData.length
    const prev = total * 0.92
    const change = ((total - prev) / prev) * 100
    const teamData = teams.map((team) => ({ name: team.name, cost: team.monthlyCost, budget: team.budget }))
    const provData = [
      { name: "AWS", value: cloudAccounts.filter((a) => a.provider === "aws").reduce((s, a) => s + a.monthlyCost, 0) },
      { name: "GCP", value: cloudAccounts.filter((a) => a.provider === "gcp").reduce((s, a) => s + a.monthlyCost, 0) },
      { name: "Azure", value: cloudAccounts.filter((a) => a.provider === "azure").reduce((s, a) => s + a.monthlyCost, 0) },
    ]
    return { totalCost: total, avgDailyCost: avg, changePercent: change, teamCostData: teamData, providerCostData: provData }
  }, [costData])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Analyze costs and generate detailed reports"
        actions={
          <>
            <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export PDF</Button>
            <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export CSV</Button>
            <Button><Plus className="w-4 h-4 mr-2" />New Report</Button>
          </>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full sm:w-44">
            <Calendar className="w-4 h-4 mr-2" /><SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 border border-border rounded-lg p-1">
          <Button variant={reportView === "chart" ? "secondary" : "ghost"} size="sm" onClick={() => setReportView("chart")}>
            <BarChart3 className="w-4 h-4" />
          </Button>
          <Button variant={reportView === "table" ? "secondary" : "ghost"} size="sm" onClick={() => setReportView("table")}>
            <TableIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard delay={0.05} label="Total Cost" value={formatCurrency(totalCost)}
          icon={<div className={cn("flex items-center gap-1 text-xs font-medium", changePercent > 0 ? "text-destructive" : "text-success")}>
            {changePercent > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(changePercent).toFixed(1)}%
          </div>} />
        <StatCard delay={0.1} label="Daily Average" value={formatCurrency(avgDailyCost)} icon={<span />} />
        <StatCard delay={0.15} label="Top Service" value="EC2"
          icon={<p className="text-xs text-muted-foreground">{formatCurrency(serviceCosts[0].cost)}</p>} />
        <StatCard delay={0.2} label="Top Team" value="Platform"
          icon={<p className="text-xs text-muted-foreground">{formatCurrency(teams[0].monthlyCost)}</p>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="trend" className="space-y-4">
            <TabsList>
              <TabsTrigger value="trend">Cost Trend</TabsTrigger>
              <TabsTrigger value="service">By Service</TabsTrigger>
              <TabsTrigger value="team">By Team</TabsTrigger>
            </TabsList>

            <TabsContent value="trend">
              <Card>
                <CardHeader><CardTitle className="text-base font-medium">Cost Over Time</CardTitle></CardHeader>
                <CardContent>
                  {reportView === "chart" ? (
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={costData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0 / 0.2)" vertical={false} />
                          <XAxis dataKey="date" tick={axisTickStyle} tickLine={false} axisLine={false}
                            tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
                          <YAxis tick={axisTickStyle} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                          <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [formatCurrency(v), "Cost"]} />
                          <Line type="monotone" dataKey="cost" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Date</TableHead><TableHead className="text-right">Cost</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {costData.slice(-10).map((row) => (
                          <TableRow key={row.date}>
                            <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(row.cost)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="service">
              <Card>
                <CardHeader><CardTitle className="text-base font-medium">Cost by Service</CardTitle></CardHeader>
                <CardContent>
                  {reportView === "chart" ? (
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={serviceCosts.slice(0, 6)} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0 / 0.2)" horizontal={false} />
                          <XAxis type="number" tick={axisTickStyle} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                          <YAxis type="category" dataKey="name" tick={axisTickStyle} tickLine={false} axisLine={false} width={100} />
                          <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [formatCurrency(v), "Cost"]} />
                          <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                            {serviceCosts.slice(0, 6).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Service</TableHead><TableHead>Provider</TableHead><TableHead className="text-right">Cost</TableHead><TableHead className="text-right">Change</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {serviceCosts.map((s) => (
                          <TableRow key={s.name}>
                            <TableCell className="font-medium">{s.name}</TableCell>
                            <TableCell><Badge variant="outline">{s.provider.toUpperCase()}</Badge></TableCell>
                            <TableCell className="text-right">{formatCurrency(s.cost)}</TableCell>
                            <TableCell className={cn("text-right font-medium", s.change > 0 ? "text-destructive" : "text-success")}>
                              {s.change > 0 ? "+" : ""}{s.change}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <Card>
                <CardHeader><CardTitle className="text-base font-medium">Cost by Team</CardTitle></CardHeader>
                <CardContent>
                  {reportView === "chart" ? (
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={teamCostData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0 / 0.2)" vertical={false} />
                          <XAxis dataKey="name" tick={axisTickStyle} tickLine={false} axisLine={false} />
                          <YAxis tick={axisTickStyle} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                          <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [formatCurrency(v), "Cost"]} />
                          <Bar dataKey="cost" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                          <Bar dataKey="budget" fill="oklch(0.5 0 0 / 0.3)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader><TableRow><TableHead>Team</TableHead><TableHead className="text-right">Cost</TableHead><TableHead className="text-right">Budget</TableHead><TableHead className="text-right">Usage</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {teamCostData.map((team) => (
                          <TableRow key={team.name}>
                            <TableCell className="font-medium">{team.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(team.cost)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(team.budget)}</TableCell>
                            <TableCell className="text-right">{Math.round((team.cost / team.budget) * 100)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base font-medium">By Provider</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie data={providerCostData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {providerCostData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Legend formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">Saved Reports</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {savedReports.map((report) => (
                  <div key={report.id} className="flex items-center gap-3 px-6 py-3 hover:bg-accent/50 transition-colors cursor-pointer">
                    <FileBarChart className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{report.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />{new Date(report.lastRun).toLocaleDateString()}
                      </p>
                    </div>
                    {report.starred && <Star className="w-4 h-4 text-warning fill-warning" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
