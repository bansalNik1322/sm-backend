import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './providers/database/database.module';
import { AuthModule } from './modules/Auth/auth.module';
import { EmailModule } from './providers/email/email.module';
import { ProfileModule } from './modules/Profile/profile.module';
import { AdminModule } from './modules/Admin/admin.module';
import { AuthGuard } from './Shared/Guards/auth.guard';
import { JWTService } from './Shared/Services/jwt.service';
import { SeederService } from './modules/seeder/seeder.service';
import { DatabaseService } from './providers/database/database.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: '',
    }),
    AuthModule,
    ProfileModule,
    MailerModule.forRoot({
      transport: {
        host: 'mail.24livehost.com',
        auth: {
          user: 'testna12@24livehost.com',
          pass: 'VPp0Y0TUsez',
        },
      },
    }),
    EmailModule,
    AdminModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    SeederService,
    DatabaseService,
    JWTService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Apply the guard globally
    },
  ],
})
export class AppModule {}
