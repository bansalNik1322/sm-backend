import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Model,
  PopulateOptions,
  QueryOptions,
  RootFilterQuery,
} from 'mongoose';
import { ContentManager } from 'src/models/Schemas/cms';
import { EmailTemplate } from 'src/models/Schemas/email-template';
import { Faq } from 'src/models/Schemas/faq';
import { Lockout } from 'src/models/Schemas/lockout';
import { LoginAttempt } from 'src/models/Schemas/login-attempts';
import { SecurityQuestion } from 'src/models/Schemas/security-question';
import { Token } from 'src/models/Schemas/token';
import { User } from 'src/models/Schemas/user';

@Injectable()
export class DatabaseService {
  private models: { [key: string]: Model<any> };

  constructor(
    @InjectModel('User') private _userModel: Model<User>,
    @InjectModel('Faq') private _faqModel: Model<Faq>,
    @InjectModel('SecurityQuestion')
    private _securityQuestionModel: Model<SecurityQuestion>,
    @InjectModel('LoginAttempts')
    private _loginAttemptModel: Model<LoginAttempt>,
    @InjectModel('Lockout') private _lockoutModel: Model<Lockout>,
    @InjectModel('Token') private _tokenModel: Model<Token>,
    @InjectModel('EmailTemplate')
    private readonly _emailTemplateModel: Model<EmailTemplate>,
    @InjectModel('ContentManager')
    private readonly _contentManagerModel: Model<ContentManager>,
  ) {
    this.models = {
      User: _userModel,
      LoginAttempt: _loginAttemptModel,
      Lockout: _lockoutModel,
      EmailTemplate: _emailTemplateModel,
      Token: _tokenModel,
      ContentManager: _contentManagerModel,
      SecurityQuestion: _securityQuestionModel,
      Faq: _faqModel,
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
    {
      options,
      sort = {},
      populateOptions = [],
      select = '',
    }: {
      options: RootFilterQuery<T>;
      sort?: Partial<Record<keyof T, 1 | -1>>;
      populateOptions?: PopulateOptions | PopulateOptions[];
      select?: string;
    },
  ) {
    const model = this.getModel<T>(modelName);
    return await model
      .findOne(options, select)
      .populate(populateOptions)
      .sort(sort);
  }

  async findAll<T>(
    modelName: string,
    {
      options,
      sort = {},
      populateOptions = [],
      select = '',
      limit = 10,
      skip = 0,
      selectOptions = {},
    }: {
      options: RootFilterQuery<T>;
      sort?: Partial<Record<keyof T, 1 | -1>>;
      populateOptions?: PopulateOptions | PopulateOptions[];
      select?: string;
      limit?: number;
      skip?: number;
      selectOptions?: Partial<Record<keyof T, 1 | -1>>;
    },
  ) {
    const model = this.getModel<T>(modelName);
    return model
      .find(options, select)
      .select(selectOptions)
      .populate(populateOptions)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async findById<T>(
    modelName: string,
    {
      id,
      populateOptions = [],
      select = '',
    }: {
      id: string;
      select?: string;
      populateOptions?: PopulateOptions | PopulateOptions[];
    },
  ) {
    const model = this.getModel<T>(modelName);
    return model.findById(id, select).populate(populateOptions).exec();
  }

  async findByIdAndUpdate<T>(modelName: string, id: string, data: Partial<T>) {
    const model = this.getModel<T>(modelName);
    return model.findByIdAndUpdate(id, data).exec();
  }

  async countDocuments<T>(modelName: string, options: QueryOptions<T>) {
    const model = this.getModel<T>(modelName);
    console.log('🚀 ~ DatabaseService ~ model:', model);
    return await model.countDocuments(options).exec();
  }

  async delete<T>(modelName: string, id: string) {
    const model = this.getModel<T>(modelName);
    return model.findByIdAndDelete(id).exec();
  }

  async deleteMany<T>(modelName: string, options: QueryOptions<T>) {
    const model = this.getModel<T>(modelName);
    return model.deleteMany(options).exec();
  }

  async findOneAndUpdate<T>(
    modelName: string,
    {
      options,
      update,
    }: {
      options: RootFilterQuery<T>;
      update: Partial<T>;
    },
  ) {
    const model = this.getModel<T>(modelName);
    return await model.findOneAndUpdate(options, update).exec();
  }
}
