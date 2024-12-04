import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, UpdateQuery } from 'mongoose';
import { IEmailTemplate } from 'src/models/interface';
import { EmailTemplate } from 'src/models/Schemas/email-template';

@Injectable()
export class EmailTemplateRepository {
  constructor(
    @InjectModel('EmailTemplate')
    private readonly _emailTemplateModel: Model<EmailTemplate>,
  ) {}

  public async getAllEmailTemplate() {
    return await this._emailTemplateModel.find().exec();
  }

  public async getEmailTemplate(
    whereCondition: RootFilterQuery<EmailTemplate>,
  ) {
    return await this._emailTemplateModel.findOne(whereCondition).exec();
  }

  public async createEmailTemplate(cms: Partial<IEmailTemplate>) {
    return await this._emailTemplateModel.create(cms);
  }

  public async updateEmailTemplateBySlug(
    slug: string,
    update: UpdateQuery<EmailTemplate>,
  ) {
    return await this._emailTemplateModel
      .findOneAndUpdate({ slug }, update)
      .exec();
  }
}
