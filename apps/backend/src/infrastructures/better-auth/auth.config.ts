import { container } from '@di';
import { betterAuth } from 'better-auth';
import { admin, apiKey, bearer, openAPI } from 'better-auth/plugins';
import { AccessControll } from './access-controll';
import { ConfigService } from '@infrastructures/config';
import Database from 'bun:sqlite';

/**
 * Minimal auth config for CLI operations
 * Note: This is a simplified version. The main auth is created in better-auth/index.ts
 */

if (import.meta.main) {
  await container.bootstrap([AccessControll, ConfigService]);
}

const accessControll = container.getInstanceOrThrow(AccessControll);
const configService = container.getInstanceOrThrow(ConfigService);

export const auth = betterAuth({
  database: new Database(configService.get('AUTH_DB_NAME')),
  basePath: '/auth',
  plugins: [
    openAPI(),
    bearer(),
    apiKey(),
    admin({
      ac: accessControll.access,
      roles: {
        admin: accessControll.admin,
        regular: accessControll.regular,
      },
      defaultRole: 'regular',
    }),
  ],
  emailAndPassword: {
    enabled: true,
  },
  session: {
    preserveSessionInDatabase: true,
    storeSessionInDatabase: true,
  },
});

export default auth;
