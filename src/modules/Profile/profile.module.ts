import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/providers/database/database.service';
import { HelperService } from 'src/Shared/Services/helper.service';
import { DatabaseModule } from 'src/providers/database/database.module';
import { JWTService } from 'src/Shared/Services/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/providers/email/email.service';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    DatabaseService,
    JWTService,
    HelperService,
    JwtService,
    EmailService,
  ],
})
export class ProfileModule {}
