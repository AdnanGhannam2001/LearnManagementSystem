import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LEARNIO_AUTH_PACKAGE_NAME } from '@protobuf/auth';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule, {
      transport: Transport.GRPC,
      options: {
        package: LEARNIO_AUTH_PACKAGE_NAME,
        protoPath: join(__dirname, "../../../libs/protobuf/proto/auth.proto")
      }
    });

  await app.listen();
}
bootstrap();
