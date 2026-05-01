"use client"

import { useTheme } from "next-themes"
import { Bell, ChevronDown, Moon, Sun, Building2, Search, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { useAuth, getRoleBadgeColor, getRoleLabel } from "@/store/auth-context"
import { alerts } from "@/api/mock-data"
import { cn } from "@/utils/utils"
import { useState, useEffect } from "react"

const ROLES = ["admin", "lead", "developer"]

export function TopBar() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { user, setRole, logout, authLoading, canView } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeAlerts = alerts.filter((a) => a.status === "active")
  const criticalAlerts = activeAlerts.filter((a) => a.severity === "critical")

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  // If no user (on public routes), render minimal header
  if (!user) {
    return (
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium">CloudBurn</span>
        </div>
      </header>
    )
  }

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Left — Organization switcher */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 px-3">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{user.organization}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Organizations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Acme Corp
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-4 h-4" />
              Personal Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-muted-foreground text-sm w-64">
          <Search className="w-4 h-4" />
          <span>Search...</span>
          <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-background border border-border rounded">/</kbd>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Role switcher (demo) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <Badge variant="outline" className={cn("text-xs", getRoleBadgeColor(user.role))}>
                {getRoleLabel(user.role)}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ROLES.map((role) => (
              <DropdownMenuItem key={role} onClick={() => setRole(role)}>
                <Badge variant="outline" className={cn("mr-2", getRoleBadgeColor(role))}>
                  {getRoleLabel(role)}
                </Badge>
                {role === user.role && <span className="ml-auto text-primary">Active</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="w-4 h-4" />
              {activeAlerts.length > 0 && (
                <span className={cn(
                  "absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-medium",
                  criticalAlerts.length > 0
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-warning text-warning-foreground"
                )}>
                  {activeAlerts.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Badge variant="secondary">{activeAlerts.length} active</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {activeAlerts.slice(0, 4).map((alert) => (
                <DropdownMenuItem key={alert.id} className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2 w-full">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        alert.severity === "critical"
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : "bg-warning/10 text-warning-foreground border-warning/20"
                      )}
                    >
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{alert.title}</span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center text-primary">
              View all alerts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user.name}</span>
                <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={authLoading}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {authLoading ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
