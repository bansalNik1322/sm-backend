import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IRequest, IResponse } from 'src/common/interfaces/global.interface';
import { ChatRepository } from 'src/Shared/Repositories/chat.repo';
import { HelperService } from 'src/Shared/Services/helper.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly _helperService: HelperService,
    private readonly _chatModel: ChatRepository,
  ) {}
  async createChat(payload: any, req: IRequest): Promise<IResponse> {
    try {
      if (payload?.participants?.length < 2)
        throw new HttpException(
          'Participants cannot be lesser than 2',
          HttpStatus.BAD_REQUEST,
        );

      const { error_message } =
        await this._helperService.checkValidParticipants(
          payload.participants,
          req?.auth?.user?.id,
        );

      if (error_message)
        throw new HttpException(
          'Please Select Valid Participants',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      console.log(
        '🚀 ~ ChatService ~ createChat ~ req?.auth?.user?.id:',
        req?.auth?.user?.id,
      );

      await this._chatModel.createChat({
        chat_type: payload.chat_type,
        participants: payload.participants,
        ...(payload.group_name ? { group_name: payload.group_name } : {}),
        creator: req?.auth?.user?.id,
      });

      return {
        status: true,
        message: 'Chat Created Successfully',
      };
    } catch (error) {
      console.log('🚀 ~ ChatService ~ createChat ~ error:', error);
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserChats(req: IRequest) {
    /**
     * @Description Get User Contacts with whom he can chat
     */
    try {
      const userid = req?.auth?.user?.id;
      const userChats = await this._chatModel.getAllChats({
        $or: [
          {
            creator: userid,
          },
          {
            participants: { $in: [userid] },
          },
        ],
      });

      userChats.map((chat: any) => {
        let chatTitle = '';
        if (chat?.chat_type === 'single') {
          chatTitle =
            chat?.participants[0]?._id !== userid
              ? chat.participants[0]?.name
              : chat.participants[1]?.name;
        } else {
          chatTitle = chat?.group_name || '';
        }
        chat.title = chatTitle;
        chat.unread = 0;
        chat.new = chat?.messages?.length ? false : true;

        delete chat.messages;
        delete chat.participants;
      });
      return {
        status: true,
        data: {
          result: userChats.map((i: any) => {
            return {
              ...i,
            };
          }),
        },
      };
    } catch (error) {
      throw new HttpException(
        error?.message || 'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
