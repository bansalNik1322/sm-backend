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
      const { page = 1, limit = 10 } = payload;
      const skip = (page - 1) * limit ? (page - 1) * limit : 0;
      const total = Math.ceil(
        (await this._mongoService.countDocuments<ContentManager>(
          'ContentManager',
          {
            deleted: false,
          },
        )) / limit,
      );

      const data = await this._mongoService.findAll<ContentManager>(
        'ContentManager',
        {
          options: { deleted: false },
          limit,
          skip,
          selectOptions: {
            deleted: -1,
          },
        },
      );

      return {
        status: true,
        code: HttpStatus.OK,
        data: {
          total,
          data,
        },

        message: 'Data Fetched Successfully!!',
      };
    } catch (error) {
      console.log('🚀 ~ ContentManagerService ~ getAllContent ~ error:', error);
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
            deleted: false,
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
      await this._mongoService.create<ContentManager>(
        'ContentManager',
        payload,
      );
      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Content Created Successfully!!',
      };
    } catch (error) {
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
            options: { slug, deleted: false },
            update: {
              ...(title && { title }),
              ...(content && { content }),
              ...(metaTitle && { metaTitle }),
              ...(metaDescription && { metaDescription }),
              ...(description && { description }),
              ...(metaKeywords && { metaKeywords }),
              ...(active && { active }),
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
    try {
      const contentManager =
        await this._mongoService.findOneAndUpdate<ContentManager>(
          'ContentManager',
          {
            options: { slug, deleted: false },
            update: { deleted: true },
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
