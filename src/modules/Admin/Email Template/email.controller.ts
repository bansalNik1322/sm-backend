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
import { AppLogger } from 'src/providers/logger/logger.service';
import { IRequest } from 'src/common/interfaces/global.interface';

import { EmailTemplateService } from './email.service';
import {
  CreateEmailTemplateDTO,
  UpdateEmailTemplateDTO,
  GetAllTemplateDTO,
} from './email.dto';

@Controller('admin/email')
export class EmailController {
  constructor(
    private readonly _emailTemplateService: EmailTemplateService,
    private readonly _logger: AppLogger,
  ) {}

  @Post()
  public async createEmailTemplate(
    @Body() payload: CreateEmailTemplateDTO,
    @Req() req: IRequest,
  ) {
    try {
      return await this._emailTemplateService.createEmailTemplate(payload);
    } catch (error) {
      this._logger.error(error?.message, error?.stack, req);
      throw new HttpException(error?.message, error?.status);
    }
  }

  @Get()
  public async getAllEmailTemplates(
    @Body() payload: GetAllTemplateDTO,
    @Req() req: IRequest,
  ) {
    console.log('🚀 ~ EmailController ~ payload:', payload);
    try {
      return await this._emailTemplateService.getAllEmailTemplates(payload);
    } catch (error) {
      this._logger.error(error?.message, error?.stack, req);
      throw new HttpException(error?.message, error?.status);
    }
  }

  @Get(':slug')
  public async getEmailTemplateBySlug(
    @Req() req: IRequest,
    @Param() { slug }: { slug: string },
  ) {
    try {
      return await this._emailTemplateService.getEmailTemplateBySlug(slug);
    } catch (error) {
      this._logger.error(error?.message, error?.stack, req);
      throw new HttpException(error?.message, error?.status);
    }
  }

  @Put(':slug')
  public async updateEmailTemplate(
    @Req() req: IRequest,
    @Body() payload: UpdateEmailTemplateDTO,
    @Param() { slug }: { slug: string },
  ) {
    try {
      return await this._emailTemplateService.updateEmailTemplate(
        slug,
        payload,
      );
    } catch (error) {
      this._logger.error(error?.message, error?.stack, req);
      throw new HttpException(error?.message, error?.status);
    }
  }

  @Delete(':slug')
  public async deleteEmailTemplate(
    @Req() req: IRequest,
    @Param() { slug }: { slug: string },
  ) {
    try {
      return await this._emailTemplateService.deleteEmailTemplate(slug);
    } catch (error) {
      this._logger.error(error?.message, error?.stack, req);
      throw new HttpException(error?.message, error?.status);
    }
  }
}
