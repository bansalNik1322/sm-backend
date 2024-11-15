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

import { ContentManagerService } from './cms.service';
import { CreateContentManager, UpdateContentManager } from './cms.dto';

@Controller('admin/content-manager')
export class ContentManagerController {
  constructor(
    private readonly _contentManagerService: ContentManagerService,
    private readonly _logger: AppLogger,
  ) {}
  @Get()
  public async getAllContent(
    @Req() req: IRequest,
    @Body() payload: PaginationDTO,
  ): Promise<unknown> {
    try {
      return await this._contentManagerService.getAllContent(payload);
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':slug')
  public async getContentBySlug(
    @Req() req: IRequest,
    @Param('slug') slug: string,
  ): Promise<unknown> {
    try {
      return await this._contentManagerService.getContentBySlug(slug);
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  public async createContent(
    @Req() req: IRequest,
    @Body() payload: CreateContentManager,
  ): Promise<unknown> {
    try {
      return await this._contentManagerService.createContent(payload);
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':slug')
  public async updateContent(
    @Req() req: IRequest,
    @Param('slug') slug: string,
    @Body() payload: UpdateContentManager,
  ): Promise<unknown> {
    try {
      return await this._contentManagerService.updateContent(slug, payload);
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':slug')
  public async deleteContent(
    @Req() req: IRequest,
    @Param('slug') slug: string,
  ): Promise<unknown> {
    try {
      return await this._contentManagerService.deleteContent(slug);
    } catch (error) {
      this._logger.error(error.message, error.stack, req);
      throw new HttpException(error.message, error.status);
    }
  }
}
