import z from 'zod';
import { Group, Inject, Injectable, Provider } from '@cryxto/ioc-n-di';

export const ConfigSchema = z.object({
  DB_NAME: z.string().optional().default('main.db'),
  NODE_ENV: z
    .enum(['development', 'production'])
    .optional()
    .default('development'),
  DEFAULT_ADMIN_EMAIL: z.string().optional().default('admin@admin.test'),
  DEFAULT_ADMIN_PASSWORD: z.string().optional().default('123456789'),
  FRONTEND_URL: z.string().optional().default('http://localhost:5173'),
  AUTH_DB_NAME: z.string().optional().default('auth.db'),
  MIGRATE_MODE: z.stringbool().optional().default(false),
  MAIL_USERNAME: z
    .string()
    .optional()
    .default('electa.schmidt64@ethereal.email'),
  MAIL_SECRET: z.string().optional().default('rkWMr93rgTBmD6zzk6'),
  MAIL_PORT: z.coerce.number().default(587),
  MAIL_HOST: z.string().optional().default('smtp.ethereal.email'),
});

export type Config = z.infer<typeof ConfigSchema>;

export const CONFIG = Symbol('CONFIG');

/**
 * Provider for raw config value parsed from environment
 */
export const ConfigValueProvider: Provider<Config> = {
  provide: CONFIG,
  useValue: ConfigSchema.parse(Bun.env),
};

/**
 * ConfigService provides type-safe access to configuration values
 */
@Injectable()
export class ConfigService {
  constructor(
    @Inject(CONFIG)
    private readonly configValue: Config,
  ) {}

  public get<K extends keyof Config>(key: K): Config[K] {
    return this.configValue[key];
  }
}

/**
 * ConfigModule groups all configuration-related providers
 */
@Group({
  providers: [ConfigValueProvider, ConfigService],
})
export class ConfigModule {}
