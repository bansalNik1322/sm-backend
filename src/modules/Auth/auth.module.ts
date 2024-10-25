import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from 'src/providers/database/database.service';
import { USER_PROVIDER } from 'src/models/provider';

@Module({
  providers: [AuthService, DatabaseService, ...USER_PROVIDER],
  controllers: [AuthController],
})
export class AuthModule {}
