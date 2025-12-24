# Bun + Elysia + React Monorepo Boilerplate

A modern, type-safe full-stack boilerplate using Bun, Elysia, React Router, and Better Auth.

## 🚀 Features

### Backend (Bun + Elysia)
- ⚡ **Bun Runtime** - Ultra-fast JavaScript runtime
- 🦊 **Elysia** - Ergonomic web framework with end-to-end type safety
- 🔐 **Better Auth** - Modern authentication with session management, API keys, and OAuth
- 🗄️ **MikroORM** - Type-safe ORM with SQLite support
- 💉 **Dependency Injection** - Custom DI container with decorators
- 📝 **OpenAPI** - Auto-generated API documentation
- 🎯 **Access Control** - Role-based permissions system
- 🔑 **API Key Management** - Built-in API key authentication

### Frontend (React + Vite)
- ⚛️ **React 19** - Latest React with React Router v7
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔐 **Better Auth Client** - Seamless authentication integration
- 📊 **TanStack Query** - Powerful data fetching and caching
- 🎭 **Shadcn UI** - Beautiful, accessible component library
- 📱 **Responsive Design** - Mobile-first approach

### Monorepo
- 📦 **Bun Workspaces** - Efficient monorepo management
- 🔗 **Shared Contracts** - Type-safe API contracts between frontend and backend
- 🛠️ **TypeScript** - Full type safety across the stack

## 📁 Project Structure

```
.
├── apps/
│   ├── backend/              # Elysia API server
│   │   ├── src/
│   │   │   ├── main/         # Application entry point
│   │   │   │   ├── index.ts      # Barrel exports
│   │   │   │   ├── types.ts      # Type definitions
│   │   │   │   ├── factories.ts  # App & server factories
│   │   │   │   ├── providers.ts  # DI providers
│   │   │   │   └── decorator.ts  # DI decorators
│   │   │   ├── modules/      # Feature modules
│   │   │   ├── entities/     # Database entities
│   │   │   ├── infrastructures/
│   │   │   │   ├── better-auth/  # Auth configuration
│   │   │   │   ├── config/       # Environment config
│   │   │   │   └── orm/          # Database setup
│   │   │   └── common/       # Shared utilities
│   │   └── public/           # Static assets
│   │
│   └── frontend/             # React application
│       ├── app/
│       │   ├── components/   # React components
│       │   ├── routes/       # React Router pages
│       │   ├── lib/
│       │   │   ├── auth.ts       # Better Auth client
│       │   │   ├── api/          # API client functions
│       │   │   └── hooks/        # Custom React hooks
│       │   └── root.tsx      # App entry point
│       └── public/           # Static files
│
└── packages/
    └── contracts/            # Shared TypeScript types
        └── src/
            └── index.ts      # Exported types
```

## 🛠️ Setup

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- Node.js >= 18 (for frontend tooling)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd monorepo-elysia-rr
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:

**Backend** (`apps/backend/.env`):
```env
DATABASE_URL=file:./dev.db
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend** (`apps/frontend/.env`):
```env
VITE_API_URL=http://localhost:3000
```

4. Initialize the database:
```bash
cd apps/backend
bun run migration:create
bun run migration:up
```

## 🚀 Development

### Start All Services

From the root directory:
```bash
# Start both backend and frontend
bun dev
```

Or start individually:

**Backend:**
```bash
cd apps/backend
bun dev
```
Server runs at: http://localhost:3000

**Frontend:**
```bash
cd apps/frontend
bun dev
```
App runs at: http://localhost:5173

### API Documentation

OpenAPI documentation available at:
- http://localhost:3000/api/openapi

## 🏗️ Architecture Patterns

### Backend

#### Dependency Injection
The backend uses a custom DI container with TypeScript decorators:

```typescript
import { Injectable } from '@di';
import { InjectServer } from '@main/decorator';
import type { ApiServer } from '@main';

@Injectable()
export class MyController {
  constructor(
    @InjectServer() private server: ApiServer,
    private myService: MyService,
  ) {}
}
```

**Key Principles:**
- Tokens defined in `common/tokens.ts` to avoid circular dependencies
- Decorators imported directly from `@main/decorator`
- Services auto-injected by type

#### Module Structure
Each module follows a consistent pattern:

```
modules/
  └── feature/
      ├── feature.controller.ts    # Route handlers
      ├── feature.service.ts       # Business logic
      ├── feature.repository.ts    # Data access
      └── index.ts                 # Module exports
```

#### Authentication & Authorization

**Session-based Auth:**
```typescript
// Protected route
route.get('/profile',
  async ({ user }) => ({ user }),
  { auth: true }
);
```

**Permission Checks:**
```typescript
beforeHandle: async ({ user }) => {
  const hasPermission = await auth.instance.api.userHasPermission({
    body: {
      userId: user.id,
      permission: { resource: ['action'] }
    }
  });
  if (!hasPermission.success) {
    throw new ForbiddenError('Insufficient permissions');
  }
}
```

**API Key Auth:**
```typescript
// Create API key
const { data } = await authClient.apiKey.create({
  name: 'my-api-key',
  expiresIn: 86400, // 24 hours in seconds
});

// Use in requests
fetch('/api/resource', {
  headers: {
    'Authorization': `Bearer ${apiKey}`
  }
});
```

### Frontend

#### Authentication
Better Auth client is configured in `app/lib/auth.ts`:

```typescript
import { authClient, useSession } from '@/lib/auth';

// In components
function Profile() {
  const { data: session } = useSession();

  return <div>Welcome, {session?.user.name}</div>;
}

// Sign in
await authClient.signIn.email({
  email: 'user@example.com',
  password: 'password',
});
```

#### API Integration
```typescript
import { useQuery } from '@tanstack/react-query';

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['myData'],
    queryFn: async () => {
      const res = await fetch('/api/my-data', {
        credentials: 'include', // Include cookies
      });
      return res.json();
    },
  });
}
```

#### Protected Routes
```typescript
// In routes
import { ProtectedRoute } from '@/components/protected-route';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

## 🔧 Available Scripts

### Root
- `bun dev` - Start all services
- `bun install` - Install all dependencies

### Backend
- `bun dev` - Start dev server with watch mode
- `bun run migration:create` - Create new migration
- `bun run migration:up` - Run migrations
- `bun run migration:down` - Rollback migrations
- `bun run seed` - Seed database with sample data

### Frontend
- `bun dev` - Start dev server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint

## 📝 Creating New Features

### Backend

1. **Create a new module:**
```bash
cd apps/backend/src/modules
mkdir my-feature
```

2. **Create service:**
```typescript
// my-feature/my-feature.service.ts
import { Injectable } from '@di';

@Injectable()
export class MyFeatureService {
  async doSomething() {
    // Your logic here
  }
}
```

3. **Create controller:**
```typescript
// my-feature/my-feature.controller.ts
import { Injectable } from '@di';
import { BaseController } from '@common/base.controller';
import { InjectServer } from '@main/decorator';
import type { ApiServer } from '@main';

@Injectable()
export class MyFeatureController extends BaseController {
  constructor(
    @InjectServer() server: ApiServer,
    private myFeatureService: MyFeatureService,
  ) {
    super(server);
  }

  protected applyRoutes(): void {
    this.server.group('/my-feature', (route) =>
      route.get('/', () => this.myFeatureService.doSomething())
    );
  }
}
```

4. **Register in DI container:**
```typescript
// src/index.ts
import { MyFeatureController } from '@modules/my-feature/my-feature.controller';
import { MyFeatureService } from '@modules/my-feature/my-feature.service';

// Add to providers array
providers: [
  // ...
  MyFeatureService,
  MyFeatureController,
]
```

### Frontend

1. **Create component:**
```typescript
// app/components/my-component.tsx
export function MyComponent() {
  return <div>My Component</div>;
}
```

2. **Create route:**
```typescript
// app/routes/my-route.tsx
export default function MyRoute() {
  return <MyComponent />;
}
```

3. **Add to navigation** (if needed):
```typescript
// Update app/components/nav-main.tsx or similar
```

## 🔐 Authentication & Authorization

### Roles
- **admin**: Full access to all resources
- **regular**: Limited access (configurable per resource)

### Permissions
Defined per resource with actions:
- `create`, `read`, `update`, `delete`
- `share`, `revoke`, `invite`
- `approve`, `disapprove`, `reserve`

### OAuth Providers
Configure in `apps/backend/src/infrastructures/better-auth/auth.ts`:
- Google
- GitHub
- Discord
- Microsoft

## 🗄️ Database

### Migrations
```bash
# Create migration
bun run migration:create

# Run migrations
bun run migration:up

# Rollback
bun run migration:down
```

### Entities
Define entities in `apps/backend/src/entities/`:
```typescript
import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';

@Entity()
export class MyEntity extends BaseEntity {
  @Property()
  name!: string;
}
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy to Fly.io:**
```bash
./deploy.sh
```

This uses a hybrid build strategy:
- Frontend built locally (avoids React 19 + Bun compatibility issues)
- Backend deployed with pre-built assets
- Zero-downtime deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT

## 🙏 Acknowledgments

- [Bun](https://bun.sh) - Fast JavaScript runtime
- [Elysia](https://elysiajs.com) - Web framework
- [Better Auth](https://better-auth.com) - Authentication library
- [React Router](https://reactrouter.com) - React framework
- [MikroORM](https://mikro-orm.io) - TypeScript ORM
- [Shadcn UI](https://ui.shadcn.com) - UI components

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation links above

---

**Happy coding! 🎉**
