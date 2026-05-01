"use client"

import { useState, useEffect } from "react"
import { User, Building2, Bell, Key, AlertTriangle, Moon, Sun, Monitor, Check, Copy, RefreshCw, Mail, Smartphone } from "lucide-react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Separator } from "@/shared/components/ui/separator"
import { cn } from "@/utils/utils"
import { useAuth } from "@/store/auth-context"
import { PageHeader } from "@/shared/components/common/page-header"

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
]

const timezones = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (US)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US)" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Asia/Tokyo", label: "Tokyo" },
]

// ── Sub-tab components ─────────────────────────────────────────

function ProfileTab({ user, theme, setTheme, mounted }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm">Change Avatar</Button>
            <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={user.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user.email} />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Appearance</h3>
          {mounted && (
            <div className="flex gap-3">
              {[
                { value: "light", icon: Sun, label: "Light" },
                { value: "dark", icon: Moon, label: "Dark" },
                { value: "system", icon: Monitor, label: "System" },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all",
                    theme === value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                  {theme === value && <Check className="w-4 h-4 text-primary ml-2" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function OrganizationTab({ user }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
          <CardDescription>Configure your organization preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input id="orgName" defaultValue={user.organization} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Organization Slug</Label>
              <Input id="slug" defaultValue="acme-corp" />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select defaultValue="USD">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => <SelectItem key={c.code} value={c.code}>{c.symbol} {c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select defaultValue="America/New_York">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end"><Button>Save Changes</Button></div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Organization</p>
              <p className="text-sm text-muted-foreground">Permanently delete your organization and all data</p>
            </div>
            <Button variant="destructive">Delete Organization</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationsTab({ notifications, setNotifications }) {
  const channels = [
    { key: "email", icon: Mail, label: "Email Notifications", description: "Receive alerts via email" },
    { key: "push", icon: Smartphone, label: "Push Notifications", description: "Receive alerts on your mobile device" },
    { key: "slack", icon: Bell, label: "Slack Integration", description: "Send alerts to Slack channel" },
  ]
  const prefs = [
    { key: "criticalOnly", label: "Critical Alerts Only", description: "Only receive critical severity alerts" },
    { key: "dailyDigest", label: "Daily Digest", description: "Receive a daily summary of costs" },
    { key: "weeklyReport", label: "Weekly Report", description: "Receive weekly cost analysis report" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Choose how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {channels.map(({ key, icon: Icon, label, description }, i) => (
            <div key={key}>
              {i > 0 && <Separator className="mb-4" />}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Icon className="w-4 h-4 text-primary" /></div>
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
                <Switch checked={notifications[key]} onCheckedChange={(v) => setNotifications({ ...notifications, [key]: v })} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Configure what notifications you receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {prefs.map(({ key, label, description }, i) => (
            <div key={key}>
              {i > 0 && <Separator className="mb-4" />}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <Switch checked={notifications[key]} onCheckedChange={(v) => setNotifications({ ...notifications, [key]: v })} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function AlertsTab({ thresholds, setThresholds }) {
  const fields = [
    { key: "budgetWarning", label: "Budget Warning Threshold (%)", min: 0, max: 100, hint: "Trigger warning when budget exceeds this percentage" },
    { key: "budgetCritical", label: "Budget Critical Threshold (%)", min: 0, max: 100, hint: "Trigger critical alert when budget exceeds this percentage" },
    { key: "spikePercent", label: "Cost Spike Threshold (%)", min: 0, max: 500, hint: "Alert when daily cost increases by this percentage" },
    { key: "zombieDays", label: "Zombie Resource Threshold (days)", min: 1, max: 365, hint: "Mark resource as zombie after this many idle days" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Thresholds</CardTitle>
        <CardDescription>Configure when alerts are triggered</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(({ key, label, min, max, hint }) => (
            <div key={key} className="space-y-2">
              <Label>{label}</Label>
              <Input type="number" min={min} max={max} value={thresholds[key]}
                onChange={(e) => setThresholds({ ...thresholds, [key]: parseInt(e.target.value) })} />
              <p className="text-xs text-muted-foreground">{hint}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end"><Button>Save Thresholds</Button></div>
      </CardContent>
    </Card>
  )
}

function ApiTab({ copied, onCopy }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage API keys for programmatic access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Live API Key</Label>
            <div className="flex gap-2">
              <Input readOnly value="cb_live_••••••••••••••••••••" className="font-mono" />
              <Button variant="outline" size="icon" onClick={onCopy}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="icon"><RefreshCw className="w-4 h-4" /></Button>
            </div>
            <p className="text-xs text-muted-foreground">Use this key for production integrations</p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Create New API Key</p>
              <p className="text-sm text-muted-foreground">Generate additional API keys for different services</p>
            </div>
            <Button variant="outline"><Key className="w-4 h-4 mr-2" />Generate Key</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>Configure webhook endpoints for real-time events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input id="webhook" placeholder="https://your-app.com/api/webhooks/cloudburn" />
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline">POST</Badge>
            <span className="text-sm text-muted-foreground">We&apos;ll send event payloads to this URL</span>
          </div>
          <div className="flex justify-end"><Button>Save Webhook</Button></div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [notifications, setNotifications] = useState({ email: true, push: true, slack: false, criticalOnly: false, dailyDigest: true, weeklyReport: true })
  const [thresholds, setThresholds] = useState({ budgetWarning: 75, budgetCritical: 90, spikePercent: 25, zombieDays: 30 })

  useEffect(() => { setMounted(true) }, [])

  const copyApiKey = () => {
    navigator.clipboard.writeText("cb_live_xxxxxxxxxxxxxxxxxxxx")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2 bg-transparent p-0">
          {[
            { value: "profile", icon: User, label: "Profile" },
            { value: "organization", icon: Building2, label: "Organization" },
            { value: "notifications", icon: Bell, label: "Notifications" },
            { value: "alerts", icon: AlertTriangle, label: "Alerts" },
            { value: "api", icon: Key, label: "API" },
          ].map(({ value, icon: Icon, label }) => (
            <TabsTrigger key={value} value={value} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon className="w-4 h-4 mr-2" />{label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab user={user} theme={theme} setTheme={setTheme} mounted={mounted} />
        </TabsContent>
        <TabsContent value="organization">
          <OrganizationTab user={user} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab notifications={notifications} setNotifications={setNotifications} />
        </TabsContent>
        <TabsContent value="alerts">
          <AlertsTab thresholds={thresholds} setThresholds={setThresholds} />
        </TabsContent>
        <TabsContent value="api">
          <ApiTab copied={copied} onCopy={copyApiKey} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
