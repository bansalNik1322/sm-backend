import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/providers/database/database.module';
import { DatabaseService } from 'src/providers/database/database.service';
import { AppLogger } from 'src/providers/logger/logger.service';

import { EmailTemplateService } from './Email Template/email.service';
import { EmailController } from './Email Template/email.controller';
import { ContentManagerController } from './CMS/cms.controller';
import { ContentManagerService } from './CMS/cms.service';
import { FaqController } from './Faq/faq.controller';
import { SecurityQuestionController } from './Security Questions/security-question.controller';
import { FaqService } from './Faq/faq.service';
import { SecurityQuestionService } from './Security Questions/security-question.service';

@Module({
  controllers: [
    EmailController,
    ContentManagerController,
    FaqController,
    SecurityQuestionController,
  ],
  providers: [
    EmailTemplateService,
    FaqService,
    SecurityQuestionService,
    DatabaseService,
    AppLogger,
    ContentManagerService,
  ],
  imports: [DatabaseModule],
})
export class AdminModule {}
