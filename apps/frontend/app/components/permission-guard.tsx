import { useAuth } from "@/lib/hooks/use-auth"
import { Navigate } from "react-router"
import type { Permission, Resource } from "@packages/contracts"

interface PermissionGuardProps {
  children: React.ReactNode
  resource: Resource
  permissions: Permission | Permission[]
  requireAll?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

/**
 * PermissionGuard - Protects routes/components based on user permissions
 *
 * @example
 * // Require single permission
 * <PermissionGuard resource="user" permissions="create">
 *   <CreateUserButton />
 * </PermissionGuard>
 *
 * @example
 * // Require any of the permissions
 * <PermissionGuard resource="user" permissions={["create", "update"]}>
 *   <UserForm />
 * </PermissionGuard>
 *
 * @example
 * // Require all permissions
 * <PermissionGuard resource="user" permissions={["create", "delete"]} requireAll>
 *   <AdvancedUserManagement />
 * </PermissionGuard>
 */
export function PermissionGuard({
  children,
  resource,
  permissions,
  requireAll = false,
  redirectTo = "/dashboard",
  fallback,
}: PermissionGuardProps) {
  const { checkPermission, checkAnyPermission, checkAllPermissions, isPending, isAuthenticated } = useAuth()

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

  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions]

  let hasRequiredPermissions = false

  if (permissionsArray.length === 1) {
    hasRequiredPermissions = checkPermission(resource, permissionsArray[0])
  } else if (requireAll) {
    hasRequiredPermissions = checkAllPermissions(resource, permissionsArray)
  } else {
    hasRequiredPermissions = checkAnyPermission(resource, permissionsArray)
  }

  if (!hasRequiredPermissions) {
    if (fallback) {
      return <>{fallback}</>
    }
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
