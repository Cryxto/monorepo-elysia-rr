# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.3.1
FROM oven/bun:${BUN_VERSION} as base

LABEL fly_launch_runtime="Bun"

# Bun app lives here
WORKDIR /app

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential

# Copy workspace configuration and lock file
COPY package.json bun.lock ./

# Copy workspace packages
COPY packages ./packages
COPY apps/backend ./apps/backend

# Set production environment
ENV NODE_ENV="production"

# Install all dependencies (including workspace dependencies)
RUN bun install

# Copy start script
COPY start.sh ./


# Final stage for app image
FROM base

# Copy entire workspace structure from build stage
COPY --from=build /app /app

# Set working directory to backend app
WORKDIR /app/apps/backend

# Set production environment
ENV NODE_ENV="production"
ENV DB_NAME="/data/main.db"
ENV AUTH_DB_NAME="/data/auth.db"

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
ENTRYPOINT ["/bin/sh", "/app/start.sh"]