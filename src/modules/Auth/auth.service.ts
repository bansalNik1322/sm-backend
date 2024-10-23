import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import {
  ILoginUser,
  IRegisterUser,
  IResponse,
} from 'src/common/interfaces/global.interface';
import { comparePassword } from 'src/common/utils/helper';
import { User } from 'src/models/Schemas/user';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User', 'users') private _userModel: Model<User>) {}
  public async register(payload: IRegisterUser): Promise<IResponse> {
    try {
      const { name, username, phone, country_code, password, email } = payload;
      const user = await this._userModel
        .findOne({
          $and: [
            {
              $or: [
                { phone: phone, country_code: country_code },
                { email: email },
              ],
            },
          ],
        })
        .exec();

      // Check for user existed and verified
      if (user) {
        if (user?.email_verified_at || user?.phone_verified_at)
          throw new HttpException(
            'Email or Phone already registered with us.',
            HttpStatus.BAD_REQUEST,
          );

        // Send Otp on user's phone or email and return response
        return {
          message: `We've sent an code to your  ${payload?.phone ? 'Phone' : 'Email'}.!`,
          status: true,
          code: HttpStatus.OK,
        };
      }

      // Create new user
      const createdUser = new this._userModel({
        name,
        password,
        username,
        ...(email && { email }),
        ...(phone && country_code && { phone, country_code }),
      });
      await createdUser.save();

      // Send Otp on user's phone or email and return response
      return {
        message: `We've sent an code to your  ${payload?.phone ? 'Phone' : 'Email'}.!`,
        status: true,
        code: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  public async login(
    payload: ILoginUser,
    request: Request,
  ): Promise<IResponse> {
    try {
      const { userid, password, country_code } = payload;

      const user = await this._userModel.findOne({
        $and: [
          {
            $or: [
              { email: userid },
              { username: userid },
              {
                $and: [
                  { country_code: country_code },
                  {
                    phone: userid,
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!user)
        throw new HttpException(
          'Unable to find an account with this Email or username',
          HttpStatus.NOT_FOUND,
        );

      if (!user?.email_verified_at && !user?.phone_verified_at) {
        // Send otp for user verification and return
        return {
          message: 'Invalid Credentials!',
          status: true,
          code: HttpStatus.OK,
        };
      }

      const passwordCorrectOrNot = await comparePassword(
        password,
        user?.password,
      );

      if (!passwordCorrectOrNot) {
        // Update the unsuccessfull count and return the response
        return {
          message: 'Invalid Credentials!',
          status: false,
          code: HttpStatus.UNAUTHORIZED,
        };
      }

      // Check for Ip address and Validate it
    } catch (error) {}
  }
}
