"use client"

import { useState } from "react"
import { Plus, Cloud, RefreshCw, CheckCircle2, AlertCircle, Loader2, MoreVertical, ExternalLink, Trash2, Settings } from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { cn } from "@/utils/utils"
import { cloudAccounts, formatCurrency, formatRelativeTime } from "@/api/mock-data"
import { useAuth } from "@/store/auth-context"
import { PageHeader } from "@/shared/components/common/page-header"
import { StatCard } from "@/shared/components/common/stat-card"

const providers = {
  aws: {
    name: "Amazon Web Services",
    color: "#FF9900",
    bgColor: "bg-[#FF9900]/10",
    steps: [
      { title: "Create IAM Role", description: "Create a read-only IAM role with cost explorer permissions" },
      { title: "Configure Trust Policy", description: "Add CloudBurn as a trusted entity" },
      { title: "Enter Role ARN", description: "Paste your IAM role ARN to complete the connection" },
    ],
  },
  gcp: {
    name: "Google Cloud Platform",
    color: "#4285F4",
    bgColor: "bg-[#4285F4]/10",
    steps: [
      { title: "Create Service Account", description: "Create a service account with billing viewer role" },
      { title: "Generate Key File", description: "Download the JSON key file for authentication" },
      { title: "Upload Credentials", description: "Upload your service account key to connect" },
    ],
  },
  azure: {
    name: "Microsoft Azure",
    color: "#0078D4",
    bgColor: "bg-[#0078D4]/10",
    steps: [
      { title: "Register Application", description: "Register an app in Azure Active Directory" },
      { title: "Assign Permissions", description: "Grant Cost Management Reader role" },
      { title: "Enter Credentials", description: "Enter your app credentials to complete setup" },
    ],
  },
}

function ProviderLogo({ provider, size = "md" }) {
  const sizeClasses = { sm: "w-8 h-8 text-sm", md: "w-12 h-12 text-lg", lg: "w-16 h-16 text-2xl" }
  return (
    <div
      className={cn("rounded-xl flex items-center justify-center font-bold", sizeClasses[size], providers[provider].bgColor)}
      style={{ color: providers[provider].color }}
    >
      {provider.toUpperCase().slice(0, 3)}
    </div>
  )
}

function getStatusBadge(status) {
  switch (status) {
    case "connected": return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Connected</Badge>
    case "error": return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Error</Badge>
    case "syncing": return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Syncing...</Badge>
    default: return null
  }
}

function CloudAccountCard({ account }) {
  const { canEdit } = useAuth()
  return (
    <Card className="hover:border-primary/30 transition-colors animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <ProviderLogo provider={account.provider} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{account.name}</h3>
              {getStatusBadge(account.status)}
            </div>
            <p className="text-sm text-muted-foreground font-mono">{account.accountId}</p>
            <div className="flex items-center gap-4 mt-3">
              <div>
                <p className="text-xs text-muted-foreground">Monthly Cost</p>
                <p className="text-lg font-semibold">{formatCurrency(account.monthlyCost)}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground">Last Sync</p>
                <p className="text-sm">{formatRelativeTime(account.lastSync)}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8"><RefreshCw className="w-4 h-4" /></Button>
            {canEdit("cloud-accounts") && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><Settings className="w-4 h-4 mr-2" />Settings</DropdownMenuItem>
                  <DropdownMenuItem><ExternalLink className="w-4 h-4 mr-2" />View in Console</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Disconnect</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ConnectProviderModal({ open, onOpenChange }) {
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [step, setStep] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnecting(false)
    setIsConnected(true)
    setTimeout(() => { onOpenChange(false); setSelectedProvider(null); setStep(0); setIsConnected(false) }, 1500)
  }

  const handleClose = () => { onOpenChange(false); setSelectedProvider(null); setStep(0); setIsConnected(false) }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {!selectedProvider ? "Connect Cloud Provider" : isConnected ? "Connection Successful" : `Connect ${providers[selectedProvider].name}`}
          </DialogTitle>
          <DialogDescription>
            {!selectedProvider ? "Select a cloud provider to connect your account" : isConnected ? "Your cloud account has been connected successfully" : `Step ${step + 1} of ${providers[selectedProvider].steps.length}`}
          </DialogDescription>
        </DialogHeader>

        {!selectedProvider ? (
          <div className="grid grid-cols-3 gap-4 py-4">
            {Object.keys(providers).map((provider) => (
              <button key={provider} onClick={() => setSelectedProvider(provider)}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-accent transition-all">
                <ProviderLogo provider={provider} size="lg" />
                <span className="text-sm font-medium">{providers[provider].name}</span>
              </button>
            ))}
          </div>
        ) : isConnected ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <p className="text-lg font-medium">Connected Successfully!</p>
            <p className="text-sm text-muted-foreground">Data will start syncing shortly</p>
          </div>
        ) : (
          <div className="py-4 space-y-6">
            <div className="flex items-center gap-2">
              {providers[selectedProvider].steps.map((_, i) => (
                <div key={i} className={cn("flex-1 h-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-muted")} />
              ))}
            </div>
            <div>
              <h3 className="font-medium mb-2">{providers[selectedProvider].steps[step].title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{providers[selectedProvider].steps[step].description}</p>
              {step === providers[selectedProvider].steps.length - 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="credential">
                      {selectedProvider === "aws" ? "IAM Role ARN" : selectedProvider === "gcp" ? "Service Account Key" : "Application ID"}
                    </Label>
                    <Input id="credential" placeholder={
                      selectedProvider === "aws" ? "arn:aws:iam::123456789012:role/CloudBurnRole" :
                      selectedProvider === "gcp" ? "cloudburn-sa@project.iam.gserviceaccount.com" :
                      "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    } className="font-mono text-sm" />
                  </div>
                  {selectedProvider === "azure" && (
                    <div className="space-y-2">
                      <Label htmlFor="secret">Client Secret</Label>
                      <Input id="secret" type="password" />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => (step > 0 ? setStep(step - 1) : setSelectedProvider(null))}>
                {step > 0 ? "Back" : "Cancel"}
              </Button>
              {step < providers[selectedProvider].steps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)}>Continue</Button>
              ) : (
                <Button onClick={handleConnect} disabled={isConnecting}>
                  {isConnecting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Connecting...</> : "Connect Account"}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function CloudAccountsPage() {
  const [connectModalOpen, setConnectModalOpen] = useState(false)
  const { canEdit } = useAuth()

  const totalCost = cloudAccounts.reduce((sum, a) => sum + a.monthlyCost, 0)
  const connectedCount = cloudAccounts.filter((a) => a.status === "connected").length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cloud Accounts"
        subtitle="Manage your connected cloud provider accounts"
        actions={canEdit("cloud-accounts") && (
          <Button onClick={() => setConnectModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />Connect Account
          </Button>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard delay={0.05} label="Total Accounts" value={cloudAccounts.length}
          icon={<div className="p-3 rounded-xl bg-primary/10"><Cloud className="w-5 h-5 text-primary" /></div>} />
        <StatCard delay={0.1} label="Connected" value={connectedCount} variant="success"
          icon={<div className="p-3 rounded-xl bg-success/10"><CheckCircle2 className="w-5 h-5 text-success" /></div>} />
        <StatCard delay={0.15} label="Total Monthly Cost" value={formatCurrency(totalCost)}
          icon={<div className="p-3 rounded-xl bg-chart-1/10"><RefreshCw className="w-5 h-5 text-chart-1" /></div>} />
      </div>

      <div className="space-y-4">
        {cloudAccounts.map((account) => (
          <CloudAccountCard key={account.id} account={account} />
        ))}
      </div>

      <ConnectProviderModal open={connectModalOpen} onOpenChange={setConnectModalOpen} />
    </div>
  )
}
