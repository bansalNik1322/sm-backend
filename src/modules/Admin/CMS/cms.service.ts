import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ICreateContentManager,
  IGetAllContentManager,
  IResponse,
  IUpdateContentManager,
} from 'src/common/interfaces/global.interface';
import { ContentManager } from 'src/models/Schemas/cms';
import { DatabaseService } from 'src/providers/database/database.service';

@Injectable()
export class ContentManagerService {
  constructor(private readonly _mongoService: DatabaseService) {}
  public async getAllContent(
    payload: IGetAllContentManager,
  ): Promise<IResponse> {
    try {
      const page = Number(payload?.page) || 1;
      const limit = Number(payload?.limit) || 10;
      const skip = (page - 1) * limit ? (page - 1) * limit : 0;
      const total = await this._mongoService.countDocuments<ContentManager>(
        'ContentManager',
        { deleted_at: { $exists: false } },
      );
      const totalPages = Math.ceil(total / limit);

      const data = await this._mongoService.findAll<ContentManager>(
        'ContentManager',
        {
          options: {},
          limit,
          skip,
          selectOptions: {
            deleted_at: 0,
          },
        },
      );

      return {
        status: true,
        code: HttpStatus.OK,
        data: {
          total,
          result: data,
          limit,
          pages: totalPages,
        },
        message: 'Data Fetched Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, error.INTERNAL_SERVER_ERROR);
    }
  }

  public async getContentBySlug(slug: string): Promise<IResponse> {
    try {
      const data = await this._mongoService.findOne<ContentManager>(
        'ContentManager',
        {
          options: {
            slug,
            deleted_at: new Date(),
          },
        },
      );

      if (!data)
        throw new HttpException('Invalid Slug!', HttpStatus.BAD_REQUEST);

      return {
        data,
        status: true,
        code: HttpStatus.OK,
        message: 'Data Fetched Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async createContent(
    payload: ICreateContentManager,
  ): Promise<IResponse> {
    try {
      const result = await this._mongoService.updateOne<ContentManager>(
        'ContentManager',
        {
          options: {
            slug: payload.slug,
          },
          update: payload,
          upsert: true,
        },
      );
      if (result.upsertedCount === 0) {
        throw new HttpException('Slug already exists', HttpStatus.BAD_REQUEST);
      }

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Content Created Successfully!!',
      };
    } catch (error) {
      console.log('🚀 ~ ContentManagerService ~ error:', error);
      throw new HttpException(error.message, error.status);
    }
  }

  public async updateContent(
    slug: string,
    payload: IUpdateContentManager,
  ): Promise<IResponse> {
    try {
      const {
        title,
        content,
        metaTitle,
        metaDescription,
        description,
        metaKeywords,
        active,
      } = payload;

      const contentManager =
        await this._mongoService.findOneAndUpdate<ContentManager>(
          'ContentManager',
          {
            options: { slug },
            update: {
              ...(title && { title }),
              ...(content && { content }),
              ...(metaTitle && { metaTitle }),
              ...(metaDescription && { metaDescription }),
              ...(description && { description }),
              ...(metaKeywords && { metaKeywords }),
              ...(active !== undefined && { active }),
            },
          },
        );

      if (!contentManager)
        throw new HttpException('Invalid Slug!', HttpStatus.BAD_REQUEST);

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Content Updated Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async deleteContent(slug: string): Promise<IResponse> {
    console.log('🚀 ~ ContentManagerService ~ deleteContent ~ slug:', slug);
    try {
      const contentManager =
        await this._mongoService.findOneAndUpdate<ContentManager>(
          'ContentManager',
          {
            options: { slug },
            update: { deleted_at: new Date() },
          },
        );

      if (!contentManager)
        throw new HttpException('Invalid Slug!', HttpStatus.BAD_REQUEST);

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Content Deleted Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
