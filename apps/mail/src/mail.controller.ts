import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Mail } from '@common';

@Controller()
export class MailController {
  constructor(private readonly service: MailService) {}

  @EventPattern('send')
  send(@Payload() mail: Mail, @Ctx() context: RmqContext) {
    this.service.send(mail);
  }
}
