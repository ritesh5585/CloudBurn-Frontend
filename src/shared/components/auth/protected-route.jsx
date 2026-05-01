"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/store/auth-context"
import { Spinner } from "@/shared/components/ui/spinner"

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"]

// Routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = ["/login", "/register"]

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading, canView } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Handle auth routes (login/register) - redirect to dashboard if already logged in
  if (AUTH_ROUTES.includes(pathname)) {
    if (isAuthenticated) {
      router.replace("/")
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="w-8 h-8" />
            <p className="text-sm text-muted-foreground">Redirecting...</p>
          </div>
        </div>
      )
    }
    return children
  }

  // Handle protected routes - redirect to login if not authenticated
  if (!isAuthenticated) {
    router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8" />
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles.length > 0 && user) {
    const hasRole = allowedRoles.includes(user.role)
    if (!hasRole) {
      router.replace("/unauthorized")
      return null
    }
  }

  return children
}

// Higher-order component for wrapping page components
export function withAuth(PageComponent, options = {}) {
  const { allowedRoles = [], redirectOnAuth = true } = options

  return function AuthenticatedPage(props) {
    return (
      <ProtectedRoute allowedRoles={allowedRoles}>
        <PageComponent {...props} />
      </ProtectedRoute>
    )
  }
}

// Hook for checking permissions in components
export function useRequireAuth(redirectPath = "/login") {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace(`${redirectPath}?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, loading, redirectPath, router, pathname])

  return {
    isAuthenticated: !loading && isAuthenticated,
    loading,
    user,
  }
}
