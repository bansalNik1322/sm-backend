import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { Lockout } from 'src/models/Schemas/lockout';
import { LoginAttempt } from 'src/models/Schemas/login-attempts';
import { Token } from 'src/models/Schemas/token';
import { User } from 'src/models/Schemas/user';

@Injectable()
export class DatabaseService {
  private models: { [key: string]: Model<any> };

  constructor(
    @InjectModel('User') private _userModel: Model<User>,
    @InjectModel('LoginAttempts')
    private _loginAttemptModel: Model<LoginAttempt>,
    @InjectModel('Lockout') private _lockoutModel: Model<Lockout>,
    @InjectModel('Token') private _tokenModel: Model<Token>,
  ) {
    this.models = {
      User: _userModel,
      LoginAttempt: _loginAttemptModel,
      Lockout: _lockoutModel,
      Token: _tokenModel,
    };
  }

  public getModel<T>(modelName: string): Model<T> {
    return this.models[modelName];
  }

  async create<T>(modelName: string, data: { [key: string]: any }) {
    const model = this.getModel<T>(modelName);
    return model.create(data);
  }

  async findOne<T>(
    modelName: string,
    options: RootFilterQuery<T>,
    sort: Partial<Record<keyof T, 1 | -1>>,
  ) {
    const model = this.getModel<T>(modelName);
    return await model.findOne(options).sort(sort).exec();
  }

  async findAll<T>(modelName: string, options: RootFilterQuery<T>) {
    const model = this.getModel<T>(modelName);
    return model.find(options).exec();
  }

  async findById<T>(modelName: string, id: string) {
    const model = this.getModel<T>(modelName);
    return model.findById(id).exec();
  }

  async update<T>(modelName: string, id: string, data: Partial<T>) {
    const model = this.getModel<T>(modelName);
    return model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async countDocuments<T>(modelName: string, options: RootFilterQuery<T>) {
    const model = this.getModel<T>(modelName);
    return await model.countDocuments(options).exec();
  }

  async delete<T>(modelName: string, id: string) {
    const model = this.getModel<T>(modelName);
    return model.findByIdAndDelete(id).exec();
  }

  async deleteMany<T>(modelName: string, options: RootFilterQuery<T>) {
    const model = this.getModel<T>(modelName);
    return model.deleteMany(options).exec();
  }
}
