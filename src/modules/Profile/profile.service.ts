import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IKeyPair,
  IUpdateProfile,
} from 'src/common/interfaces/global.interface';
import { DatabaseService } from 'src/providers/database/database.service';
import { HelperService } from 'src/Shared/Services/helper.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly _helperService: HelperService,
    private readonly _mongoService: DatabaseService,
  ) {}

  async updateProfile(payload: IUpdateProfile) {
    try {
    } catch (error) {
      console.log('🚀 ~ ProfileService ~ updateProfile ~ error:', error);
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateEmail(payload: IKeyPair) {
    try {
    } catch (error) {
      console.log('🚀 ~ ProfileService ~ updateProfile ~ error:', error);
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
