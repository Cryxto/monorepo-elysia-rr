import { ConfigService } from '@infrastructures/config';
import { Keyv } from '@keyv/bigmap';
import { AccessControll } from './access-controll';
import { NodemailerProvider } from '@infrastructures/mail/nodemailer';
import { APIError, betterAuth } from 'better-auth';
import Database from 'bun:sqlite';
import {
  admin,
  apiKey,
  bearer,
  createAuthMiddleware,
  openAPI,
} from 'better-auth/plugins';
import { InvitationService } from '@modules/invitation';
import { SessionQueueSubject } from './session';
import { InternalServerError } from 'elysia';
import { Inject } from '@di';

export const BETTER_AUTH = 'BETTER_AUTH';
export const InjectAuth = () => Inject(BETTER_AUTH);

export function createBetterAuth(
  configService: ConfigService,
  keyv: Keyv,
  accessControll: AccessControll,
  nodemailer: NodemailerProvider,
  invitationService: InvitationService,
  revokeQueueSubject: SessionQueueSubject,
) {
  const auth = betterAuth({
    database: new Database(configService.get('AUTH_DB_NAME')),
    basePath: '/auth',
    plugins: [
      openAPI(),
      bearer(),
      apiKey({
        enableSessionForAPIKeys: true,
        rateLimit: {
          enabled: false,
        },
        storage: 'secondary-storage',
        fallbackToDatabase: true,
      }),
      admin({
        ac: accessControll.access,
        roles: {
          admin: accessControll.admin,
          regular: accessControll.regular,
        },
        defaultRole: 'regular',
      }),
    ],
    trustedOrigins: [configService.get('FRONTEND_URL')],
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ token, url, user }) => {
        const resetUrl = new URL(url);
        resetUrl.pathname = `/api${resetUrl.pathname}`;

        await nodemailer
          .getTransport()
          .sendMail({
            to: user.email,
            text: `Click here to reset ${resetUrl.toString()} or use this token ${token}`,
            subject: 'Reset Password for Orchestrator Account',
          })
          .then((info) => {
            console.log({ info });
          })
          .catch((error) => {
            console.warn(error);
          });
      },
    },
    secondaryStorage: {
      get: (key) => {
        console.log({ key });
        return keyv.get(key);
      },
      delete: async (key) => {
        await keyv.delete(key);
      },
      set: async (key, value, ttl) => {
        if (ttl) {
          await keyv.set(key, value, ttl * 1000);
        } else {
          await keyv.set(key, value);
        }
      },
    },
    session: {
      preserveSessionInDatabase: true,
      storeSessionInDatabase: true,
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path.includes('sign-up/email')) {
          // Get InvitationService from container at runtime
          // const invitationService = container.getInstanceOrThrow(InvitationService);
          const email = ctx.body?.email as string | undefined;
          if (email) {
            const invited = await invitationService.isEligible(email);
            if (!invited) {
              throw new APIError('FORBIDDEN', {
                message: 'Not invited!',
                code: 'FORBIDDEN',
              });
            }
          } else {
            throw new APIError('FORBIDDEN', {
              message: 'Email not provided!',
              code: 'FORBIDDEN',
            });
          }
        }

        if (ctx.path.includes('revoke-session')) {
          console.log('revoke-session');
          revokeQueueSubject.next({
            endpoint: 'revoke-session',
            body: ctx.body,
            sessionToken: ctx.context.session?.session.token,
          });
        } else if (ctx.path.includes('revoke-sessions')) {
          console.log('revoke-sessions');
          revokeQueueSubject.next({
            endpoint: 'revoke-sessions',
            body: ctx.body,
            sessionToken: ctx.context.session?.session.token,
          });
        }
        if (ctx.path.includes('revoke-other-sessions')) {
          console.log('revoke-other-sessions');
          revokeQueueSubject.next({
            endpoint: 'revoke-other-sessions',
            body: ctx.body,
            sessionToken: ctx.context.session?.session.token,
          });
        }
      }),
      after: createAuthMiddleware(async (ctx) => {
        if (ctx.path.includes('sign-up/email')) {
          // Get InvitationService from container at runtime
          // const invitationService = container.getInstanceOrThrow(InvitationService);
          const email = ctx.body?.email as string | undefined;
          if (!email) {
            throw new InternalServerError('Email error on server side!');
          }
          await invitationService.invited(email).catch((error) => {
            console.error(error);
          });
        }
      }),
    },
  });
  return auth;
}

export type BetterAuthInstance = ReturnType<typeof createBetterAuth>;

export type BetterAuth = {
  instance: BetterAuthInstance;
  cleanup: () => void;
};
