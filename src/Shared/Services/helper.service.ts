import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from 'src/models/Schemas/token';
import { User } from 'src/models/Schemas/user';
import { Lockout } from 'src/models/Schemas/lockout';
import { LoginAttempt } from 'src/models/Schemas/login-attempts';

@Injectable()
export class HelperService {
  constructor(
    @InjectModel('User', 'users') private _userModel: Model<User>,
    @InjectModel('Token', 'tokens') private _tokenModel: Model<Token>,
    @InjectModel('Lockout', 'lockouts') private _lockoutModel: Model<Lockout>,
    @InjectModel('LoginAttempt', 'login_attempts')
    private _loginAttemptsModel: Model<LoginAttempt>,
  ) {}

  public verifyIpAndUpdate = async (
    ip_address: string,
    userid: string,
    password_correct: boolean,
  ) => {
    try {
    } catch (error) {
      throw error;
    }
  };
}
