import { Inject } from '@di';
import { API_SERVER } from '../common/tokens';

/**
 * Decorator wrappers for dependency injection
 *
 * These decorators provide convenient shortcuts for common injections.
 * They import tokens from '../common/tokens' to avoid circular dependencies.
 */

export const InjectServer = () => Inject(API_SERVER);
