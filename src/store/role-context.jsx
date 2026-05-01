// Backward compatibility re-exports
// All auth functionality is now in auth-context.jsx
// This file maintains compatibility with existing imports

export {
  AuthProvider as RoleProvider,
  useAuth as useRole,
  getRoleBadgeColor,
  getRoleLabel,
} from "@/store/auth-context"
