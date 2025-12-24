import { Injectable } from '@cryxto/ioc-n-di';
import { Invitation } from '@entities/invitation.entity';
import { ConfigService } from '@infrastructures/config';
import { NodemailerProvider } from '@infrastructures/mail/nodemailer';
import { CreateRequestContext, EntityManager, wrap } from '@mikro-orm/libsql';
import { DateTime } from 'luxon';

/**
 * InvitationService manages user invitations
 * Handles invitation creation, email sending, and invitation status tracking
 */
@Injectable()
export class InvitationService {
  constructor(
    private readonly em: EntityManager,
    private readonly mailer: NodemailerProvider,
    private readonly configService: ConfigService,
  ) {}

  async invite(invitee: string, by: string) {
    const invitation = this.em.create(Invitation, {
      by,
      invitee,
      id: Bun.randomUUIDv7(),
    });
    await this.em.persist(invitation).flush();
    await this.mailer.getTransport().sendMail({
      subject: 'Sign Up Invitation for Orchestrator',
      text: `You are invited and able to sign up for Orchestrator Account on ${this.configService.get('FRONTEND_URL')}/signup`,
      to: invitee,
    });
    return wrap(invitation).serialize();
  }

  @CreateRequestContext()
  async isEligible(invitee: string) {
    const invitation = await this.em.findOne(Invitation, { invitee });
    return !!invitation;
  }

  async revoke(id: string) {
    await this.em.transactional(async (tx) => {
      await tx.nativeDelete(Invitation, id);
    });
    return {
      message: 'ok',
    };
  }

  @CreateRequestContext()
  async invited(invitee: string) {
    await this.em.transactional(async (tx) => {
      await tx.nativeUpdate(
        Invitation,
        { invitee },
        { invitedAt: DateTime.now().toUTC().toSQL() },
      );
    });
    return {
      message: 'ok',
    };
  }
}
