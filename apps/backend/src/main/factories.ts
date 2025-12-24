import cors from '@elysiajs/cors';
import openapi from '@elysiajs/openapi';
import staticPlugin from '@elysiajs/static';
import type {
  BetterAuthModule,
  OpenAPIBetterAuth,
  BetterAuth,
} from '@infrastructures/better-auth';
import { ConfigService } from '@infrastructures/config';
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from '@infrastructures/exception';
import {
  RequestContext,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/libsql';
import { file } from 'bun';
import { Elysia, status } from 'elysia';
import z from 'zod';

/**
 * Factory functions for creating application instances
 *
 * Separated to avoid circular dependencies with types and providers.
 */

/**
 * Create the API server with all routes and middleware
 */
export async function createApiServer(
  configService: ConfigService,
  auth: BetterAuth,
  em: EntityManager,
  BetterAuthModule: BetterAuthModule,
  OpenAPIBetterAuth: OpenAPIBetterAuth,
) {
  return new Elysia({ prefix: 'api' })
    .error({
      ForbiddenError,
      UnprocessableEntityError,
      NotFoundError,
      UnauthorizedError,
    })
    .onError(({ error }) => {
      if (error instanceof UniqueConstraintViolationException) {
        const unprocessableEntityError =
          new UnprocessableEntityError().toResponse();
        return status(
          unprocessableEntityError.status,
          unprocessableEntityError,
        );
      }
    })
    .onBeforeHandle(async ({ path, request }) => {
      RequestContext.enter(em);
      console.log(path);
      if (path === '/api/openapi' || path === '/api/openapi/json') {
        if (configService.get('NODE_ENV') === 'production') {
          const session = await auth.instance.api.getSession({
            headers: request.headers,
          });

          if (!session) {
            throw new UnauthorizedError(
              'You must be logged in to access API documentation',
            );
          }

          if (!session.user.role) {
            throw new UnauthorizedError('You must assigned to a related role!');
          }

          const access = await auth.instance.api.userHasPermission({
            body: {
              userId: session.user.id,
              permission: { docs: ['read'] },
            },
          });

          if (!access.success) {
            throw new ForbiddenError(
              'You are not allowed to access documentation!',
            );
          }

          console.log('You have access!');
        }
      }
    })
    .use(
      openapi({
        mapJsonSchema: { zod: z.toJSONSchema },
        documentation: {
          components: (await OpenAPIBetterAuth.components) as any,
          paths: (await OpenAPIBetterAuth.getPaths()) as any,
        },
      }),
    )
    .use(BetterAuthModule);
}

/**
 * Create the main Elysia application with CORS, static files, and SPA routing
 */
export async function createApp(
  configService: ConfigService,
  apiServer: Awaited<ReturnType<typeof createApiServer>>,
) {
  return new Elysia()
    .use(
      cors({
        origin: [configService.get('FRONTEND_URL')],
        credentials: true,
      }),
    )
    .use(apiServer)
    .use(
      staticPlugin({
        assets: './public/assets',
        prefix: '/assets',
        alwaysStatic: true,
      }),
    )
    .get('/', () => file('./public/index.html'))
    .onError(({ code, path, set }) => {
      if (
        code === 'NOT_FOUND' &&
        !path.startsWith('/api/') &&
        !path.startsWith('/assets')
      ) {
        set.status = 200;
        return file('./public/index.html');
      }
    });
}
