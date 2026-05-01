"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { AppSidebar } from "./app-sidebar"
import { TopBar } from "./top-bar"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/utils/utils"
import { useAuth } from "@/store/auth-context"
import { Spinner } from "@/shared/components/ui/spinner"

export function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { loading, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const normalizedPathname = pathname.replace(/\/$/, '') || '/'
  const isAuthRoute = normalizedPathname === "/login" || normalizedPathname === "/register" || normalizedPathname === "/forgot-password"

  // Route Protection Effect
  useEffect(() => {
    if (!loading && !isAuthenticated && !isAuthRoute) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, isAuthRoute, router])

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8" />
          <p className="text-sm text-muted-foreground">Loading CloudBurn...</p>
        </div>
      </div>
    )
  }

  // If it's an auth route, DO NOT render Sidebar and TopBar
  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <AppSidebar />
        </div>

        {/* Main Content */}
        <div className="lg:pl-[240px] transition-all duration-200">
          <TopBar />
          <main className="p-4 md:p-6 pt-16 lg:pt-6">{children}</main>
        </div>
      </div>
  )
}
