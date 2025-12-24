/**
 * Main Application Module
 *
 * This module exports all the core application components in a structured way
 * to avoid circular dependencies.
 *
 * NOTE: Decorators are NOT exported from this barrel to prevent circular dependencies.
 * Import decorators directly: import { InjectServer } from '@main/decorator'
 */

// Re-export tokens
export { API_SERVER, APP } from '../common/tokens';

// Re-export types
export type { ApiServer, App } from './types';

// Re-export factories
export { createApiServer, createApp } from './factories';

// Re-export providers
export { ApiServerProvider, AppProvider } from './providers';

// ❌ DO NOT export decorators here - causes circular dependencies
// ✅ Import decorators directly: import { InjectServer } from '@main/decorator'
