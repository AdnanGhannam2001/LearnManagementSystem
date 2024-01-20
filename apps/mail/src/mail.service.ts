import { Mail } from '@common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: Transporter;

  onModuleInit() {
    this.transporter = createTransport({
      host: 'smtp.elasticemail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'adnanghannam88@gmail.com',
        pass: 'EE8D8A70DA5B42094D9DD897D3D457A66B4E' // TODO: put in .env file
      }
    });
  }

  send(mail: Mail) {
    this.transporter.sendMail({
      from: 'adnanghannam88@gmail.com',
      to: mail.receiver,
      subject: mail.subject,
      text: mail.body
    });
  }
}
