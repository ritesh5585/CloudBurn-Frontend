"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"

// Token storage keys
const TOKEN_KEY = "cloudburn_auth_token"
const USER_KEY = "cloudburn_user"

// Role-based permissions (same as role-context)
const permissions = {
  admin: {
    view: ["dashboard", "alerts", "cloud-accounts", "teams", "reports", "settings", "all-costs", "all-teams", "budgets", "zombie-resources"],
    edit: ["cloud-accounts", "teams", "settings", "budgets", "alerts"],
  },
  lead: {
    view: ["dashboard", "alerts", "cloud-accounts", "teams", "reports", "team-costs", "zombie-resources"],
    edit: ["cloud-accounts", "teams", "alerts"],
  },
  developer: {
    view: ["dashboard", "alerts", "assigned-services"],
    edit: [],
  },
}

// Mock auth API (replace with real backend calls)
const mockAuthAPI = {
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 800))

    // Simple validation
    if (!email || !password) {
      throw new Error("Email and password are required")
    }
    if (!email.includes("@")) {
      throw new Error("Please enter a valid email address")
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }

    // Mock user data
    const user = {
      id: "1",
      name: email.split("@")[0].replace(/[^a-zA-Z]/g, "") || "User",
      email: email.toLowerCase(),
      role: "developer",
      organization: "Acme Corp",
      team: "Engineering",
    }

    // Mock token
    const token = `mock_jwt_${btoa(JSON.stringify({ sub: user.id, email: user.email }))}`

    return { user, token }
  },

  register: async (name, email, password, role) => {
    await new Promise(resolve => setTimeout(resolve, 800))

    if (!name || !email || !password) {
      throw new Error("All fields are required")
    }
    if (!email.includes("@")) {
      throw new Error("Please enter a valid email address")
    }
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters")
    }
    if (!/^[A-Z]/.test(password)) {
      throw new Error("Password must start with an uppercase letter")
    }

    const user = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      role: role || "developer",
      organization: "Acme Corp",
      team: "Engineering",
    }

    const token = `mock_jwt_${btoa(JSON.stringify({ sub: user.id, email: user.email }))}`

    return { user, token }
  },

  googleAuth: async (accessToken) => {
    await new Promise(resolve => setTimeout(resolve, 800))

    // In real implementation, accessToken would be validated with Google
    // and user profile fetched from Google API
    const user = {
      id: `google_${Date.now()}`,
      name: "Google User",
      email: "user@gmail.com",
      role: "developer",
      organization: "Acme Corp",
      team: "Engineering",
    }

    const token = `mock_jwt_${btoa(JSON.stringify({ sub: user.id, provider: "google" }))}`

    return { user, token }
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
  },
}

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState(null)

  // Rehydrate session on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      const storedUser = localStorage.getItem(USER_KEY)

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsedUser)
      }
    } catch (e) {
      console.error("Failed to rehydrate auth session:", e)
      // Clear corrupted data
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setAuthLoading(true)
    setError(null)

    try {
      const { user, token } = await mockAuthAPI.login(email, password)

      // Persist session
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))

      setUser(user)
      setToken(token)

      return { success: true, user }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const register = useCallback(async (name, email, password, role) => {
    setAuthLoading(true)
    setError(null)

    try {
      const { user, token } = await mockAuthAPI.register(name, email, password, role)

      // Persist session
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))

      setUser(user)
      setToken(token)

      return { success: true, user }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const loginWithGoogle = useCallback(async (accessToken) => {
    setAuthLoading(true)
    setError(null)

    try {
      const { user, token } = await mockAuthAPI.googleAuth(accessToken)

      // Persist session
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))

      setUser(user)
      setToken(token)

      return { success: true, user }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setAuthLoading(true)

    try {
      await mockAuthAPI.logout()
    } finally {
      // Clear local state
      setUser(null)
      setToken(null)
      setError(null)

      // Clear persisted session
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)

      setAuthLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Permission helpers
  const canView = useCallback((permission) => {
    if (!user?.role) return false
    return (permissions[user.role]?.view ?? []).includes(permission)
  }, [user?.role])

  const canEdit = useCallback((permission) => {
    if (!user?.role) return false
    return (permissions[user.role]?.edit ?? []).includes(permission)
  }, [user?.role])

  const setRole = useCallback((role) => {
    if (user) {
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
    }
  }, [user])

  const value = useMemo(() => ({
    user,
    token,
    loading,
    authLoading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    clearError,
    canView,
    canEdit,
    setRole,
    isAuthenticated: !!user && !!token,
  }), [user, token, loading, authLoading, error, login, register, loginWithGoogle, logout, clearError, canView, canEdit, setRole])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Role badge utilities (exported for UI components)
export function getRoleBadgeColor(role) {
  switch (role) {
    case "admin": return "bg-primary/10 text-primary border-primary/20"
    case "lead": return "bg-success/10 text-success border-success/20"
    case "developer": return "bg-info/10 text-info border-info/20"
    default: return "bg-muted text-muted-foreground"
  }
}

export function getRoleLabel(role) {
  switch (role) {
    case "admin": return "Org Admin"
    case "lead": return "Team Lead"
    case "developer": return "Developer"
    default: return role
  }
}
