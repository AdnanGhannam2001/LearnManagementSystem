import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useStaticAssets(join(__dirname, '../../..', 'public'));
  app.setBaseViewsDir(join(__dirname, '../../..', 'views'));
  app.setViewEngine('pug');

  await app.listen(3000);
}
bootstrap();
