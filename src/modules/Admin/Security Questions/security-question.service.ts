import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ICreateSecurityQuestion,
  IGetAllContentManager,
  IResponse,
  IUpdateSecurityQuestion,
} from 'src/common/interfaces/global.interface';
import { SecurityQuestion } from 'src/models/Schemas/security-question';
import { DatabaseService } from 'src/providers/database/database.service';

@Injectable()
export class SecurityQuestionService {
  constructor(private readonly _mongoService: DatabaseService) {}

  public async getAllSecurityQuestions(
    payload: IGetAllContentManager,
  ): Promise<IResponse> {
    try {
      const { page = 1, limit = 10 } = payload;
      const skip = (page - 1) * limit ? (page - 1) * limit : 0;
      const total = await this._mongoService.countDocuments<SecurityQuestion>(
        'SecurityQuestion',
        {},
      );
      const totalPages = Math.ceil(total / limit);

      const data = await this._mongoService.findAll<SecurityQuestion>(
        'SecurityQuestion',
        {
          options: {},
          limit,
          skip,
          select: 'question status createdAt',
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
          pages: totalPages,
          result: data,
        },
        message: 'Data Fetched Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, error.INTERNAL_SERVER_ERROR);
    }
  }

  public async getSecurityQuestion(id: string): Promise<IResponse> {
    try {
      const data = await this._mongoService.findOne<SecurityQuestion>(
        'SecurityQuestion',
        {
          options: {
            _id: id,
          },
        },
      );

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

  public async createSecurityQuestion(
    payload: ICreateSecurityQuestion,
  ): Promise<IResponse> {
    try {
      await this._mongoService.create<SecurityQuestion>(
        'SecurityQuestion',
        payload,
      );
      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Security Question Created Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async updateSecurityQuestions(
    id: string,
    payload: IUpdateSecurityQuestion,
  ): Promise<IResponse> {
    try {
      const { question, status = false } = payload;
      const securityQuestion =
        await this._mongoService.findByIdAndUpdate<SecurityQuestion>(
          'SecurityQuestion',
          id,
          {
            ...(question && { question }),
            ...(status !== undefined && { status }),
          },
        );

      if (!securityQuestion)
        throw new HttpException('Invalid Id!', HttpStatus.BAD_REQUEST);

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Security Question Updated Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  public async deleteSecurityQuestions(id: string): Promise<IResponse> {
    try {
      const securityQuestion =
        await this._mongoService.findOneAndUpdate<SecurityQuestion>(
          'SecurityQuestion',
          {
            options: {
              id,
              user_assigned: { $size: 0 },
            },
            update: { deleted_at: new Date() },
          },
        );

      if (!securityQuestion)
        throw new HttpException('Invalid Id!', HttpStatus.BAD_REQUEST);

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Security Question Deleted Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
