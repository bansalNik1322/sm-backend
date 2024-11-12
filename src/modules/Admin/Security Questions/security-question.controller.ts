import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { IRequest } from 'src/common/interfaces/global.interface';
import { AppLogger } from 'src/providers/logger/logger.service';
import { PaginationDTO } from 'src/Shared/DTO/shared.dto';

import { SecurityQuestionService } from './security-question.service';
import {
  UpdateSecurityQuestion,
  CreateSecurityQuestion,
} from './security-question.dto';

@Controller('admin/security-question')
export class SecurityQuestionController {
  constructor(
    private readonly _securityQuestionService: SecurityQuestionService,
    private readonly _logger: AppLogger,
  ) {}

  @Get()
  public async getAllSecurityQuestions(
    @Req() req: IRequest,
    @Body() payload: PaginationDTO,
  ): Promise<unknown> {
    try {
      return await this._securityQuestionService.getAllSecurityQuestions(
        payload,
      );
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  public async getSecurityQuestion(
    @Req() req: IRequest,
    @Param('id') id: string,
  ): Promise<unknown> {
    try {
      return await this._securityQuestionService.getSecurityQuestion(id);
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  public async createSecurityQuestion(
    @Req() req: IRequest,
    @Body() payload: CreateSecurityQuestion,
  ): Promise<unknown> {
    try {
      return await this._securityQuestionService.createSecurityQuestion(
        payload,
      );
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  public async updateSecurityQuestions(
    @Req() req: IRequest,
    @Param('id') id: string,
    @Body() payload: UpdateSecurityQuestion,
  ): Promise<unknown> {
    try {
      return await this._securityQuestionService.updateSecurityQuestions(
        id,
        payload,
      );
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  public async deleteSecurityQuestions(
    @Req() req: IRequest,
    @Param('id') id: string,
  ): Promise<unknown> {
    try {
      return await this._securityQuestionService.deleteSecurityQuestions(id);
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }
}
