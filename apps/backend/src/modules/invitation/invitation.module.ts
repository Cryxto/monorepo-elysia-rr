/**
 * Invitation Module
 *
 * Encapsulates invitation service and controller.
 * Services and controllers are automatically available as singletons through DI.
 * Controller registers routes on the API server when instantiated.
 */

import { Group } from '@cryxto/ioc-n-di';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';

export * from './invitation.service';
export * from './invitation.controller';

/**
 * Invitation Module
 *
 * Provides invitation functionality - sending invites and tracking eligibility.
 * Services are globally available via DI container.
 */
@Group({
  providers: [InvitationService, InvitationController],
})
export class InvitationModule {}
