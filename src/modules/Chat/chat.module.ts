import { Module } from '@nestjs/common';
import { HelperService } from 'src/Shared/Services/helper.service';
import { DatabaseService } from 'src/providers/database/database.service';
import { DatabaseModule } from 'src/providers/database/database.module';
import { JWTService } from 'src/Shared/Services/jwt.service';
import { EmailService } from 'src/providers/email/email.service';
import { JwtService } from '@nestjs/jwt';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    ChatService,
    HelperService,
    DatabaseService,
    EmailService,
    JwtService,
    JWTService,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
