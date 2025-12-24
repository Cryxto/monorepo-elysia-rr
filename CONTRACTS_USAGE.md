# Using @packages/contracts in Frontend

The frontend has access to the shared contracts package that defines all the API schemas and types used across the application.

## Setup Complete ✅

1. **Package dependency added** to `package.json`:
   ```json
   "@packages/contracts": "workspace:*"
   ```

2. **TypeScript path mapping** configured in `tsconfig.json`:
   ```json
   "@packages/contracts": ["../../packages/contracts/src/index.ts"]
   ```

3. **Vite already configured** with `vite-tsconfig-paths` plugin for path resolution

## How to Use

### Import Types

```typescript
import type {
  // User & Auth
  User,
  Session,
  Account,
  Apikey,

  // Access Control
  Permission,
  Resource,
  RolePermissions,
} from "@packages/contracts";
```

### Import Schemas (for validation)

```typescript
import {
  // Schemas
  UserSchema,
  SessionSchema,
  AccountSchema,
  ApikeySchema,

  // Enums
  UserRoleSchema,
  PermissionSchema,
  ResourceSchema,
} from "@packages/contracts";

// Use for runtime validation
const user = UserSchema.parse(data);
```

### Import Access Control Helpers

```typescript
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  adminPermissions,
  regularPermissions,
  rolePermissionsMap,
} from "@packages/contracts";

// Check if user has permission
const canEdit = hasPermission(userRole, 'user', 'update');
```

## Available Types

### **User Management**
- `User` - User entity with role and ban information
- `Session` - User session with device info
- `Account` - Social account connections
- `Apikey` - API key with rate limiting

### **Access Control**
- `Permission` - Available permissions (create, read, update, delete, etc.)
- `Resource` - Available resources (user, session, account, apikey, etc.)
- `RolePermissions` - Mapping of roles to permissions

## Example: User API

```typescript
import type { User } from "@packages/contracts";

export const userApi = {
  async list(params: { limit?: number; offset?: number }) {
    const response = await fetchWithAuth<{
      users: User[]
      total: number
    }>(`${API_BASE_URL}/admin/list-users`, {
      query: params
    })

    return response.data
  },

  async setRole(userId: string, role: string) {
    return fetchWithAuth<User>(`${API_BASE_URL}/admin/set-role`, {
      method: "POST",
      body: JSON.stringify({ userId, role }),
    })
  }
}
```

## Benefits

✅ **Single source of truth** - Types are defined once in contracts package
✅ **Type safety** - Frontend and backend share exact same types
✅ **No duplication** - Don't maintain separate type definitions
✅ **Consistency** - API contracts are always in sync
✅ **Validation** - Can use Zod schemas for runtime validation
✅ **Access Control** - Shared permission helpers across the app
