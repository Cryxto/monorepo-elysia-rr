import { ConfigSchema } from '@infrastructures/config';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { MikroORM, ReflectMetadataProvider } from '@mikro-orm/libsql';
import { kebabCase } from 'text-case';

const { AUTH_DB_NAME } = ConfigSchema.parse(Bun.env);

(async () => {
  const orm = await MikroORM.init({
    discovery: {
      // we need to disable validation for no entities
      warnWhenNoEntities: false,
    },
    extensions: [EntityGenerator],
    dbName: AUTH_DB_NAME,
    metadataProvider: ReflectMetadataProvider,
    // ...
  });
  const dump = await orm.entityGenerator.generate({
    save: true,
    path: 'src/infrastructures/better-auth/entities',
    fileName: (className) => `${kebabCase(className)}.entity`,
  });
  // console.log(dump);
  dump.forEach((d) => {
    console.log(d);
  });
  await orm.close(true);
})();
