import { useAuth } from "@/lib/hooks/use-auth"
import type { Permission, Resource } from "@packages/contracts"

interface CanProps {
  children: React.ReactNode
  resource: Resource
  permissions: Permission | Permission[]
  requireAll?: boolean
  fallback?: React.ReactNode
}

/**
 * Can - Conditionally renders children based on user permissions (no redirect)
 *
 * @example
 * <Can resource="user" permissions="create">
 *   <Button>Create User</Button>
 * </Can>
 *
 * @example
 * <Can resource="user" permissions={["update", "delete"]} fallback={<ViewOnlyMessage />}>
 *   <EditForm />
 * </Can>
 */
export function Can({
  children,
  resource,
  permissions,
  requireAll = false,
  fallback = null,
}: CanProps) {
  const { checkPermission, checkAnyPermission, checkAllPermissions, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <>{fallback}</>
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
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface CannotProps {
  children: React.ReactNode
  resource: Resource
  permissions: Permission | Permission[]
  requireAll?: boolean
}

/**
 * Cannot - Inverse of Can - renders children when user DOESN'T have permissions
 *
 * @example
 * <Cannot resource="user" permissions="delete">
 *   <ReadOnlyWarning />
 * </Cannot>
 */
export function Cannot({
  children,
  resource,
  permissions,
  requireAll = false,
}: CannotProps) {
  const { checkPermission, checkAnyPermission, checkAllPermissions, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <>{children}</>
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

  if (hasRequiredPermissions) {
    return null
  }

  return <>{children}</>
}
