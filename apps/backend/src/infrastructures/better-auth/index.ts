import type { Provider } from '@cryxto/ioc-n-di';
import { Group } from '@cryxto/ioc-n-di';
import Elysia from 'elysia';
import { Keyv } from '@keyv/bigmap';
import { BetterAuthDB, BetterAuthDBProvider } from './db';
import { AccessControll } from './access-controll';
import { SessionQueueProvider, SESSION_QUEUE_SUBJECT } from './session';
import {
  catchError,
  defer,
  filter,
  from,
  mergeMap,
  of,
  retry,
  Subject,
  takeUntil,
  timer,
} from 'rxjs';
import type { SessionQueueSubject } from './session';
import { InvitationService } from '@modules/invitation/invitation.service';
import { Session } from './entities/session.entity';
import { ConfigService } from '@infrastructures/config';
import { NodemailerProvider } from '@infrastructures/mail/nodemailer';
import { syncTryCatchBulk } from '@helpers/execution';
import {
  BETTER_AUTH,
  type BetterAuth,
  type BetterAuthInstance,
  createBetterAuth,
} from './auth';

/**
 * BetterAuth provider - creates the auth instance with all dependencies
 * Note: InvitationService will be retrieved from container when needed to avoid circular dependency
 */
export const BetterAuthProvider: Provider<BetterAuth> = {
  provide: BETTER_AUTH,
  useFactory: (
    configService: ConfigService,
    keyv: Keyv,
    authDB: BetterAuthDB,
    accessControll: AccessControll,
    nodemailer: NodemailerProvider,
    invitationService: InvitationService,
    revokeQueueSubject: SessionQueueSubject,
  ) => {
    console.log('Initializing BetterAuth...');
    const auth = createBetterAuth(
      configService,
      keyv,
      accessControll,
      nodemailer,
      invitationService,
      revokeQueueSubject,
    );

    // Set up revocation queue subscription
    const destroy$ = new Subject<void>();
    const revokeSubscription = revokeQueueSubject
      .asObservable()
      .pipe(
        filter((v) => !!v),
        takeUntil(destroy$),
        mergeMap(({ body, endpoint, sessionToken }) =>
          defer(() => {
            switch (endpoint) {
              case 'revoke-session':
                return from(
                  authDB.em.fork().transactional(async (tx) => {
                    if (typeof body?.token === 'string') {
                      await tx.nativeDelete(Session, { token: body.token });
                    }
                  }),
                );

              case 'revoke-sessions':
                return from(
                  authDB.em.fork().transactional(async (tx) => {
                    await tx.nativeDelete(Session, { id: { $exists: true } });
                  }),
                );

              case 'revoke-other-sessions':
                return from(
                  authDB.em.fork().transactional(async (tx) => {
                    if (sessionToken) {
                      await tx.nativeDelete(Session, {
                        $not: { token: sessionToken },
                      });
                    }
                  }),
                );

              default:
                return of(null);
            }
          }).pipe(
            takeUntil(destroy$),
            retry({
              count: 3,
              delay: (error, attempt) => {
                console.log(error.message);
                console.log(`attempt : ${attempt}`);
                return timer(attempt * 1000);
              },
            }),
          ),
        ),
        catchError((error: Error) => {
          console.error(error.message);
          return of(null);
        }),
      )
      .subscribe();

    // Set up cleanup handlers
    const cleanup = () => {
      syncTryCatchBulk([
        () => destroy$.next(),
        () => destroy$.complete(),
        () => destroy$.unsubscribe(),
        () => revokeQueueSubject.complete(),
        () => revokeSubscription?.unsubscribe(),
      ]);
    };

    process.once('exit', cleanup);
    process.once('SIGTERM', () => {
      cleanup();
      process.exit(0);
    });
    process.once('SIGINT', () => {
      cleanup();
      process.exit(0);
    });
    process.once('beforeExit', cleanup);

    return {
      instance: auth,
      cleanup,
    };
  },
  deps: [
    ConfigService,
    Keyv,
    BetterAuthDB,
    AccessControll,
    NodemailerProvider,
    InvitationService,
    SESSION_QUEUE_SUBJECT,
  ],
};

/**
 * BetterAuthModule - Elysia plugin for mounting better-auth routes
 * This should be created after BetterAuth is resolved
 */
export function createBetterAuthModule(auth: BetterAuth) {
  return new Elysia({ name: 'better-auth' })
    .mount('/', auth.instance.handler)
    .macro({
      auth: {
        async resolve({ status, request: { headers } }) {
          const session = await auth.instance.api.getSession({
            headers,
          });

          if (!session) return status(401);

          return {
            user: session.user,
            session: session.session,
          };
        },
      },
    });
}

export const BETTER_AUTH_MODULE = 'BETTER_AUTH_MODULE';
export type BetterAuthModule = ReturnType<typeof createBetterAuthModule>;

/**
 * BetterAuthModule provider - creates the Elysia plugin for better-auth routes
 */
export const BetterAuthModuleProvider: Provider<BetterAuthModule> = {
  provide: BETTER_AUTH_MODULE,
  useFactory: (auth: BetterAuth) => {
    return createBetterAuthModule(auth);
  },
  deps: [BETTER_AUTH],
};

/**
 * OpenAPI schema helper for better-auth
 * @link https://elysiajs.com/integrations/better-auth
 */
export function createOpenAPIBetterAuth(auth: BetterAuth) {
  let _schema: ReturnType<BetterAuthInstance['api']['generateOpenAPISchema']>;
  const getSchema = async () =>
    (_schema ??= auth.instance.api.generateOpenAPISchema());

  return {
    getPaths: (prefix = '/api/auth') =>
      getSchema().then(({ paths }) => {
        const reference: typeof paths = Object.create(null);

        for (const path of Object.keys(paths)) {
          const key = prefix + path;
          reference[key] = paths[path];

          for (const method of Object.keys(paths[path])) {
            const operation = (reference[key] as any)[method];
            operation.tags = ['Better Auth'];
          }
        }

        return reference;
      }),
    components: getSchema().then(({ components }) => components),
  };
}

export const OPENAPI_BETTER_AUTH = 'OPENAPI_BETTER_AUTH';
export type OpenAPIBetterAuth = ReturnType<typeof createOpenAPIBetterAuth>;

/**
 * OpenAPIBetterAuth provider - creates the OpenAPI schema helper for better-auth
 */
export const OpenAPIBetterAuthProvider: Provider<OpenAPIBetterAuth> = {
  provide: OPENAPI_BETTER_AUTH,
  useFactory: (auth: BetterAuth) => {
    return createOpenAPIBetterAuth(auth);
  },
  deps: [BETTER_AUTH],
};

/**
 * BetterAuthInfraModule groups all auth infrastructure providers
 * Includes: DB, Access Control, Session Queue, Auth Instance, Module, and OpenAPI
 */
@Group({
  providers: [
    BetterAuthDBProvider,
    AccessControll,
    SessionQueueProvider,
    BetterAuthProvider,
    BetterAuthModuleProvider,
    OpenAPIBetterAuthProvider,
  ],
})
export class BetterAuthInfraModule {}

// Re-export types and constants from auth module
export { BETTER_AUTH } from './auth';
export type { BetterAuth, BetterAuthInstance } from './auth';
export { BetterAuthDB, BetterAuthDBProvider } from './db';
export { AccessControll } from './access-controll';
export { SessionQueueProvider, SESSION_QUEUE_SUBJECT } from './session';
