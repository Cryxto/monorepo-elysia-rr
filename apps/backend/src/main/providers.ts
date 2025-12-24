import type { Provider } from '@cryxto/ioc-n-di';
import {
  BETTER_AUTH_MODULE,
  OPENAPI_BETTER_AUTH,
  BETTER_AUTH,
  type BetterAuthModule,
  type OpenAPIBetterAuth,
  type BetterAuth,
} from '@infrastructures/better-auth';
import { ConfigService } from '@infrastructures/config';
import { EntityManager } from '@mikro-orm/libsql';
import { API_SERVER, APP } from '../common/tokens';
import { CONTROLLERS_READY } from '../common/controllers.token';
import { createApiServer, createApp } from './factories';
import type { ApiServer, App } from './types';

/**
 * Dependency Injection Providers
 *
 * Separated to avoid circular dependencies with the main module.
 */

/**
 * API Server provider - creates the API server with all routes
 */
export const ApiServerProvider: Provider<ApiServer> = {
  provide: API_SERVER,
  useFactory: async (
    configService: ConfigService,
    auth: BetterAuth,
    em: EntityManager,
    betterAuthModule: BetterAuthModule,
    openAPIBetterAuth: OpenAPIBetterAuth,
  ) => {
    return await createApiServer(
      configService,
      auth,
      em,
      betterAuthModule,
      openAPIBetterAuth,
    );
  },
  deps: [
    ConfigService,
    BETTER_AUTH,
    EntityManager,
    BETTER_AUTH_MODULE,
    OPENAPI_BETTER_AUTH,
  ],
};

/**
 * App provider - creates the main Elysia application
 *
 * Depends on CONTROLLERS_READY to ensure all controllers are resolved
 * (and routes registered) before the app is created.
 */
export const AppProvider: Provider<App> = {
  provide: APP,
  useFactory: async (configService: ConfigService, apiServer: ApiServer) => {
    return await createApp(configService, apiServer);
  },
  deps: [ConfigService, API_SERVER, CONTROLLERS_READY],
};
