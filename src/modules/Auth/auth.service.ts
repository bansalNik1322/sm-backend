import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import {
  ILoginUser,
  IRegisterUser,
  IResponse,
  ISendOTP,
  IVerifyOTP,
} from 'src/common/interfaces/global.interface';
import { compareText, device } from 'src/common/utils/helper';
import { TokenRepository } from 'src/Shared/Repositories/token.repo';
import { UserRepository } from 'src/Shared/Repositories/user.repo';
import { HelperService } from 'src/Shared/Services/helper.service';
import { JWTService } from 'src/Shared/Services/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _helperService: HelperService,
    private readonly _userModel: UserRepository,
    private readonly _tokenModel: TokenRepository,
    private readonly _jwtService: JWTService,
  ) {}

  public async register(payload: IRegisterUser): Promise<IResponse> {
    try {
      const { name, username, phone, country_code, password, email } = payload;
      const user = await this._userModel.getUser({
        ...(phone && country_code && { phone, country_code }),
        ...(email && { email }),
      });

      // Check for user existed and verified
      if (user) {
        if (user?.email_verified_at || user?.phone_verified_at)
          throw new HttpException(
            'Email or Phone already registered with us.',
            HttpStatus.BAD_REQUEST,
          );

        // Send Otp on user's phone or email and return response
        const result = await this._helperService.sendotp(
          'registration',
          user?.id,
        );
        if (result?.error_message)
          throw new HttpException(result.error_message, HttpStatus.BAD_REQUEST);

        return {
          message: `We've sent an code to your ${payload?.phone ? 'Phone' : 'Email'}.!`,
          status: true,
          code: HttpStatus.OK,
        };
      }

      const createdUser = await this._userModel.createUser({
        name,
        password,
        username,
        ...(email && { email }),
        ...(phone && country_code ? { phone, country_code } : {}),
      });
      console.log('🚀 ~ AuthService ~ register ~ createdUser:', createdUser);

      const result = await this._helperService.sendotp(
        'registration',
        createdUser?.id,
      );
      if (result?.error_message)
        throw new HttpException(result?.error_message, HttpStatus.BAD_REQUEST);

      return {
        message: `We've sent an code to your  ${payload?.phone ? 'Phone' : 'Email'}.!`,
        status: true,
        code: HttpStatus.OK,
      };
    } catch (error) {
      console.log('🚀 ~ AuthService ~ register ~ error:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async login(
    payload: ILoginUser,
    request: Request,
  ): Promise<IResponse> {
    try {
      const { userid, password, country_code } = payload;

      const { ip_address } = device(request);
      console.log('🚀 ~ AuthService ~ ip_address:', ip_address);

      const user = await this._userModel.getUser({
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
        const result = await this._helperService.sendotp(
          'registration',
          user?.id,
        );
        if (result?.error_message) {
          throw new HttpException(
            result?.error_message,
            HttpStatus.BAD_REQUEST,
          );
        }
        throw new HttpException(
          "We've sent a link to your registered email. Please Follow the instructions and Complete your profile Verification",
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      const passwordCorrectOrNot = await compareText(password, user?.password);

      const result = await this._helperService.verifyIpAndUpdate(
        ip_address as string,
        user?.id,
        passwordCorrectOrNot,
      );

      if (result?.error_message)
        throw new HttpException(result?.error_message, HttpStatus.NOT_FOUND);

      user.last_login = new Date();
      await user.save();

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Login Successful',
        data: {
          authTokens: result?.data,
        },
      };
    } catch (error) {
      console.log('🚀 ~ AuthService ~ error:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async sendOTP(payload: ISendOTP): Promise<IResponse> {
    try {
      const { userid, type } = payload;

      const user = await this._userModel.getUser({
        $or: [{ email: userid }, { phone: userid }, { username: userid }],
      });

      if (!user)
        throw new HttpException(
          'Unable to find an account with this Email or username. ',
          HttpStatus.NOT_FOUND,
        );

      const result = await this._helperService.sendotp(type, user?.id);
      if (result?.error_message)
        throw new HttpException(result?.error_message, HttpStatus.BAD_REQUEST);

      return {
        message: `We've sent an code to your registered Email`,
        status: true,
        code: HttpStatus.OK,
      };
    } catch (error) {
      console.log('🚀 ~ AuthService ~ register ~ error:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async verifyOTP(payload: IVerifyOTP): Promise<IResponse> {
    try {
      const { userid, otp, type, password = null } = payload;
      const user = await this._userModel.getUser({
        $or: [{ email: userid }, { phone: userid }, { username: userid }],
      });

      if (!user)
        throw new HttpException(
          'Unable to find an account with this Email or username. ',
          HttpStatus.NOT_FOUND,
        );

      const result = await this._helperService.veirfyOTP(
        type,
        user?.id,
        otp,
        password,
      );
      if (result?.error_message)
        throw new HttpException(result?.error_message, HttpStatus.BAD_REQUEST);

      return {
        data: result,
        status: true,
        code: HttpStatus.OK,
        message: 'OTP Verified Successfully',
      };
    } catch (error) {
      console.log('🚀 ~ AuthService ~ register ~ error:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
