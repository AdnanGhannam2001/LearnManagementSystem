import { NestFactory } from '@nestjs/core';
import { MailModule } from './mail.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RmqService } from '@rmq';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailModule,
    RmqService.configurations('MailService', true));

  await app.listen();
}
bootstrap();
