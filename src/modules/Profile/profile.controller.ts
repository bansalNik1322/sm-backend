import { Controller, Get } from '@nestjs/common';

import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
  constructor(private readonly _profileService: ProfileService) {}
  @Get()
  async getProfile() {}
}
