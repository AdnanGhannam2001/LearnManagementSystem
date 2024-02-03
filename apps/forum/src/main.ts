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
        url: '0.0.0.0:5001',
        package: LEARNIO_FORUM_PACKAGE_NAME,
        protoPath: join(__dirname, "../../../libs/protobuf/proto/forum.proto")
      }
    });

  await app.listen();
}
bootstrap();
