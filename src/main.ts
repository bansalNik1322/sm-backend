import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/global-exception-filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { translateErrors } from './common/global-exception-filters/transform-errors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());

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
  await app.listen(3000);
}
bootstrap();
