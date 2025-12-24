# Deployment Guide

## Hybrid Build Strategy

This project uses a **hybrid build approach** for Fly.io deployment:
- Frontend is built **locally** before deployment
- Only the backend code and pre-built frontend assets are deployed
- This avoids React 19 + Bun compatibility issues during Docker build

## Prerequisites

1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Login to Fly: `fly auth login`

## Deployment Steps

### Option 1: Using the Deploy Script (Recommended)

```bash
./deploy.sh
```

This script will:
1. Build the frontend locally
2. Temporarily add build artifacts to git
3. Deploy to Fly.io
4. Clean up git staging

### Option 2: Manual Deployment

```bash
# 1. Build frontend locally
bun run build

# 2. Deploy to Fly.io
fly deploy
```

**Note:** The built frontend in `apps/backend/public/` is gitignored but included in Docker builds via `.dockerignore` configuration.

## How It Works

### Local Build
- `bun run build` compiles the React Router frontend
- Build output goes to `apps/frontend/build/client/`
- Files are copied to `apps/backend/public/` for serving

### Docker Build
- Dockerfile only installs backend dependencies
- Pre-built frontend assets from `apps/backend/public/` are included
- Much faster builds, no Node.js/npm needed in Docker

### API Configuration
- Frontend automatically detects environment:
  - **Development**: Uses `http://localhost:3000`
  - **Production**: Uses same-origin API (no hardcoded URLs)
- Configuration in `apps/frontend/app/lib/config.ts`

## Environment Variables

Set on Fly.io with:
```bash
fly secrets set KEY=value
```

Required secrets:
- `BETTER_AUTH_SECRET` - Auth encryption secret
- Any other backend environment variables

## Troubleshooting

### Build fails locally
- Ensure all dependencies are installed: `bun install`
- Check React Router config in `apps/frontend/react-router.config.ts`

### API calls fail in production
- Check browser console for CORS errors
- Verify backend is serving from correct port (3000)
- Check `apps/frontend/app/lib/config.ts` for URL logic

### Deployment fails
- Ensure `apps/backend/public/` directory exists with built files
- Check Fly.io logs: `fly logs`
