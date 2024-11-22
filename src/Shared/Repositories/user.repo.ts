import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, UpdateQuery } from 'mongoose';
import { IUser } from 'src/models/interface';
import { User } from 'src/models/Schemas/user';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private _userModel: Model<User>) {}

  public async getAllUsers() {
    return await this._userModel.find().exec();
  }

  public async getUser(whereCondition: RootFilterQuery<User>) {
    return await this._userModel.findOne(whereCondition).exec();
  }

  public async createUser(user: IUser) {
    return await this._userModel.create(user);
  }

  public async updateUserById(id: string, update: UpdateQuery<User>) {
    return await this._userModel.findByIdAndUpdate(id, update).exec();
  }
}
