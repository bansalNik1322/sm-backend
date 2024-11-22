import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { IRequest } from 'src/common/interfaces/global.interface';

import { ChatService } from './chat.service';
import { CreateChatDTO } from './chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private _chatService: ChatService) {}
  @Post('create')
  async createChat(@Body() payload: CreateChatDTO, @Req() req: IRequest) {
    try {
      return await this._chatService.createChat(payload, req);
    } catch (error) {
      console.log('🚀 ~ ChatController ~ createChat ~ error:', error);
      throw new HttpException(
        error?.message || 'Internal Server Error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user-chats')
  async getContacts(@Req() req: IRequest) {
    try {
      return await this._chatService.getUserChats(req);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
