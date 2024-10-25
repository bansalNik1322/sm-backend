import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJWTPayload } from 'src/common/interfaces/global.interface';
import { encryptText } from 'src/common/utils/helper';

@Injectable()
export class JWTService {
  constructor(private _jwtService: JwtService) {}

  public async generateAuthToken(
    payload: IJWTPayload,
  ): Promise<{ [key: string]: string }> {
    try {
      const accessToken = this._jwtService.sign(payload, { expiresIn: '60m' });
      const refreshToken = this._jwtService.sign(payload, {
        expiresIn: '365d',
      });
      const refreshTokenHash = await encryptText(refreshToken);
      const accessTokenHash = await encryptText(accessToken);

      return { accessToken, refreshToken, accessTokenHash, refreshTokenHash };
    } catch (error) {
      console.log('🚀 ~ JWTService ~ generateAuthToken ~ error:', error);
      throw error; // Rethrow the error to handle it upstream
    }
  }
}
