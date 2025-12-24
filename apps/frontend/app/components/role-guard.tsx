import { useAuth } from "@/lib/hooks/use-auth"
import { Navigate } from "react-router"

interface RoleGuardProps {
  children: React.ReactNode
  roles: string | string[]
  redirectTo?: string
  fallback?: React.ReactNode
}

/**
 * RoleGuard - Protects routes based on user roles
 *
 * @example
 * <RoleGuard roles="admin">
 *   <AdminDashboard />
 * </RoleGuard>
 *
 * @example
 * <RoleGuard roles={["admin", "regular"]}>
 *   <Dashboard />
 * </RoleGuard>
 */
export function RoleGuard({
  children,
  roles,
  redirectTo = "/dashboard",
  fallback,
}: RoleGuardProps) {
  const { hasRole, isPending, isAuthenticated } = useAuth()

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!hasRole(roles)) {
    if (fallback) {
      return <>{fallback}</>
    }
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
