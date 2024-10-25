import { Body, Controller, Post, Req } from '@nestjs/common';
import { LoginUser, RegisterUser } from './auth.dto';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}
  @Post()
  async register(@Body() payload: RegisterUser) {
    // await this._authService.register(payload);
    await this._authService.create();
  }

  // @Post()
  // async login(@Body() payload: LoginUser, @Req() request: Request) {
  //   await this._authService.login(payload, request);
  // }
}
