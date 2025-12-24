# Production Build Guide

## Overview

This project uses a monorepo structure with a React Router v7 frontend and Elysia backend. The production build process compiles the frontend into static assets and serves them from the backend.

## Build Architecture

```
Frontend (React Router v7 SPA)
    ↓ (build)
apps/frontend/build/client/
    ↓ (copy)
apps/backend/public/
    ↓ (serve)
Elysia Static Plugin (@elysiajs/static)
```

## Build Commands

### Full Production Build

```bash
bun run build
```

This command:
1. Builds the frontend using `react-router build` (SPA mode)
2. Copies the built client files from `apps/frontend/build/client` to `apps/backend/public`

### Individual Commands

```bash
# Build frontend only
bun run frontend:build

# Copy frontend build to backend public directory
bun run copy:frontend

# Start backend in production mode
bun run backend:start
```

## Production Deployment

### Step 1: Build the application

```bash
bun run build
```

### Step 2: Start the backend server

```bash
bun run backend:start
```

The backend server will:
- Run on port 3000
- Serve API endpoints at `/api/*`
- Serve the frontend SPA from `/ui` using `@elysiajs/static`
- Handle authentication at `/api/auth/*`

### Environment Variables

Make sure to set the following environment variables in production:

```bash
# Backend (.env in apps/backend)
NODE_ENV=production
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=securepassword
```

## Static File Serving

The backend uses `@elysiajs/static` plugin configured in `apps/backend/src/main.ts`:

```typescript
.use(
  staticPlugin({
    prefix: '/ui',
    alwaysStatic: true,
  }),
)
```

This configuration:
- Serves all files from `apps/backend/public/` directory
- Maps to `/ui` path
- Always serves static files (including index.html for SPA routing)
- Frontend is accessible at `http://localhost:3000/ui`

## Frontend Build Output

The React Router build (SPA mode) generates:

```
apps/frontend/build/client/
├── index.html          # Main HTML file
├── favicon.ico         # Favicon
├── assets/             # JavaScript and CSS bundles
│   ├── *.js           # Hashed JavaScript files
│   └── *.css          # Hashed CSS files
└── .vite/             # Vite manifest
    └── manifest.json
```

## Git Configuration

The `apps/backend/public/` directory is git-ignored except for `.gitkeep`:

```gitignore
# Production build output (frontend built files)
/public/*
!/public/.gitkeep
```

This ensures:
- Build artifacts are not committed to version control
- The directory structure is preserved
- Clean repository with no build output

## Development vs Production

### Development Mode

```bash
# Run both frontend and backend in dev mode
bun dev

# Or separately
bun backend:dev  # Backend on port 3000
bun frontend:dev # Frontend on port 5173
```

In development:
- Frontend runs on its own dev server (Vite) with HMR
- Backend has CORS enabled for `http://localhost:5173`
- Changes are watched and auto-reloaded

### Production Mode

```bash
bun run build
bun run backend:start
```

In production:
- Frontend is served as static files from backend
- Single port (3000) for both API and frontend
- No CORS issues (same origin)
- Optimized and minified assets

## Troubleshooting

### Build fails

```bash
# Clean and rebuild
rm -rf apps/frontend/build
bun run build
```

### Static files not served

Check that:
1. `apps/backend/public/` exists and contains `index.html`
2. Static plugin is properly configured in `apps/backend/src/main.ts`
3. Backend is running on port 3000

### API calls fail

Ensure:
1. Frontend is built with correct API endpoint configuration
2. Better Auth client is configured for production URL
3. Backend is running and accessible

## Performance Optimization

The build process includes:

- **Tree shaking**: Removes unused code
- **Minification**: Compresses JavaScript and CSS
- **Code splitting**: Lazy loads routes
- **Asset hashing**: Enables long-term caching
- **Gzip compression**: Reduces transfer size

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production environment variables
- [ ] Run `bun run build`
- [ ] Test the production build locally
- [ ] Verify all routes work (SPA routing)
- [ ] Check API endpoints are accessible
- [ ] Test authentication flow
- [ ] Monitor application logs
- [ ] Set up proper database backups
- [ ] Configure reverse proxy (nginx/caddy) if needed
- [ ] Enable HTTPS in production

## Continuous Integration

Example GitHub Actions workflow:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - run: bun run backend:start
```

## Additional Notes

- The frontend is built in **SPA mode** (`ssr: false` in `react-router.config.ts`)
- React Router v7 generates optimized client-side bundles
- The backend uses Bun runtime for optimal performance
- Database migrations should be run before starting the backend
- Better Auth migrations: `bun --filter backend auth:migrate`

### Base Path Configuration

The frontend is configured to work with the `/ui/` base path using Vite's `base` option:

**Frontend (vite.config.ts):**
```typescript
export default defineConfig({
  base: "/ui/",
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
```

**Backend (main.ts):**
```typescript
.use(
  staticPlugin({
    prefix: '/ui',
    alwaysStatic: true,
  }),
)
```

**How it works:**
- Vite's `base: "/ui/"` prefixes all asset paths (JS, CSS) with `/ui/`
- React Router automatically uses Vite's base for asset loading
- The static plugin serves files from `apps/backend/public` at `/ui`
- No need to manually set React Router's `basename` - it uses the default `/`

**Result:**
- Frontend accessible at: `http://localhost:3000/ui`
- Assets loaded from: `http://localhost:3000/ui/assets/*`
- API endpoints at: `http://localhost:3000/api/*`
- Clean separation between UI and API routes
