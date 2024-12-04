import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, UpdateQuery } from 'mongoose';
import { IContentManager } from 'src/models/interface';
import { ContentManager } from 'src/models/Schemas/cms';

@Injectable()
export class ContentManagerRepository {
  constructor(
    @InjectModel('ContentManager')
    private _contentManagerModel: Model<ContentManager>,
  ) {}

  public async getAllCMS() {
    return await this._contentManagerModel.find().exec();
  }

  public async getCMS(whereCondition: RootFilterQuery<ContentManager>) {
    return await this._contentManagerModel.findOne(whereCondition).exec();
  }

  public async createCMS(cms: Partial<IContentManager>) {
    return await this._contentManagerModel.create(cms);
  }

  public async updateCMSBySlug(
    slug: string,
    update: UpdateQuery<ContentManager>,
  ) {
    return await this._contentManagerModel
      .findOneAndUpdate({ slug }, update)
      .exec();
  }
}
