import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { models } from 'src/models';
import mongoose from 'mongoose';
import { UserRepository } from 'src/Shared/Repositories/user.repo';
import { TokenRepository } from 'src/Shared/Repositories/token.repo';
import { ChatRepository } from 'src/Shared/Repositories/chat.repo';

import { DatabaseService } from './database.service';

const mongoUri =
  process.env.CONNECTION_STRING ||
  'mongodb+srv://smadmin:idknikki@social-media.b7jqg.mongodb.net/sm-backend?retryWrites=true&w=majority&appName=social-media';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    MongooseModule.forFeature(models),
  ],
  providers: [DatabaseService, UserRepository, TokenRepository, ChatRepository],
  exports: [
    DatabaseService,
    MongooseModule,
    UserRepository,
    TokenRepository,
    ChatRepository,
  ],
})
export class DatabaseModule implements OnModuleInit {
  onModuleInit() {
    mongoose.set('debug', false);
  }
}
