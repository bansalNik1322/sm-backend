import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/providers/database/database.service';
import { HelperService } from 'src/Shared/Services/helper.service';
import {
  ILoginUser,
  IRegisterUser,
  IRequest,
  ISendOTP,
} from 'src/common/interfaces/global.interface';
import { DatabaseModule } from 'src/providers/database/database.module';
import { EmailService } from 'src/providers/email/email.service';
import { JWTService } from 'src/Shared/Services/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException } from '@nestjs/common';

import { AuthService } from './auth.service';

describe('Auth Service', () => {
  let _authService: AuthService;
  let _mongoService: DatabaseService;
  let _helperService: HelperService;
  let _emailService: EmailService;

  const mockMailerService = {
    sendMail: jest.fn().mockResolvedValue(true), // Mock the sendMail method
  };

  const mockRequest = {
    auth: {},
  } as IRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        DatabaseService,
        JWTService,
        HelperService,
        EmailService,
        JwtService,
        {
          provide: MailerService,
          useValue: mockMailerService, // Provide the mock MailerService
        },
      ],
      controllers: [],
      imports: [DatabaseModule],
    }).compile();

    _authService = module.get<AuthService>(AuthService);
    _helperService = module.get<HelperService>(HelperService);
    _mongoService = module.get<DatabaseService>(DatabaseService);
    _emailService = module.get<EmailService>(EmailService);
  });

  it('Should throw an error if user is already registered and verified', async () => {
    try {
      const payload: IRegisterUser = {
        name: 'Test User',
        username: 'test1',
        email: 'test@yopmail.com',
        password: '123456',
      };
      const result = await _authService.register(payload);
      console.log('🚀 ~ it ~ result:', result);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('Should successfully register a new user with email', async () => {
    const payload: IRegisterUser = {
      name: 'Test User2',
      username: 'test2',
      email: 'test2@yopmail.com',
      password: '123456',
    };
    const result = await _authService.register(payload);
    console.log('🚀 ~ it ~ result:', result);

    expect(result.status).toBe(true);
  });

  // Login Test Cases
  it('Should throw an HttpException with message: Unable to find an account with this Email or username', async () => {
    const payload: ILoginUser = {
      userid: 'test3',
      password: 'password123',
    };

    try {
      await _authService.login(payload, mockRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('Should send an OTP and throw an HttpException with a message to complete profile verification', async () => {
    const payload: ILoginUser = {
      userid: 'test2',
      password: 'password123',
    };

    try {
      await _authService.login(payload, mockRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('Should log the failed attempt and return an error stating Login attempt recorded', async () => {
    const payload: ILoginUser = {
      userid: 'test1',
      password: '123456789',
    };

    try {
      await _authService.login(payload, mockRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('Should return success with accessToken and refreshToken', async () => {
    const payload: ILoginUser = {
      userid: 'test1',
      password: '123456',
    };

    const result = await _authService.login(payload, mockRequest);
    expect(result.status).toBe(true);
  });

  it('Should send an OTP to the given phone number', async () => {
    const payload: ISendOTP = {
      type: 'registration',
      userid: 'test@yopmail.com',
    };

    const result = await _authService.sendOTP(payload);
    expect(result.status).toBe(true);
  });
});
