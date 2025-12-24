/**
 * Central module registry
 *
 * Import all feature modules here.
 * The module system automatically extracts providers and controllers.
 */

import { Group } from '@cryxto/ioc-n-di';
import { InvitationModule } from './invitation';

export * from './invitation';

@Group({
  providers: [InvitationModule],
})
export class RootModule {}
