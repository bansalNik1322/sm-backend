import { Injectable } from '@nestjs/common';
import { User } from 'src/models/Schemas/user';
import { DatabaseService } from 'src/providers/database/database.service';

@Injectable()
export class SeederService {
  constructor(private readonly _databaseService: DatabaseService) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    console.log("Hey, how're you");
    const existingUser = await this._databaseService.findOne<User>('User', {
      options: { email: 'admin@yopmail.com' },
    });
    if (existingUser) {
      return;
    }

    await this._databaseService.create<User>('User', {
      email: 'admin@yopmail.com',
      password: '123456',
      username: 'silent_knight',
      name: 'Nikhil Bansal',
      email_verified_at: new Date(),
    });
  }
}
