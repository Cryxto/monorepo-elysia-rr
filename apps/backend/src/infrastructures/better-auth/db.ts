import {
  EntityManager,
  MikroORM,
  ReflectMetadataProvider,
} from '@mikro-orm/libsql';
import { ConfigService } from '@infrastructures/config';
import { Account } from './entities/account.entity';
import { Apikey } from './entities/apikey.entity';
import { Session } from './entities/session.entity';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import type { Provider } from '@cryxto/ioc-n-di';

/**
 * BetterAuthDB wraps the separate MikroORM instance for authentication database
 */
export class BetterAuthDB {
  constructor(
    public readonly orm: MikroORM,
    public readonly em: EntityManager,
  ) {}
}

/**
 * Provider for BetterAuth database (separate from main ORM)
 * Initializes a dedicated MikroORM instance for authentication entities
 */
export const BetterAuthDBProvider: Provider<BetterAuthDB> = {
  provide: BetterAuthDB,
  useFactory: async (configService: ConfigService) => {
    const instance = await MikroORM.init({
      metadataProvider: ReflectMetadataProvider,
      dbName: configService.get('AUTH_DB_NAME'),
      entities: [Account, Apikey, Session, User, Verification],
      entitiesTs: [Account, Apikey, Session, User, Verification],
      debug: configService.get('NODE_ENV') === 'development',
      migrations: {
        safe: true,
      },
    });

    console.log('BetterAuthDB instantiated!');

    // Run migrations if enabled
    if (configService.get('MIGRATE_MODE')) {
      console.log('Running auth database schema migration...');
      await instance.schema.updateSchema();
    }

    return new BetterAuthDB(instance, instance.em);
  },
  deps: [ConfigService],
};
