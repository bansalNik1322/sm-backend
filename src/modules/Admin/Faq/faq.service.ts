import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ICreateFaq,
  IGetAllData,
  IResponse,
  IUpdateFaq,
} from 'src/common/interfaces/global.interface';
import { Faq } from 'src/models/Schemas/faq';
import { DatabaseService } from 'src/providers/database/database.service';

@Injectable()
export class FaqService {
  constructor(private readonly _mongoService: DatabaseService) {}

  public async getAllFaq(payload: IGetAllData): Promise<IResponse> {
    try {
      const { page = 1, limit = 10 } = payload;
      const skip = (page - 1) * limit ? (page - 1) * limit : 0;
      const total = Math.ceil(
        (await this._mongoService.countDocuments<Faq>('Faq', {})) / limit,
      );

      const data = await this._mongoService.findAll<Faq>('Faq', {
        options: {},
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
          total,
          data,
        },

        message: 'Data Fetched Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, error.INTERNAL_SERVER_ERROR);
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
      throw new HttpException(error.message, error.status);
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
      throw new HttpException(error.message, error.status);
    }
  }

  public async updateFaq(id: string, payload: IUpdateFaq): Promise<IResponse> {
    try {
      const { question, answer, category } = payload;

      const faq = await this._mongoService.findOneAndUpdate<Faq>('Faq', {
        options: { id },
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
      throw new HttpException(error.message, error.status);
    }
  }

  public async deleteFaq(id: string): Promise<IResponse> {
    try {
      const faq = await this._mongoService.findOneAndUpdate<Faq>('Faq', {
        options: { id },
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
      throw new HttpException(error.message, error.status);
    }
  }
}
