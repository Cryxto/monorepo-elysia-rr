import type { Provider } from '@cryxto/ioc-n-di';
import { InfrastructureModule } from '@infrastructures/index';
import { RootModule } from '@modules/index';
// import { AllControllers } from '../modules';

/**
 * CONTROLLERS_READY token
 *
 * This is a marker token that ensures all controllers are instantiated
 * before the APP is created.
 */
export const CONTROLLERS_READY = 'CONTROLLERS_READY';

/**
 * Controllers ready provider
 *
 * Depends on all controllers from the central module registry.
 * This is a "monkey deps" provider - it doesn't do anything except
 * force controllers to be resolved first.
 *
 * Controllers are automatically pulled from modules/index.ts,
 * so no need to manually maintain this list!
 */
export const ControllersReadyProvider: Provider<any> = {
  provide: CONTROLLERS_READY,
  useValue: CONTROLLERS_READY,
  deps: [RootModule, InfrastructureModule],
};
