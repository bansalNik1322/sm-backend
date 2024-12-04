import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { compareText, device } from 'src/common/utils/helper';
import { IRequest } from 'src/common/interfaces/global.interface';

import { JWTService } from '../Services/jwt.service';
import { PUBLIC_KEY } from '../Decorators/public.decorator';
import { UserRepository } from '../Repositories/user.repo';
import { TokenRepository } from '../Repositories/token.repo';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _reflactor: Reflector,
    private readonly _jwtService: JWTService,
    private readonly _userModel: UserRepository,
    private readonly _tokenModel: TokenRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this._reflactor.get<boolean>(
        PUBLIC_KEY,
        context.getHandler(),
      );

      if (isPublic) return true;

      const request: IRequest = context?.switchToHttp()?.getRequest();
      const token = request.headers['authorization']?.split(' ')[1];
      const { ip_address } = device(request);

      if (!token)
        throw new HttpException('Token not Found', HttpStatus.UNAUTHORIZED);

      const { data, error_message } = await this._jwtService.verifyToken(token);
      if (error_message)
        throw new HttpException(error_message, HttpStatus.UNAUTHORIZED);

      const { userid } = data;

      const user = await this._userModel.getUser({
        _id: userid,
      });

      if (!user)
        throw new HttpException('User Not Found.', HttpStatus.UNAUTHORIZED);

      const userToken = await this._tokenModel.getToken({
        userid: user?.id,
        ip_address,
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

      request.auth = { user };
      return true;
    } catch (error) {
      console.log('🚀 ~ AuthGuard ~ canActivate ~ error:', error);
      throw error;
    }
  }
}
