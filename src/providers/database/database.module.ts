import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { models } from 'src/models';
import { DatabaseService } from './database.service';
import { USER_PROVIDER } from 'src/models/provider';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.CONNECTION_STRING ??
        'mongodb+srv://smadmin:idknikki@social-media.b7jqg.mongodb.net/sm-backend?retryWrites=true&w=majority&appName=social-media',
    ),
    MongooseModule.forFeature(models),
  ],
  providers: [DatabaseService, ...USER_PROVIDER],
  exports: [DatabaseService],
})
export class DatabaseModule {}
