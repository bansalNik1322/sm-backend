import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/models/Schemas/user';

@Injectable()
export class DatabaseService {
  private models: { [key: string]: Model<any> };

  constructor(@Inject('USER_PROVIDER') private _userModel: Model<User>) {
    this.models = {
      User: _userModel,
    };
  }

  public getModel(modelName: string) {
    return this.models[modelName];
  }

  async create(modelName: string, data: any) {
    const model = this.getModel(modelName);
    return model.create(data);
  }

  async findAll(modelName: string) {
    const model = this.getModel(modelName);
    return model.find().exec();
  }
  async findById(modelName: string, id: string) {
    const model = this.getModel(modelName);
    return model.findById(id).exec();
  }

  async update(modelName: string, id: string, data: any) {
    const model = this.getModel(modelName);
    return model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(modelName: string, id: string) {
    const model = this.getModel(modelName);
    return model.findByIdAndDelete(id).exec();
  }
}
