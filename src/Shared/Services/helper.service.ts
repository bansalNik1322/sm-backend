import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from 'src/models/Schemas/token';
import { User } from 'src/models/Schemas/user';
import { Lockout } from 'src/models/Schemas/lockout';
import { LoginAttempt } from 'src/models/Schemas/login-attempts';
import { encryptText, generateOTP } from 'src/common/utils/helper';
import { EmailTemplate } from 'src/models/Schemas/email-template';
import { EmailService } from 'src/providers/email/email.service';
import { IResponse } from 'src/common/interfaces/global.interface';
import {
  LOGIN_ATTEMPTS,
  OTP_EXPIRATION_TIME,
} from 'src/common/constants/global.constant';
import { IpBlockReasons } from 'src/common/constants/enum';
import { JWTService } from './jwt.service';

@Injectable()
export class HelperService {
  constructor(
    @InjectModel('User', 'users') private _userModel: Model<User>,
    @InjectModel('Token', 'tokens') private _tokenModel: Model<Token>,
    @InjectModel('Lockout', 'lockouts') private _lockoutModel: Model<Lockout>,
    @InjectModel('EmailTemplate', 'emailTemplates')
    private _emailTemplateModel: Model<EmailTemplate>,
    @InjectModel('LoginAttempt', 'login_attempts')
    private _loginAttemptsModel: Model<LoginAttempt>,
    private _emailService: EmailService,
    private _jwtService: JWTService,
  ) {}

  public verifyIpAndUpdate = async (
    ip_address: string,
    userid: string,
    password_correct: boolean,
  ): Promise<IResponse> => {
    const user = await this._userModel.findById(userid).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const ipLockedOut = await this._lockoutModel
      .findOne({
        ip_address,
        userid: user.id,
        lockout_end: { $lt: new Date() },
      })
      .exec();

    if (ipLockedOut) {
      throw new HttpException(
        'Your IP has been blocked due to some reasons.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!password_correct) {
      const loginAttempts = await this._loginAttemptsModel.countDocuments({
        ip_address,
        userid: user.id,
        success: false,
      });

      if (loginAttempts >= LOGIN_ATTEMPTS) {
        await this._lockoutModel.create({
          ip_address,
          userid: user.id,
          lockout_reason: IpBlockReasons.MultipleFailedLoginAttempts,
        });

        throw new HttpException(
          'Your IP has been blocked. Please try after 60 minutes.',
          HttpStatus.FORBIDDEN,
        );
      }

      await this._loginAttemptsModel.create({
        ip_address,
        userid: user.id,
        success: false,
      });
      return { message: 'Login attempt recorded.', status: false };
    }

    await this._loginAttemptsModel.deleteMany({
      ip_address,
      userid: user.id,
    });

    const {
      accessToken,
      refreshToken,
      accessTokenHash: access_token_hash,
      refreshTokenHash: refresh_token_hash,
    } = await this._jwtService.generateAuthToken({
      userid: user?.id,
    });

    await this._tokenModel.create({
      access_token_hash,
      refresh_token_hash,
      ip_address,
      userid: user?.id,
    });

    return {
      message: 'Login successful.',
      status: true,
      data: {
        accessToken,
        refreshToken,
      },
    };
  };

  public sendotp = async (type: string, userid: string): Promise<IResponse> => {
    const otp = generateOTP();
    const otpHash = await encryptText(`${type}_${otp}_${userid}`);
    const user = await this._userModel.findById(userid).exec();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    let emailTemplate: EmailTemplate;
    if (type === 'registration') {
      emailTemplate = await this._emailTemplateModel
        .findOne({ title: 'email_verification' })
        .exec();
    } else if (type === 'forgot') {
      emailTemplate = await this._emailTemplateModel
        .findOne({ title: 'email_forgot_password' })
        .exec();
    }

    const message = emailTemplate?.template
      ?.replace('{{USERNAME}}', user.username)
      .replace('{{OTP}}', otp);

    await this._emailService.sendMail(
      user.email,
      message,
      emailTemplate.subject,
    );

    user.otps.push({
      otp_hash: otpHash,
      otp_expiry_time: new Date(Date.now() + OTP_EXPIRATION_TIME), // Define OTP_EXPIRATION_TIME constant
      type: 'email',
    });

    await user.save();
    return;
  };
}
