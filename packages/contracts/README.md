# Contracts Package

Shared TypeScript/Zod contracts for frontend and backend communication, focusing on user management and authentication.

## Usage

### In Backend

```typescript
import { UserSchema, type User } from '@packages/contracts';

// Use in API validation
server.post('/users', ({ body }) => {
  // body is validated and typed
}, {
  body: UserSchema
});
```

### In Frontend

```typescript
import { type User, UserSchema } from '@packages/contracts';

// Use for type safety
const user: User = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  // ...
};

// Use for validation
const result = UserSchema.parse(apiResponse);
```

## Available Schemas

### User Management
- **User**: User entity with role, ban status, and email verification
- **Session**: User session with device tracking
- **Account**: Social account connections (OAuth providers)
- **Apikey**: API key management with rate limiting

### Access Control
- **Permission**: Available permissions enum
- **Resource**: Available resources enum
- **RolePermissions**: Role to permissions mapping

## Schema Types

Each entity has a base schema:
- `UserSchema` - Full user entity with all fields
- `SessionSchema` - Session with timestamps and device info
- `AccountSchema` - Social account connection
- `ApikeySchema` - API key with rate limiting config

## TypeScript Types

Each schema exports corresponding TypeScript types:
- `User`, `Session`, `Account`, `Apikey`
- `Permission`, `Resource`, `RolePermissions`

## Enums

### UserRole
- `'admin'` - Full administrative access
- `'regular'` - Standard user access (default)

### Permission
- `'create'`, `'read'`, `'update'`, `'delete'`
- `'share'`, `'revoke'`, `'invite'`
- `'reserve'`, `'approve'`, `'disapprove'`

### Resource
- `'signup'` - User registration
- `'docs'` - Documentation access
- `'user'` - User management
- `'session'` - Session management
- `'account'` - Account management
- `'apikey'` - API key management
- `'test'` - Test resources

## Access Control Helpers

```typescript
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  adminPermissions,
  regularPermissions
} from '@packages/contracts';

// Check single permission
const canEdit = hasPermission('admin', 'user', 'update');

// Check multiple permissions (any)
const hasAccess = hasAnyPermission('admin', 'user', ['read', 'update']);

// Check multiple permissions (all)
const hasFullAccess = hasAllPermissions('admin', 'user', ['create', 'delete']);
```

## Role Permissions

### Admin Role
- Full access to: `user`, `session`, `account`, `apikey`, `signup`
- Read access to: `docs`

### Regular Role
- Read access to: `test`

Use `rolePermissionsMap` to access the complete role-to-permissions mapping.
