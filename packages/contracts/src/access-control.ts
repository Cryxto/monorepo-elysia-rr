import { z } from 'zod';

// Permissions enum
export const PermissionSchema = z.enum([
  'create',
  'share',
  'update',
  'delete',
  'read',
  'revoke',
  'invite',
  'reserve',
  'approve',
  'disapprove',
]);

export type Permission = z.infer<typeof PermissionSchema>;

// Resources
export const ResourceSchema = z.enum([
  'signup',
  'docs',
  'user',
  'session',
  'account',
  'apikey',
  'test',
]);

export type Resource = z.infer<typeof ResourceSchema>;

// Role permissions type
export type RolePermissions = {
  [key in Resource]?: Permission[];
};

// Admin role permissions
export const adminPermissions: RolePermissions = {
  signup: ['create', 'read', 'update', 'delete', 'approve', 'disapprove', 'invite'],
  docs: ['read'],
  user: ['create', 'read', 'update', 'delete'],
  session: ['create', 'read', 'update', 'delete'],
  account: ['create', 'read', 'update', 'delete'],
  apikey: ['create', 'read', 'update', 'delete'],
};

// Regular user permissions
export const regularPermissions: RolePermissions = {
  test: ['read'],
};

// Role to permissions mapping
export const rolePermissionsMap: Record<string, RolePermissions> = {
  admin: adminPermissions,
  regular: regularPermissions,
};

// Helper function to check if role has permission for resource
export function hasPermission(
  role: string | null | undefined,
  resource: Resource,
  permission: Permission
): boolean {
  if (!role) return false;

  const permissions = rolePermissionsMap[role];
  if (!permissions) return false;

  const resourcePermissions = permissions[resource];
  if (!resourcePermissions) return false;

  return resourcePermissions.includes(permission);
}

// Helper function to check if role has any of the permissions for resource
export function hasAnyPermission(
  role: string | null | undefined,
  resource: Resource,
  permissions: Permission[]
): boolean {
  return permissions.some(permission => hasPermission(role, resource, permission));
}

// Helper function to check if role has all permissions for resource
export function hasAllPermissions(
  role: string | null | undefined,
  resource: Resource,
  permissions: Permission[]
): boolean {
  return permissions.every(permission => hasPermission(role, resource, permission));
}
