import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  ICreateFaq,
  IGetAllFaq,
  IResponse,
  IUpdateFaq,
} from 'src/common/interfaces/global.interface';
import { Faq } from 'src/models/Schemas/faq';
import { DatabaseService } from 'src/providers/database/database.service';

@Injectable()
export class FaqService {
  constructor(private readonly _mongoService: DatabaseService) {}

  public async getAllFaq(payload: IGetAllFaq): Promise<IResponse> {
    try {
      const { category = null } = payload;
      const page = Number(payload?.page) || 1;
      const limit = Number(payload?.limit) || 10;
      const skip = (page - 1) * limit ? (page - 1) * limit : 0;

      const total = await this._mongoService.countDocuments<Faq>('Faq', {
        ...(category ? { category } : {}),
        deleted_at: { $exists: false },
      });
      const totalPages = Math.ceil(total / limit);

      const data = await this._mongoService.findAll<Faq>('Faq', {
        options: { ...(category ? { category } : {}) },
        limit,
        skip,
        selectOptions: {
          deleted_at: 0,
        },
      });

      return {
        status: true,
        code: HttpStatus.OK,
        data: {
          limit,
          total,
          result: data,
          pages: totalPages,
        },

        message: 'Data Fetched Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getFaq(id: string): Promise<IResponse> {
    try {
      const data = await this._mongoService.findById<Faq>('Faq', {
        id,
      });

      if (!data) throw new HttpException('Invalid Id!', HttpStatus.BAD_REQUEST);

      return {
        data,
        status: true,
        code: HttpStatus.OK,
        message: 'Data Fetched Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async createFaq(payload: ICreateFaq): Promise<IResponse> {
    try {
      await this._mongoService.create<Faq>('Faq', payload);
      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Faq Created Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateFaq(id: string, payload: IUpdateFaq): Promise<IResponse> {
    try {
      const { question, answer, category } = payload;

      const faq = await this._mongoService.findOneAndUpdate<Faq>('Faq', {
        options: { _id: id },
        update: {
          ...(category && { category }),
          ...(question && { question }),
          ...(answer && { answer }),
        },
      });

      if (!faq) throw new HttpException('Invalid ID!', HttpStatus.BAD_REQUEST);

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Faq Updated Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteFaq(id: string): Promise<IResponse> {
    try {
      const faq = await this._mongoService.findOneAndUpdate<Faq>('Faq', {
        options: { _id: new Types.ObjectId(id) },
        update: { deleted_at: new Date() },
      });

      if (!faq)
        throw new HttpException('Invalid Slug!', HttpStatus.BAD_REQUEST);

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Faq Deleted Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
