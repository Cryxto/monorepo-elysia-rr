# Frontend Guards and Authorization Usage Guide

This guide demonstrates how to use the new authentication and authorization guards in the frontend.

## Overview

We've implemented a comprehensive authorization system based on the Better Auth backend:

- **3 Roles**: `admin`, `regular` (default)
- **11 Permissions**: `create`, `read`, `update`, `delete`, `share`, `revoke`, `invite`, `reserve`, `approve`, `disapprove`, `rotate`
- **6 Resources**: `signup`, `docs`, `user`, `session`, `account`, `apikey`

## Guards and Components

### 1. `ProtectedRoute` - Basic Authentication Guard

Ensures user is logged in:

```tsx
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <YourContent />
    </ProtectedRoute>
  )
}
```

### 2. `RoleGuard` - Role-Based Guard

Restricts access based on user role:

```tsx
import { RoleGuard } from "@/components/role-guard"

// Single role
<RoleGuard roles="admin">
  <AdminOnlyContent />
</RoleGuard>

// Multiple roles
<RoleGuard roles={["admin"]}>
  <ContentForAdmins />
</RoleGuard>

// With fallback
<RoleGuard roles="admin" fallback={<AccessDenied />}>
  <AdminPanel />
</RoleGuard>
```

### 3. `PermissionGuard` - Permission-Based Guard

Restricts access based on specific permissions:

```tsx
import { PermissionGuard } from "@/components/permission-guard"

// Single permission
<PermissionGuard resource="apikey" permissions="create">
  <CreateApiKeyButton />
</PermissionGuard>

// Any of multiple permissions (OR logic)
<PermissionGuard resource="user" permissions={["create", "update"]}>
  <UserManagementForm />
</PermissionGuard>

// All permissions required (AND logic)
<PermissionGuard
  resource="user"
  permissions={["create", "delete"]}
  requireAll
>
  <AdvancedUserTools />
</PermissionGuard>

// With fallback
<PermissionGuard
  resource="session"
  permissions="delete"
  fallback={<ReadOnlyView />}
>
  <EditableView />
</PermissionGuard>
```

### 4. `Can` Component - Conditional Rendering (No Redirect)

Shows/hides UI elements based on permissions without redirecting:

```tsx
import { Can, Cannot } from "@/components/can"

// Show button only if user can create API keys
<Can resource="apikey" permissions="create">
  <Button onClick={createApiKey}>Create API Key</Button>
</Can>

// Show different UI for read-only users
<Can resource="user" permissions="update" fallback={<ViewOnlyMessage />}>
  <EditForm />
</Can>

// Show warning if user CANNOT delete
<Cannot resource="session" permissions="delete">
  <Alert>You don't have permission to delete sessions</Alert>
</Cannot>
```

### 5. `useAuth` Hook - Programmatic Permission Checks

For complex logic:

```tsx
import { useAuth } from "@/lib/hooks/use-auth"

function UserManagement() {
  const {
    user,
    role,
    isAdmin,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    hasRole
  } = useAuth()

  const canCreate = checkPermission('user', 'create')
  const canEditOrDelete = checkAnyPermission('user', ['update', 'delete'])
  const hasFullAccess = checkAllPermissions('user', ['create', 'update', 'delete'])

  return (
    <div>
      <h1>Hello, {user?.name}</h1>
      <p>Your role: {role}</p>

      {canCreate && <Button>Create User</Button>}
      {isAdmin() && <AdminTools />}
      {hasRole(['admin']) && <AdvancedFeatures />}
    </div>
  )
}
```

## Role Permissions Matrix

### Admin Role
- **Signup**: create, read, update, delete, approve, disapprove, invite
- **Docs**: create, read, update, delete
- **User**: create, read, update, delete
- **Session**: create, read, update, delete
- **Account**: create, read, update, delete
- **Apikey**: create, read, update, delete


### Regular Role
- **All resources**: read only

## Example: Protected Routes

### Protecting a whole route:

```tsx
// routes/admin-panel.tsx
import { RoleGuard } from "@/components/role-guard"

export default function AdminPanel() {
  return (
    <RoleGuard roles="admin">
      <div>
        <h1>Admin Panel</h1>
        {/* Admin-only content */}
      </div>
    </RoleGuard>
  )
}
```

### Protecting route sections:

```tsx
// routes/user-management.tsx
import { ProtectedRoute } from "@/components/protected-route"
import { Can } from "@/components/can"

export default function UserManagement() {
  return (
    <ProtectedRoute>
      <div>
        <h1>User Management</h1>

        {/* Everyone can see the list */}
        <UserList />

        {/* Only users with create permission see this */}
        <Can resource="user" permissions="create">
          <Button>Add New User</Button>
        </Can>

        {/* Only admins see delete controls */}
        <Can resource="user" permissions="delete">
          <DeleteUserButton />
        </Can>
      </div>
    </ProtectedRoute>
  )
}
```

## Resource Management UIs

The following resource management pages are available at `/settings`:

1. **Profile**: Update name, image, view role
2. **Security**: Change password, change email, verify email
3. **Sessions**: View and revoke active sessions
4. **API Keys**: Create, view, and revoke API keys
5. **Accounts**: Manage social account connections

## Best Practices

1. **Use `ProtectedRoute` at the route level** for basic authentication
2. **Use `RoleGuard`** when entire sections are role-specific
3. **Use `PermissionGuard`** when access depends on specific actions
4. **Use `Can/Cannot`** for UI elements that shouldn't redirect
5. **Use `useAuth` hook** for complex conditional logic

## Permission Checking Examples

```tsx
// Check if user can perform action before making API call
const { checkPermission } = useAuth()

const handleDelete = async (id: string) => {
  if (!checkPermission('session', 'delete')) {
    toast.error("You don't have permission to delete sessions")
    return
  }

  await deleteSession(id)
}

// Disable button instead of hiding it
const canUpdate = checkPermission('user', 'update')

<Button disabled={!canUpdate} onClick={handleUpdate}>
  {canUpdate ? 'Update' : 'Update (No Permission)'}
</Button>

// Show different content based on permissions
const { checkAnyPermission } = useAuth()

{checkAnyPermission('apikey', ['create', 'update']) ? (
  <EditableApiKeyForm />
) : (
  <ReadOnlyApiKeyView />
)}
```

## Type Safety

All resources and permissions are fully typed using the contracts package:

```tsx
import type { Resource, Permission } from "@packages/contracts"

// TypeScript will catch typos
<Can resource="apikey" permissions="create"> // ✅ Valid
<Can resource="apikeys" permissions="create"> // ❌ Type error
<Can resource="apikey" permissions="creates"> // ❌ Type error
```

## Integration with Backend

The frontend guards work seamlessly with the backend Better Auth setup:

- Frontend checks are **client-side only** for UX
- Backend **always validates** permissions on API endpoints
- The frontend guards help prevent unnecessary API calls and improve UX
- They are **not a security measure** - always validate on the backend

## Migration Guide

To add guards to existing routes:

1. Wrap route component with `ProtectedRoute`
2. Replace conditional rendering with `Can` components
3. Use `PermissionGuard` for role-specific sections
4. Replace inline permission checks with `useAuth` hook
5. Update button states using `checkPermission`

Example:

```tsx
// Before
function MyComponent() {
  const { data: session } = useSession()

  if (!session) return <Navigate to="/login" />

  const isAdmin = session.user.role === 'admin'

  return (
    <div>
      {isAdmin && <AdminButton />}
    </div>
  )
}

// After
import { ProtectedRoute } from "@/components/protected-route"
import { RoleGuard } from "@/components/role-guard"

function MyComponent() {
  return (
    <ProtectedRoute>
      <div>
        <RoleGuard roles="admin">
          <AdminButton />
        </RoleGuard>
      </div>
    </ProtectedRoute>
  )
}
```
