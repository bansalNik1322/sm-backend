import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { models } from 'src/models';

import { DatabaseService } from './database.service';

const mongoUri =
  process.env.CONNECTION_STRING ||
  'mongodb+srv://smadmin:idknikki@social-media.b7jqg.mongodb.net/sm-backend?retryWrites=true&w=majority&appName=social-media';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    MongooseModule.forFeature(models),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService, MongooseModule],
})
export class DatabaseModule {}
