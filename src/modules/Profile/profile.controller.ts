import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { IRequest } from 'src/common/interfaces/global.interface';

import { ProfileService } from './profile.service';
import { UpdateEmail, UpdateProfile } from './profile.dto';

@Controller('account')
export class ProfileController {
  constructor(private readonly _profileService: ProfileService) {}

  @Get('get-profile')
  async getProfile(@Req() request: IRequest) {
    return await this._profileService.getProfile(request);
  }

  @Post('update-profile')
  async updateProfile(
    @Body() payload: UpdateProfile,
    @Req() request: IRequest,
  ) {
    return await this._profileService.updateProfile(payload, request);
  }
}
