import { Mail } from '@common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: Transporter;

  constructor(private readonly config: ConfigService) { }

  onModuleInit() {
    this.transporter = createTransport({
      host: 'smtp.elasticemail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.config.get<string>('MAIL'),
        pass: this.config.get<string>('MAIL_PASS')
      }
    });
  }

  send(mail: Mail) {
    this.transporter.sendMail({
      from: this.config.get<string>('MAIL'),
      to: mail.receiver,
      subject: mail.subject,
      text: mail.body
    });
  }
}
