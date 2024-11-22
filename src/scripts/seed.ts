import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { SeederService } from 'src/modules/seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);

  try {
    await seederService.seed();
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await app.close();
  }
}

bootstrap();
