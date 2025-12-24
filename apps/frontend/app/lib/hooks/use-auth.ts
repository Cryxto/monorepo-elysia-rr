import { useSession } from "@/lib/auth"
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  type Permission,
  type Resource,
  type User,
} from "@packages/contracts"

export function useAuth() {
  const { data: session, isPending, error } = useSession()

  const user = session?.user
  const role = user?.role

  const checkPermission = (resource: Resource, permission: Permission): boolean => {
    return hasPermission(role, resource, permission)
  }

  const checkAnyPermission = (resource: Resource, permissions: Permission[]): boolean => {
    return hasAnyPermission(role, resource, permissions)
  }

  const checkAllPermissions = (resource: Resource, permissions: Permission[]): boolean => {
    return hasAllPermissions(role, resource, permissions)
  }

  const hasRole = (requiredRole: string | string[]): boolean => {
    if (!role) return false

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role)
    }

    return role === requiredRole
  }

  const isAdmin = (): boolean => {
    return role === 'admin'
  }

  const isRegular = (): boolean => {
    return role === 'regular'
  }

  return {
    session,
    user,
    role,
    isPending,
    error,
    isAuthenticated: !!session,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    hasRole,
    isAdmin,
    isRegular,
  }
}

export type UseAuthReturn = ReturnType<typeof useAuth>
