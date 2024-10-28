import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { LoginUser, RegisterUser, SendOTP } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}
  @Post()
  async register(@Body() payload: RegisterUser) {
    await this._authService.register(payload);
  }

  @Post()
  async login(@Body() payload: LoginUser, @Req() request: Request) {
    await this._authService.login(payload, request);
  }

  @Post()
  async sendOTP(@Body() payload: SendOTP) {
    await this._authService.sendOTP(payload);
  }
}
