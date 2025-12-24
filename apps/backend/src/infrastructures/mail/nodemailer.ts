import { Injectable } from '@cryxto/ioc-n-di';
import { ConfigService } from '@infrastructures/config';
import nodemailer from 'nodemailer';

/**
 * NodemailerProvider provides email transport functionality
 * Uses configuration from ConfigService to set up SMTP transport
 */
@Injectable()
export class NodemailerProvider {
  private transport: ReturnType<typeof nodemailer.createTransport>;

  constructor(private readonly configService: ConfigService) {
    this.transport = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      from: this.configService.get('MAIL_USERNAME'),
      secure: this.configService.get('NODE_ENV') === 'production',
      auth: {
        user: this.configService.get('MAIL_USERNAME'),
        pass: this.configService.get('MAIL_SECRET'),
      },
    });
    console.log('NodemailerProvider instantiated!');
  }

  getTransport() {
    return this.transport;
  }
}
