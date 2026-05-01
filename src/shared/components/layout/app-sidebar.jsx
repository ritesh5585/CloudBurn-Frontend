"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Bell,
  Cloud,
  Users,
  FileBarChart,
  Settings,
  Flame,
  Ghost,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/utils/utils"
import { useAuth } from "@/store/auth-context"
import { useState } from "react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard" },
  { href: "/alerts", label: "Alerts", icon: Bell, permission: "alerts" },
  { href: "/cloud-accounts", label: "Cloud Accounts", icon: Cloud, permission: "cloud-accounts" },
  { href: "/zombie-resources", label: "Zombie Resources", icon: Ghost, permission: "zombie-resources" },
  { href: "/teams", label: "Teams", icon: Users, permission: "teams" },
  { href: "/reports", label: "Reports", icon: FileBarChart, permission: "reports" },
  { href: "/settings", label: "Settings", icon: Settings, permission: "settings" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { canView } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const filteredNavItems = navItems.filter((item) => canView(item.permission))

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col w-[240px] lg:w-auto"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-semibold text-lg text-sidebar-foreground"
            >
              CloudBurn
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-sidebar-primary")} />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  )
}
