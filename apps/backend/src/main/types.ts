import type { createApiServer, createApp } from './factories';

/**
 * Type definitions for the main application components
 *
 * These types are extracted to avoid circular dependencies.
 */

export type ApiServer = Awaited<ReturnType<typeof createApiServer>>;
export type App = Awaited<ReturnType<typeof createApp>>;
