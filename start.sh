#!/bin/sh
set -e

# Run migrations silently (main migrations happen in src/index.ts)
# bun db:migrate 
# bun auth:migrate 
# bun db:migrate > /dev/null 2>&1 || true
# bun auth:migrate > /dev/null 2>&1 || true

# Start the application
bun start