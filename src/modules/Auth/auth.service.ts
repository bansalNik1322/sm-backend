import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import {
  ILoginUser,
  IRegisterUser,
  IResponse,
} from 'src/common/interfaces/global.interface';
import { compareText, device } from 'src/common/utils/helper';
import { User } from 'src/models/Schemas/user';
import { DatabaseService } from 'src/providers/database/database.service';
import { HelperService } from 'src/Shared/Services/helper.service';

@Injectable()
export class AuthService {
  // constructor() {} // private _helperService: HelperService, // @InjectModel('User', 'users') private _userModel: Model<User>,
  // public async register(payload: IRegisterUser): Promise<IResponse> {
  //   try {
  //     const { name, username, phone, country_code, password, email } = payload;
  //     const user = await this._userModel
  //       .findOne({
  //         $and: [
  //           {
  //             $or: [
  //               { phone: phone, country_code: country_code },
  //               { email: email },
  //             ],
  //           },
  //         ],
  //       })
  //       .exec();

  //     // Check for user existed and verified
  //     if (user) {
  //       if (user?.email_verified_at || user?.phone_verified_at)
  //         throw new HttpException(
  //           'Email or Phone already registered with us.',
  //           HttpStatus.BAD_REQUEST,
  //         );

  //       // Send Otp on user's phone or email and return response
  //       return {
  //         message: `We've sent an code to your  ${payload?.phone ? 'Phone' : 'Email'}.!`,
  //         status: true,
  //         code: HttpStatus.OK,
  //       };
  //     }

  //     // Create new user
  //     const createdUser = new this._userModel({
  //       name,
  //       password,
  //       username,
  //       ...(email && { email }),
  //       ...(phone && country_code && { phone, country_code }),
  //     });
  //     await createdUser.save();

  //     // Send Otp on user's phone or email and return response
  //     return {
  //       message: `We've sent an code to your  ${payload?.phone ? 'Phone' : 'Email'}.!`,
  //       status: true,
  //       code: HttpStatus.OK,
  //     };
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // public async login(
  //   payload: ILoginUser,
  //   request: Request,
  // ): Promise<IResponse> {
  //   try {
  //     const { userid, password, country_code } = payload;

  //     const { ip_address } = device(request);

  //     const user = await this._userModel.findOne({
  //       $and: [
  //         {
  //           $or: [
  //             { email: userid },
  //             { username: userid },
  //             {
  //               $and: [
  //                 { country_code: country_code },
  //                 {
  //                   phone: userid,
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     if (!user)
  //       throw new HttpException(
  //         'Unable to find an account with this Email or username',
  //         HttpStatus.NOT_FOUND,
  //       );

  //     if (!user?.email_verified_at && !user?.phone_verified_at) {
  //       // Send otp for user verification and return
  //       const result = await this._helperService.sendotp(
  //         'registration',
  //         user?.id,
  //       );
  //       if (result) {
  //         throw new HttpException(
  //           result?.message,
  //           HttpStatus.INTERNAL_SERVER_ERROR,
  //         );
  //       }
  //       throw new HttpException(
  //         "We've sent a link to your registered email. Please Follow the instructions and Complete your profile Verification",
  //         HttpStatus.NOT_ACCEPTABLE,
  //       );
  //     }

  //     const passwordCorrectOrNot = await compareText(password, user?.password);

  //     const deviceVerified = await this._helperService.verifyIpAndUpdate(
  //       ip_address as string,
  //       user?.id,
  //       passwordCorrectOrNot,
  //     );

  //     if (!deviceVerified?.status)
  //       throw new HttpException('Invalid Credentials', HttpStatus.NOT_FOUND);

  //     user.last_login = new Date();
  //     await user.save();

  //     return {
  //       status: true,
  //       code: HttpStatus.OK,
  //       message: 'Login Successful',
  //       data: {
  //         authTokens: deviceVerified?.data,
  //       },
  //     };
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }
  constructor(private readonly databaseService: DatabaseService) {}

  async create() {
    return this.databaseService.findAll('User');
  }
}
