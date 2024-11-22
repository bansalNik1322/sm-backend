import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChatMessage } from 'src/models/Schemas/chat_message';
import { DatabaseService } from 'src/providers/database/database.service';
import { HelperService } from 'src/Shared/Services/helper.service';

@Injectable()
export class SocketService {
  constructor(
    private readonly _helperService: HelperService,
    private readonly _mongoService: DatabaseService,
  ) {}
  public async sendMessage({
    chatid,
    message,
    userid,
  }: {
    chatid: string;
    message: string;
    userid: string;
  }) {
    /**
     @description Function to enter a new message into the database and return response
     */
    try {
      const { data } = await this._helperService.isSenderValid(chatid, userid);

      if (data?.isSender === false)
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

      await this._mongoService.create<ChatMessage>('ChatMessage', {
        sender: userid,
        chatid,
        message_text: message,
        seen_by: [userid],
      });

      return {
        message: 'Message sent successfully',
        success: true,
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
