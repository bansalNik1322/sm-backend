import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { IChat } from 'src/models/interface';
import { Chat } from 'src/models/Schemas/chat';

@Injectable()
export class ChatRepository {
  constructor(@InjectModel('Chat') private _chatModel: Model<Chat>) {}

  public async createChat(chat: Partial<IChat>) {
    return await this._chatModel.create(chat);
  }

  public async getAllChats(
    whereCondition: RootFilterQuery<Chat>,
  ): Promise<any> {
    const chats = await this._chatModel
      .find(whereCondition)
      .select({ updatedAt: 0, __v: 0 })
      .populate([
        {
          path: 'messages',
          options: { limit: 1 },
          select: '_id sender message_text seen_by',
        },
        {
          path: 'participants',
          select: '_id name username',
        },
      ])
      .lean()
      .exec();

    return chats;
  }

  public async getChat(whereCondition: RootFilterQuery<Chat>) {
    return await this._chatModel.findOne(whereCondition).exec();
  }
}
