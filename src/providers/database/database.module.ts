import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { models } from 'src/models';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.CONNECTION_STRING ??
        'mongodb+srv://smadmin:idknikki@social-media.b7jqg.mongodb.net/sm-backend?retryWrites=true&w=majority&appName=social-media',
    ),
    MongooseModule.forFeature(models),
  ],
})
export class DatabaseModule {}
