import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  IRequest,
  IResponse,
  IUpdateProfile,
} from 'src/common/interfaces/global.interface';
import { DatabaseService } from 'src/providers/database/database.service';
import { UserRepository } from 'src/Shared/Repositories/user.repo';
import { HelperService } from 'src/Shared/Services/helper.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly _helperService: HelperService,
    private readonly _mongoService: DatabaseService,
    private readonly _userModel: UserRepository,
  ) {}

  async updateEmail(
    payload: any,
    request: { [key: string]: any },
  ): Promise<IResponse> {
    try {
      const { email, otp } = payload;

      if (otp) {
        const result = await this._helperService.veirfyOTP(
          'update_email',
          request?.auth?.user?.id,
          otp,
          null,
        );
        if (result?.error_message)
          throw new HttpException(
            result?.error_message,
            HttpStatus.BAD_REQUEST,
          );

        await this._userModel.updateUserById(request?.auth?.user?.id, {
          email: email,
        });

        return {
          data: result,
          status: true,
          code: HttpStatus.OK,
          message: 'OTP Verified Successfully',
        };
      }
      const result = await this._helperService.sendotp(
        'update_email',
        request?.auth?.user?.id,
      );
      if (result?.error_message)
        throw new HttpException(result.error_message, HttpStatus.BAD_REQUEST);

      return {
        status: true,
        code: HttpStatus.OK,
        data: {
          email,
        },
        message: 'Email verification OTP sent successfully',
      };
    } catch (error) {
      console.log('🚀 ~ ProfileService ~ updateProfile ~ error:', error);
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getProfile(req: IRequest) {
    try {
      const user = await this._userModel.getUser({
        _id: req?.auth?.user?.id,
      });

      return {
        data: user,
        status: true,
        code: HttpStatus.OK,
        message: 'User profile fetched successfully',
      };
    } catch (error) {
      console.log('🚀 ~ ProfileService ~ getProfile ~ error:', error);
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateProfile(payload: IUpdateProfile, req: IRequest) {
    try {
      const { type } = payload;
      const user = await this._userModel.getUser({
        _id: req?.auth?.user?.id,
      });
      switch (type) {
        case 'profile_update':
          const {
            social_links,
            bio,
            website,
            date_of_birth,
            profile_image,
            multi_factor_authentication,
            interests,
          } = payload;

          user.social_links = social_links ?? user?.social_links;
          user.interests = interests ?? user?.interests;
          user.interests = interests ?? user?.interests;
          user.multi_factor_authentication =
            multi_factor_authentication ?? user?.multi_factor_authentication;
          user.website = website ?? user?.website;
          user.bio = bio ?? user?.bio;
          user.date_of_birth = date_of_birth ?? user?.date_of_birth;
          user.profile_image = profile_image ?? user?.profile_image;

        case 'privacy_update':
          const { account_type } = payload;
          user.account_type = account_type ?? user?.account_type;
        case 'password_update':
          break;
        case 'address_update':
          const { address } = payload;
          user.address = address ?? user?.address;
          break;
        case 'settings_update':
          const { notification_settings, privacy_settings } = payload;
          user.privacy_settings = privacy_settings ?? user?.privacy_settings;
          user.notification_settings =
            notification_settings ?? user?.notification_settings;
          break;
        case 'email_update':
          break;

        default:
          return {
            status: false,
            message:
              'Type can contain only values : email_update, privacy_update, password_update, address_update, settings_update, email_update ',
            code: HttpStatus.UNPROCESSABLE_ENTITY,
          };
      }

      await user.save();
      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Profile Updated Successfully',
      };
    } catch (error) {
      console.log('🚀 ~ ProfileService ~ updateProfile ~ error:', error);
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
