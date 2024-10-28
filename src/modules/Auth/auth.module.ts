import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/providers/database/database.service';
import { DatabaseModule } from 'src/providers/database/database.module';
import { HelperService } from 'src/Shared/Services/helper.service';
import { JWTService } from 'src/Shared/Services/jwt.service';
import { EmailService } from 'src/providers/email/email.service';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    AuthService,
    DatabaseService,
    EmailService,
    HelperService,
    JWTService,
    JwtService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
