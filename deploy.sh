#!/bin/bash
set -e

echo "🏗️  Building frontend..."
bun run build

echo "🚀 Deploying to Fly.io..."
fly deploy --ha=false

echo "✅ Deployment complete!"
