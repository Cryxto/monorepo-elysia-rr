import 'reflect-metadata';
import { defineConfig, ReflectMetadataProvider } from '@mikro-orm/libsql';
import { ConfigSchema } from './src/infrastructures/config';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';

const { DB_NAME } = ConfigSchema.parse(Bun.env);

export default defineConfig({
  dbName: DB_NAME,
  metadataProvider: ReflectMetadataProvider,
  extensions: [Migrator, SeedManager],
  forceUtcTimezone: true,
  entities: ['dist/entities'],
  entitiesTs: ['src/entities'],
  seeder: {
    defaultSeeder: 'InitialSeeder',
    path: './seeds',
  },
  migrations: {
    safe: true,
  },
});
