import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJWTPayload, IResponse } from 'src/common/interfaces/global.interface';
import { encryptText } from 'src/common/utils/helper';

@Injectable()
export class JWTService {
  constructor(private _jwtService: JwtService) {}

  public async generateAuthToken(
    payload: IJWTPayload,
  ): Promise<{ [key: string]: string }> {
    try {
      const accessToken = this._jwtService.sign(payload, {
        expiresIn: '60m',
        secret: 'JWT_SECRET_KEY',
      });
      const refreshToken = this._jwtService.sign(payload, {
        expiresIn: '365d',
        secret: 'JWT_SECRET_KEY',
      });
      const refreshTokenHash = await encryptText(refreshToken);
      const accessTokenHash = await encryptText(accessToken);

      return { accessToken, refreshToken, accessTokenHash, refreshTokenHash };
    } catch (error) {
      console.log('🚀 ~ JWTService ~ generateAuthToken ~ error:', error);
      throw error;
    }
  }

  public async verifyToken(token: string): Promise<IResponse> {
    try {
      const { userid } = await this._jwtService.verify(token, {
        secret: 'JWT_SECRET_KEY',
      });
      if (!userid) return { error_message: 'Token Verification Failed' };
      return { data: { userid } };
    } catch (error) {
      return { error_message: error?.message };
    }
  }
}
