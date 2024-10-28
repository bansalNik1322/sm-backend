import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/providers/database/database.service';
import { HelperService } from 'src/Shared/Services/helper.service';

import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, DatabaseService, HelperService],
})
export class ProfileModule {}
