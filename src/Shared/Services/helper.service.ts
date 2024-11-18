import { Injectable } from '@nestjs/common';
import { Token } from 'src/models/Schemas/token';
import { User } from 'src/models/Schemas/user';
import { Lockout } from 'src/models/Schemas/lockout';
import { LoginAttempt } from 'src/models/Schemas/login-attempts';
import { compareText, encryptText, generateOTP } from 'src/common/utils/helper';
import { EmailTemplate } from 'src/models/Schemas/email-template';
import { EmailService } from 'src/providers/email/email.service';
import { IResponse } from 'src/common/interfaces/global.interface';
import {
  LOGIN_ATTEMPTS,
  OTP_EXPIRATION_TIME,
} from 'src/common/constants/global.constant';
import { IpBlockReasons } from 'src/common/constants/enum';
import { DatabaseService } from 'src/providers/database/database.service';

import { JWTService } from './jwt.service';

@Injectable()
export class HelperService {
  constructor(
    private readonly _mongoService: DatabaseService,
    private readonly _emailService: EmailService,
    private readonly _jwtService: JWTService,
  ) {}

  public verifyIpAndUpdate = async (
    ip_address: string,
    userid: string,
    password_correct: boolean,
  ): Promise<IResponse> => {
    try {
      const user = await this._mongoService.findById<User>('User', {
        id: userid,
      });
      if (!user) {
        return { error_message: 'User not found' };
      }

      const ipLockedOut = await this._mongoService.findOne<Lockout>('Lockout', {
        options: {
          ip_address,
          userid: user.id,
          lockout_end: { $gt: new Date() },
        },
      });

      if (ipLockedOut)
        return {
          error_message: 'Your IP has been blocked due to some reasons.',
        };

      if (!password_correct) {
        const loginAttempts =
          await this._mongoService.countDocuments<LoginAttempt>(
            'LoginAttempt',
            {
              ip_address,
              userid: user.id,
              success: false,
            },
          );

        if (loginAttempts >= LOGIN_ATTEMPTS) {
          await this._mongoService.create<Lockout>('Lockout', {
            ip_address,
            userid: user.id,
            lockout_reason: IpBlockReasons.MultipleFailedLoginAttempts,
          });

          return {
            error_message:
              'Your IP has been blocked. Please try after 60 minutes.',
          };
        }

        await this._mongoService.create<LoginAttempt>('LoginAttempt', {
          ip_address,
          userid: user.id,
          success: false,
        });

        return { error_message: 'Login attempt recorded.' };
      }

      await this._mongoService.deleteMany<LoginAttempt>('LoginAttempt', {
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

      await this._mongoService.create<Token>('Token', {
        access_token_hash,
        refresh_token_hash,
        ip_address,
        userid: user?.id,
      });

      return {
        data: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      console.log('🚀 ~ HelperService ~ error:', error);
      return { error_message: error?.message };
    }
  };

  public sendotp = async (type: string, userid: string): Promise<IResponse> => {
    try {
      const otp = generateOTP();
      console.log('🚀 ~ HelperService ~ sendotp= ~ otp:', otp);
      const otpHash = await encryptText(`${type}_${otp}_${userid}`);
      const user = await this._mongoService.findById<User>('User', {
        id: userid,
      });

      if (!user) return { error_message: 'User not found' };

      let emailTemplate: EmailTemplate;

      if (type === 'registration') {
        emailTemplate = await this._mongoService.findOne<EmailTemplate>(
          'EmailTemplate',
          {
            options: { slug: 'email_verification' },
          },
        );
      } else if (type === 'forgot') {
        emailTemplate = await this._mongoService.findOne<EmailTemplate>(
          'EmailTemplate',
          {
            options: { slug: 'email_forgot_password' },
          },
        );
      } else if (type === 'update_email') {
        emailTemplate = await this._mongoService.findOne<EmailTemplate>(
          'EmailTemplate',
          {
            options: { slug: 'email_update_verification' },
          },
        );
      }

      const message = emailTemplate?.template
        ?.replace('{{USERNAME}}', user.username)
        .replace('{{OTP}}', otp);

      await this._emailService.sendMail(
        user.email,
        message,
        emailTemplate?.subject,
      );

      user.otps.push({
        otp_hash: otpHash,
        otp_expiry_time: new Date(Date.now() + OTP_EXPIRATION_TIME),
        type: 'email',
      });

      await user.save();
    } catch (error) {
      console.log('🚀 ~ HelperService ~ sendotp= ~ error:', error);
      return { error_message: error?.message };
    }
  };

  public async veirfyOTP(
    type: string,
    userid: string,
    otp: string,
    password: string | null,
  ) {
    try {
      const user = await this._mongoService.findById<User>('User', {
        id: userid,
      });
      const otps = user?.otps;
      let isOTPCorrect = false;
      if (otps?.length === 0) return { error_message: 'No OTP founds' };
      if (otps && otps.length > 0) {
        for (const i of otps) {
          const isMatch = await compareText(
            `${type}_${otp}_${userid}`,
            i?.otp_hash,
          );
          if (isMatch && i?.otp_expiry_time > new Date()) {
            isOTPCorrect = true;
            break;
          }
        }
      }

      if (!isOTPCorrect) return { error_message: 'Invalid OTP' };

      user.otps = [];
      if (type === 'forgot') user.password = password;
      if (type === 'registration') user.email_verified_at = new Date();
      await user.save();

      return;
    } catch (error) {
      console.log('🚀 ~ HelperService ~ sendotp= ~ error:', error);
      return { error_message: error?.message };
    }
  }
}
