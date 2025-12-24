import 'reflect-metadata';
import { Container } from '@cryxto/ioc-n-di';

/**
 * Centralized DI container instance
 *
 * This file exports the singleton container used throughout the application.
 * Import this instead of creating new container instances.
 *
 * @example
 * ```typescript
 * import { container } from './container';
 *
 * // Bootstrap providers
 * await container.bootstrap([MyService, OtherService]);
 *
 * // Get service instance
 * const service = container.getInstanceOrThrow(MyService);
 * ```
 */
export const container = Container.createOrGet();
