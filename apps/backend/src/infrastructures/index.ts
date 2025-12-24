import { Group } from '@cryxto/ioc-n-di';
import { ConfigModule } from './config';
import { CacheModule } from './keyv';
import { DatabaseModule } from './orm';
import { MailModule } from './mail';
import { BetterAuthInfraModule } from './better-auth';

@Group({
  providers: [
    ConfigModule, // Configuration management
    CacheModule, // In-memory cache (Keyv)
    DatabaseModule, // Main ORM (MikroORM)
    MailModule, // Email service (Nodemailer)
    BetterAuthInfraModule, // Authentication infrastructure (DB, Access Control, Session, Auth Instance)
  ],
})
export class InfrastructureModule {}
