import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/providers/database/database.module';
import { DatabaseService } from 'src/providers/database/database.service';
import { AppLogger } from 'src/providers/logger/logger.service';

import { EmailTemplateService } from './Email Template/email.service';
import { EmailController } from './Email Template/email.controller';
import { ContentManagerController } from './CMS/cms.controller';
import { ContentManagerService } from './CMS/cms.service';

@Module({
  controllers: [EmailController, ContentManagerController],
  providers: [
    EmailTemplateService,
    DatabaseService,
    AppLogger,
    ContentManagerService,
  ],
  imports: [DatabaseModule],
})
export class AdminModule {}
