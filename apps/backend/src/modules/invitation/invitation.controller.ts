import { Injectable } from '@di';
import { BaseController } from '@common/base.controller';
import { InvitationService } from './invitation.service';
import z from 'zod';
import { type BetterAuth } from '@infrastructures/better-auth';
import { ForbiddenError } from '@infrastructures/exception';
import { type ApiServer } from '@main';
import { InjectServer } from '@main/decorator'; // ✅ Import decorator directly
import { InjectAuth } from '@infrastructures/better-auth/auth';

/**
 * Invitation Controller
 *
 * Handles invitation-related routes.
 * Routes are automatically registered when the controller is instantiated.
 */
@Injectable()
export class InvitationController extends BaseController {
  constructor(
    @InjectServer() server: ApiServer,
    private readonly invitationService: InvitationService,
    @InjectAuth() private readonly auth: BetterAuth,
  ) {
    super(server);
  }

  protected applyRoutes(): void {
    this.server.group('/invitation', { tags: ['Invitation'] }, (route) =>
      route.post(
        '/',
        ({ body, user }) => {
          return this.invitationService.invite(body.invitee, user.email);
        },
        {
          body: z.object({
            invitee: z.string(),
          }),
          auth: true,
          beforeHandle: async (ctx: { user: { id: string } }) => {
            const user = await this.auth.instance.api.userHasPermission({
              body: {
                userId: ctx.user.id,
                permission: { signup: ['invite'] },
              },
            });
            if (!user.success) {
              throw new ForbiddenError(
                'Inviter do not have required permission!',
              );
            }
          },
        },
      ),
    );
  }
}
