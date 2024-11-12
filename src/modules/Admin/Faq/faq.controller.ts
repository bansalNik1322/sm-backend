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

import { FaqService } from './faq.service';
import { CreateFaq, UpdateFaq } from './faq.dto';

@Controller('admin/faq')
export class FaqController {
  constructor(
    private readonly _faqService: FaqService,
    private readonly _logger: AppLogger,
  ) {}
  @Get()
  public async getAllFaq(
    @Req() req: IRequest,
    @Body() payload: PaginationDTO,
  ): Promise<unknown> {
    try {
      return await this._faqService.getAllFaq(payload);
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  public async getFaq(
    @Req() req: IRequest,
    @Param('id') id: string,
  ): Promise<unknown> {
    try {
      return await this._faqService.getFaq(id);
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  public async createFaq(
    @Req() req: IRequest,
    @Body() payload: CreateFaq,
  ): Promise<unknown> {
    try {
      return await this._faqService.createFaq(payload);
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  public async updateFaq(
    @Req() req: IRequest,
    @Param('id') id: string,
    @Body() payload: UpdateFaq,
  ): Promise<unknown> {
    try {
      return await this._faqService.updateFaq(id, payload);
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  public async deleteFaq(
    @Req() req: IRequest,
    @Param('id') id: string,
  ): Promise<unknown> {
    try {
      return await this._faqService.deleteFaq(id);
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }
}
