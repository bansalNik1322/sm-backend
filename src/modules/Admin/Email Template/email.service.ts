import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ICreateEmailTemplate,
  IGetAllEmailTemplates,
  IResponse,
  IUpdateEmailTemplate,
} from 'src/common/interfaces/global.interface';
import { EmailTemplate } from 'src/models/Schemas/email-template';
import { DatabaseService } from 'src/providers/database/database.service';

@Injectable()
export class EmailTemplateService {
  constructor(private readonly _mongoService: DatabaseService) {}

  public async createEmailTemplate(
    payload: ICreateEmailTemplate,
  ): Promise<IResponse> {
    try {
      await this._mongoService.create<EmailTemplate>('EmailTemplate', payload);
      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Email template created successfully',
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getAllEmailTemplates(
    payload: IGetAllEmailTemplates,
  ): Promise<IResponse> {
    try {
      const page = Number(payload?.page) ?? 1;
      const limit = Number(payload?.limit) ?? 10;
      const skip = (page - 1) * limit ? (page - 1) * limit : 0;
      const total = Math.ceil(
        (await this._mongoService.countDocuments<EmailTemplate>(
          'EmailTemplate',
          {},
        )) / limit,
      );

      const data = await this._mongoService.findAll<EmailTemplate>(
        'EmailTemplate',
        {
          options: {},
          limit,
          skip,
          select: 'title slug subject template',
        },
      );

      return {
        status: true,
        code: HttpStatus.OK,
        data: { data, total },
        message: 'Data Fetched Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getEmailTemplateBySlug(slug: string): Promise<IResponse> {
    try {
      const data = await this._mongoService.findOne<EmailTemplate>(
        'EmailTemplate',
        {
          options: {
            slug: slug,
          },
          select: 'title slug subject template',
        },
      );
      if (!data)
        throw new HttpException('Invalid Slug!!', HttpStatus.BAD_REQUEST);

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Data Fetched Successfully!!',
        data,
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateEmailTemplate(
    slug: string,
    payload: IUpdateEmailTemplate,
  ): Promise<IResponse> {
    try {
      const { title, template, subject } = payload;
      const emailTemplate =
        await this._mongoService.findOneAndUpdate<EmailTemplate>(
          'EmailTemplate',
          {
            options: { slug },
            update: {
              ...(title ? { title } : {}),
              ...(template ? { template } : {}),
              ...(subject ? { subject } : {}),
            },
          },
        );

      if (!emailTemplate)
        throw new HttpException('Invalid Slug!!', HttpStatus.BAD_REQUEST);

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Email template updated successfully',
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteEmailTemplate(slug: string): Promise<IResponse> {
    try {
      const emailTemplate =
        await this._mongoService.findOneAndUpdate<EmailTemplate>(
          'EmailTemplate',
          {
            options: {
              slug: slug,
            },
            update: { deleted_at: new Date() },
          },
        );

      if (!emailTemplate)
        throw new HttpException('Invalid Slug!!', HttpStatus.BAD_REQUEST);

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Email template deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
