import { Container } from '@cryxto/ioc-n-di';

/**
 * Main DI Container for the application (Singleton)
 *
 * This is the centralized dependency injection container that manages
 * all service instances throughout the application lifecycle.
 *
 * Use Container.createOrGet() to access the singleton instance.
 */
export const container = Container.createOrGet();

/**
 * Re-export types and decorators for convenience
 */
export {
  Container,
  Injectable,
  Inject,
  Lazy,
  type Provider,
} from '@cryxto/ioc-n-di';

/**
 * Utility to get injected instance from container (synchronously)
 * This provides a cleaner API similar to the old IoC.inject()
 *
 * @throws Error if instance is not found
 */
export function inject<T>(token: any): T {
  return container.getInstanceOrThrow<T>(token);
}

/**
 * Utility to get injected instance without throwing
 * Returns undefined if not found
 */
export function injectOptional<T>(token: any): T | undefined {
  return container.getInstance<T>(token);
}
