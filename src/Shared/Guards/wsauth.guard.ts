import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { compareText } from 'src/common/utils/helper';
import { ISocket } from 'src/common/interfaces/global.interface';

import { JWTService } from '../Services/jwt.service';
import { UserRepository } from '../Repositories/user.repo';
import { TokenRepository } from '../Repositories/token.repo';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JWTService,
    private readonly _userModel: UserRepository,
    private readonly _tokenModel: TokenRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient<ISocket>();
      const token = client.handshake.headers['authorization']?.split(' ')[1];

      if (!token)
        throw new HttpException('Token not Found', HttpStatus.UNAUTHORIZED);

      const { data, error_message } = await this._jwtService.verifyToken(token);
      if (error_message)
        throw new HttpException(error_message, HttpStatus.UNAUTHORIZED);

      const { userid } = data;

      const user = await this._userModel.getUser({
        id: userid,
      });

      if (!user)
        throw new HttpException('User  Not Found.', HttpStatus.UNAUTHORIZED);

      const userToken = await this._tokenModel.getToken({
        userid: user?.id,
        deleted: false,
      });

      if (!userToken)
        throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);

      const tokenCorrectOrNot = await compareText(
        token,
        userToken?.access_token_hash,
      );

      if (!tokenCorrectOrNot)
        throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);

      client.auth = { user };
      return true;
    } catch (error) {
      console.log('🚀 ~ WsAuthGuard ~ canActivate ~ error:', error);
      throw error;
    }
  }
}
