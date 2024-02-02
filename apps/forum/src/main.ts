import { NestFactory } from '@nestjs/core';
import { ForumModule } from './forum.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LEARNIO_FORUM_PACKAGE_NAME } from '@protobuf/forum';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ForumModule, {
      transport: Transport.GRPC,
      options: {
        package: LEARNIO_FORUM_PACKAGE_NAME,
        protoPath: join(__dirname, "../../../libs/protobuf/proto/application.proto")
      }
    });

  await app.listen();
}
bootstrap();
