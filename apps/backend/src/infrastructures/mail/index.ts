import { Group } from '@cryxto/ioc-n-di';
import { NodemailerProvider } from './nodemailer';

/**
 * MailModule groups all mail-related providers
 */
@Group({
  providers: [NodemailerProvider],
})
export class MailModule {}

export { NodemailerProvider } from './nodemailer';
