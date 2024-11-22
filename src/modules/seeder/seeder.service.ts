import { Injectable } from '@nestjs/common';
import { User } from 'src/models/Schemas/user';
import { DatabaseService } from 'src/providers/database/database.service';

@Injectable()
export class SeederService {
  constructor(private readonly _databaseService: DatabaseService) {}

  async seed() {
    console.log('adfdf');
    const dummyUsers = [
      {
        email: 'admin@yopmail.com',
        password: '123456',
        username: 'silent_knight',
        name: 'Nikhil Bansal',
        email_verified_at: new Date(),
      },
      {
        email: 'user1@yopmail.com',
        password: 'password1',
        username: 'cool_user1',
        name: 'John Doe',
        email_verified_at: new Date(),
      },
      {
        email: 'user2@yopmail.com',
        password: 'password2',
        username: 'cool_user2',
        name: 'Jane Smith',
        email_verified_at: new Date(),
      },
      {
        email: 'user3@yopmail.com',
        password: 'password3',
        username: 'awesome_user3',
        name: 'Alice Johnson',
        email_verified_at: new Date(),
      },
      {
        email: 'user4@yopmail.com',
        password: 'password4',
        username: 'awesome_user4',
        name: 'Bob Brown',
        email_verified_at: new Date(),
      },
    ];

    for (const user of dummyUsers) {
      const existingUser = await this._databaseService.findOne<User>('User', {
        options: { email: user.email },
      });

      if (!existingUser) {
        await this._databaseService.create<User>('User', user);
      }
    }
  }
}
