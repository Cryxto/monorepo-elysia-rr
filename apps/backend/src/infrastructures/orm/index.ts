import { ConfigService } from '../config';
import {
  EntityManager,
  MikroORM,
  ReflectMetadataProvider,
} from '@mikro-orm/libsql';
import { Invitation } from '@entities/invitation.entity';
import type { Provider } from '@cryxto/ioc-n-di';
import { Group } from '@cryxto/ioc-n-di';

/**
 * MikroORM instance provider
 * Initializes the ORM with LibSQL driver for the main database
 */
export const MikroORMProvider: Provider<MikroORM> = {
  provide: MikroORM,
  useFactory: async (configService: ConfigService) => {
    const instance = await MikroORM.init({
      dbName: configService.get('DB_NAME'),
      entities: [Invitation],
      entitiesTs: [Invitation],
      metadataProvider: ReflectMetadataProvider,
      forceUtcTimezone: true,
      debug: configService.get('NODE_ENV') === 'development',
      migrations: {
        safe: true,
      },
    });
    console.log('MikroORM instantiated!');

    // Run migrations if enabled
    if (configService.get('MIGRATE_MODE')) {
      console.log('Running main database schema migration...');
      await instance.schema.updateSchema();
    }

    return instance;
  },
  deps: [ConfigService],
};

/**
 * EntityManager provider
 * Provides access to the MikroORM EntityManager for the main database
 */
export const EntityManagerProvider: Provider<EntityManager> = {
  provide: EntityManager,
  useFactory: (orm: MikroORM) => {
    console.log('EntityManager registered!');
    return orm.em;
  },
  deps: [MikroORM],
};

/**
 * DatabaseModule groups all ORM-related providers
 */
@Group({
  providers: [MikroORMProvider, EntityManagerProvider],
})
export class DatabaseModule {}

export { BaseEntityWithTimestamp } from './base';
