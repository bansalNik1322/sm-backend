import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './providers/database/database.module';
import { AuthModule } from './modules/Auth/auth.module';
import { EmailModule } from './providers/email/email.module';
import { ProfileModule } from './modules/Profile/profile.module';
import { AdminModule } from './modules/Admin/admin.module';

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
  providers: [AppService],
})
export class AppModule {}
