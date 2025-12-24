import 'reflect-metadata';
import { ApiServerProvider, AppProvider, APP, type App } from './main';
import { ControllersReadyProvider } from './common/controllers.token';
import { container } from '@container';
import { Provider } from '@cryxto/ioc-n-di';
import { ConfigService } from './infrastructures/config';
import { BETTER_AUTH, type BetterAuth } from '@infrastructures/better-auth';
import { InfrastructureModule } from './infrastructures';
import { RootModule } from './modules';

/**
 * Application providers - all services and infrastructure
 * Order matters: dependencies must be registered before their dependents
 */
export const providers = [
  ControllersReadyProvider,
  InfrastructureModule,
  ApiServerProvider,
  RootModule,
  AppProvider,
] as Array<Provider>;

async function bootstrap() {
  console.log('Starting bootstrap...');

  // Bootstrap all providers at once
  // This will register and resolve all services in the correct order
  // Migrations are run during factory initialization
  await container.bootstrap(providers);

  // Create default users after all services are initialized
  const configService = container.getInstanceOrThrow(ConfigService);
  const auth = container.getInstanceOrThrow<BetterAuth>(BETTER_AUTH);

  console.log('Creating default users...');
  await auth.instance.api
    .createUser({
      body: {
        email: configService.get('DEFAULT_ADMIN_EMAIL'),
        password: configService.get('DEFAULT_ADMIN_PASSWORD'),
        name: 'Admin Utama',
        role: ['admin'],
      },
    })
    .catch((error: any) => {
      console.warn('Admin user creation:', error.message || error);
    });

  console.log('Bootstrap complete! All services initialized.');
}

if (import.meta.main) {
  await bootstrap()
    .then(async () => {
      // Get app from container
      const app = container.getInstanceOrThrow<App>(APP);
      const configService = container.getInstanceOrThrow(ConfigService);

      // Module routes are automatically registered via controller providers

      // Start the server
      app.listen({
        port: 3000,
        hostname:
          configService.get('NODE_ENV') === 'production'
            ? '0.0.0.0'
            : 'localhost',
      });

      console.log(
        `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
      );

      // Array.from(container.getDependencyGraph().entries()).map(
      //   ([key, meta]) => {
      //     const { dependencies, weight } = meta;
      //     console.log({
      //       key,
      //       dependencies,
      //       weight,
      //     });
      //   },
      // );
    })
    .catch((error) => {
      console.error('Bootstrap failed:', error);
      process.exit(1);
    });
}
