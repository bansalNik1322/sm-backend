import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import mongoose from 'mongoose';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/global-exception-filters/http-exception.filter';
import { translateErrors } from './common/global-exception-filters/transform-errors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('v1/api/');

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      transform: true,
      validationError: {
        target: false,
      },
      exceptionFactory: translateErrors,
      forbidUnknownValues: false,
    }),
  );
  app.useGlobalPipes(new ValidationPipe());

  mongoose.set('debug', true);

  await app.listen(3002);
}
bootstrap();
