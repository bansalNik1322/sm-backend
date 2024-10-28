import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './providers/database/database.module';
import { AuthModule } from './modules/Auth/auth.module';
import { EmailModule } from './providers/email/email.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: '',
    }),
    AuthModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
    EmailModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
