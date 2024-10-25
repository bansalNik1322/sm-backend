import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './providers/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/Auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: '',
    }),
    AuthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
