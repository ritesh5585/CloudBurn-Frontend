// Mock data for CloudBurn dashboard — TypeScript interfaces removed

// Generate cost trend data
export function generateCostTrendData(days = 30) {
  const data = []
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - days)

  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    const baseCost = 15000 + Math.sin(i / 7) * 2000
    const variance = Math.random() * 1500 - 750

    data.push({
      date: date.toISOString().split("T")[0],
      cost: Math.round(baseCost + variance),
      forecast: i >= days - 7 ? Math.round(baseCost + variance + Math.random() * 500) : undefined,
    })
  }
  return data
}

// Service breakdown
export const serviceCosts = [
  { name: "EC2 Instances", cost: 12450, change: 5.2, provider: "aws" },
  { name: "RDS Databases", cost: 8320, change: -2.1, provider: "aws" },
  { name: "S3 Storage", cost: 4180, change: 12.5, provider: "aws" },
  { name: "Compute Engine", cost: 6890, change: 3.8, provider: "gcp" },
  { name: "Cloud SQL", cost: 3210, change: -1.5, provider: "gcp" },
  { name: "Azure VMs", cost: 5670, change: 8.9, provider: "azure" },
  { name: "Lambda Functions", cost: 2340, change: 22.3, provider: "aws" },
  { name: "CloudFront CDN", cost: 1890, change: 4.1, provider: "aws" },
]

// Active alerts
export const alerts = [
  {
    id: "1",
    title: "Unusual EC2 Spike Detected",
    description: "EC2 costs increased by 45% in the last 24 hours",
    severity: "critical",
    service: "EC2 Instances",
    costImpact: 2340,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "active",
    rootCause: "Auto-scaling triggered due to traffic spike from marketing campaign",
    recommendation: "Review auto-scaling policies and consider reserved instances for baseline capacity",
  },
  {
    id: "2",
    title: "RDS Instance Over-provisioned",
    description: "Production RDS instance running at 15% average CPU utilization",
    severity: "warning",
    service: "RDS Databases",
    costImpact: 890,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: "active",
    rootCause: "Instance was sized for peak load that rarely occurs",
    recommendation: "Consider downsizing to db.r5.large or enabling auto-scaling",
  },
  {
    id: "3",
    title: "S3 Transfer Costs Rising",
    description: "Cross-region data transfer costs up 28% this week",
    severity: "warning",
    service: "S3 Storage",
    costImpact: 450,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: "acknowledged",
    rootCause: "New data pipeline copying data to secondary region",
    recommendation: "Enable S3 Transfer Acceleration or review data locality",
  },
  {
    id: "4",
    title: "Budget Threshold Reached",
    description: "Platform team has used 85% of monthly budget",
    severity: "info",
    service: "All Services",
    costImpact: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    status: "active",
    recommendation: "Review remaining planned deployments for this month",
  },
]

// Zombie resources
export const zombieResources = [
  { id: "1", name: "staging-api-server", type: "EC2 Instance", provider: "aws", idleDays: 45, monthlyCost: 156, lastActivity: "2024-01-15", region: "us-east-1" },
  { id: "2", name: "old-analytics-db", type: "RDS Instance", provider: "aws", idleDays: 62, monthlyCost: 289, lastActivity: "2023-12-28", region: "us-west-2" },
  { id: "3", name: "backup-storage-2023", type: "S3 Bucket", provider: "aws", idleDays: 180, monthlyCost: 78, lastActivity: "2023-09-01", region: "us-east-1" },
  { id: "4", name: "dev-cluster-test", type: "GKE Cluster", provider: "gcp", idleDays: 30, monthlyCost: 445, lastActivity: "2024-02-01", region: "us-central1" },
  { id: "5", name: "legacy-load-balancer", type: "ELB", provider: "aws", idleDays: 90, monthlyCost: 45, lastActivity: "2023-11-15", region: "eu-west-1" },
  { id: "6", name: "unused-elastic-ip", type: "Elastic IP", provider: "aws", idleDays: 120, monthlyCost: 12, lastActivity: "2023-10-01", region: "us-east-1" },
  { id: "7", name: "snapshot-archive", type: "EBS Snapshot", provider: "aws", idleDays: 200, monthlyCost: 34, lastActivity: "2023-07-15", region: "us-east-1" },
  { id: "8", name: "test-vm-092", type: "Azure VM", provider: "azure", idleDays: 28, monthlyCost: 189, lastActivity: "2024-02-03", region: "eastus" },
]

// Teams
export const teams = [
  {
    id: "1",
    name: "Platform",
    members: [
      { id: "1", name: "Alex Chen", email: "alex@cloudburn.io", role: "admin", joinedAt: "2023-01-15" },
      { id: "2", name: "Sarah Miller", email: "sarah@cloudburn.io", role: "lead", joinedAt: "2023-03-20" },
      { id: "3", name: "James Wilson", email: "james@cloudburn.io", role: "developer", joinedAt: "2023-06-10" },
    ],
    monthlyCost: 18500,
    budget: 25000,
    services: ["EC2", "RDS", "S3", "Lambda"],
  },
  {
    id: "2",
    name: "Data Engineering",
    members: [
      { id: "4", name: "Emily Davis", email: "emily@cloudburn.io", role: "lead", joinedAt: "2023-02-01" },
      { id: "5", name: "Michael Brown", email: "michael@cloudburn.io", role: "developer", joinedAt: "2023-04-15" },
    ],
    monthlyCost: 12300,
    budget: 15000,
    services: ["BigQuery", "Dataflow", "Cloud SQL"],
  },
  {
    id: "3",
    name: "Frontend",
    members: [
      { id: "6", name: "Lisa Anderson", email: "lisa@cloudburn.io", role: "lead", joinedAt: "2023-05-01" },
      { id: "7", name: "David Lee", email: "david@cloudburn.io", role: "developer", joinedAt: "2023-07-20" },
      { id: "8", name: "Rachel Kim", email: "rachel@cloudburn.io", role: "developer", joinedAt: "2023-08-15" },
    ],
    monthlyCost: 4200,
    budget: 8000,
    services: ["CloudFront", "S3", "Route53"],
  },
]

// Cloud accounts
export const cloudAccounts = [
  { id: "1", provider: "aws", name: "Production AWS", accountId: "123456789012", status: "connected", lastSync: new Date(Date.now() - 1000 * 60 * 5).toISOString(), monthlyCost: 32450 },
  { id: "2", provider: "aws", name: "Development AWS", accountId: "234567890123", status: "connected", lastSync: new Date(Date.now() - 1000 * 60 * 10).toISOString(), monthlyCost: 8920 },
  { id: "3", provider: "gcp", name: "GCP Main Project", accountId: "cloudburn-prod-123", status: "connected", lastSync: new Date(Date.now() - 1000 * 60 * 3).toISOString(), monthlyCost: 10100 },
  { id: "4", provider: "azure", name: "Azure Subscription", accountId: "a1b2c3d4-e5f6-7890", status: "syncing", lastSync: new Date(Date.now() - 1000 * 60 * 60).toISOString(), monthlyCost: 5670 },
]

// AI Insights
export const aiInsights = [
  {
    id: "1",
    title: "Switch to Reserved Instances",
    description: "Based on your consistent EC2 usage pattern, switching 5 instances to 1-year reserved would save approximately $4,200/month.",
    savings: 4200,
    confidence: 0.92,
    category: "compute",
  },
  {
    id: "2",
    title: "Enable S3 Intelligent Tiering",
    description: "Your S3 access patterns show 60% of data is rarely accessed. Intelligent Tiering could reduce storage costs by 35%.",
    savings: 1450,
    confidence: 0.88,
    category: "storage",
  },
  {
    id: "3",
    title: "Rightsize RDS Instances",
    description: "3 RDS instances are consistently under 30% CPU utilization. Downsizing would save $890/month with no performance impact.",
    savings: 890,
    confidence: 0.95,
    category: "database",
  },
]

// KPI calculations
export const kpiData = {
  totalCost: 57140,
  monthlySpend: 57140,
  forecast: 62500,
  budgetUsed: 76,
  totalBudget: 75000,
  savingsOpportunity: 6540,
  activeAlerts: alerts.filter((a) => a.status === "active").length,
  zombieCount: zombieResources.length,
  zombieWaste: zombieResources.reduce((sum, r) => sum + r.monthlyCost, 0),
}

// Recent activity
export const recentActivity = [
  { id: "1", type: "alert", message: "Critical alert: EC2 spike detected", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: "2", type: "sync", message: "AWS Production account synced", timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString() },
  { id: "3", type: "cost", message: "Daily cost report generated", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: "4", type: "member", message: "Rachel Kim joined Frontend team", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: "5", type: "budget", message: "Platform team budget updated", timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
]

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format relative time
export function formatRelativeTime(timestamp) {
  const now = new Date()
  const date = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

// Get provider colour classes
export function getProviderColor(provider) {
  switch (provider) {
    case "aws": return "bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/20"
    case "gcp": return "bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/20"
    case "azure": return "bg-[#0078D4]/10 text-[#0078D4] border-[#0078D4]/20"
    default: return "bg-muted text-muted-foreground"
  }
}

// Get severity colour classes
export function getSeverityColor(severity) {
  switch (severity) {
    case "critical": return "bg-destructive/10 text-destructive border-destructive/20"
    case "warning": return "bg-warning/10 text-warning-foreground border-warning/20"
    case "info": return "bg-info/10 text-info border-info/20"
    default: return "bg-muted text-muted-foreground"
  }
}
