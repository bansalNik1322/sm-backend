import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/providers/database/database.module';
import { HelperService } from 'src/Shared/Services/helper.service';
import { EmailService } from 'src/providers/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { JWTService } from 'src/Shared/Services/jwt.service';
import { DatabaseService } from 'src/providers/database/database.service';

import { ChatGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ChatGateway,
    HelperService,
    EmailService,
    JwtService,
    JWTService,
    DatabaseService,
    SocketService,
  ],
})
export class SocketModule {}
