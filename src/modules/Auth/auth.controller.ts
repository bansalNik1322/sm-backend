import { Body, Controller, HttpException, Post, Req } from '@nestjs/common';
import { AppLogger } from 'src/providers/logger/logger.service';
import { IRequest } from 'src/common/interfaces/global.interface';

import { LoginUser, RegisterUser, SendOTP, VerifyOTP } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _logger: AppLogger,
  ) {}

  @Post('register')
  async register(
    @Body() payload: RegisterUser,
    @Req() req: IRequest,
  ): Promise<unknown> {
    try {
      return await this._authService.register(payload);
    } catch (error) {
      this._logger.error(error?.message, error?.stack, req);
      throw new HttpException(error?.message, error?.status);
    }
  }

  @Post('login')
  async login(
    @Body() payload: LoginUser,
    @Req() req: IRequest,
  ): Promise<unknown> {
    try {
      return await this._authService.login(payload, req);
    } catch (error) {
      this._logger.error(error?.message, error?.stack, req);
      throw new HttpException(error?.message, error?.status);
    }
  }

  @Post()
  async sendOTP(
    @Body() payload: SendOTP,
    @Req() req: IRequest,
  ): Promise<unknown> {
    try {
      return await this._authService.sendOTP(payload);
    } catch (error) {
      this._logger.error(error?.message, error?.stack, req);
      throw new HttpException(error?.message, error?.status);
    }
  }

  @Post('verify-otp')
  async verifyOTP(
    @Body() payload: VerifyOTP,
    @Req() req: IRequest,
  ): Promise<unknown> {
    try {
      return await this._authService.verifyOTP(payload);
    } catch (error) {
      this._logger.error(error?.message, error?.stack, req);
      throw new HttpException(error?.message, error?.status);
    }
  }
}
