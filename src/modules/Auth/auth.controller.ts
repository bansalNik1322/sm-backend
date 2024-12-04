import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AppLogger } from 'src/providers/logger/logger.service';
import { IRequest } from 'src/common/interfaces/global.interface';
import { Public } from 'src/Shared/Decorators/public.decorator';

import { LoginUser, RegisterUser, SendOTP, VerifyOTP } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _logger: AppLogger,
  ) {}

  @Post('register')
  @Public()
  async register(
    @Body() payload: RegisterUser,
    @Req() req: IRequest,
  ): Promise<unknown> {
    try {
      return await this._authService.register(payload);
    } catch (error) {
      console.log('🚀 ~ AuthController ~ error:', error?.message);
      this._logger.error(error?.message, error?.stack, req);
      throw new HttpException(
        error?.message || 'Unexpected error occurred',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @Public()
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
  @Public()
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
  @Public()
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

  @Post('session')
  async checkValidSession(@Req() req: IRequest) {
    try {
      return {
        status: true,
      };
    } catch (error) {
      this._logger.error(error?.message, error?.stack, req);
      throw new HttpException(error?.message, error?.status);
    }
  }
}
