import { UserAccountType } from '../constants/enum';

export interface IRegisterUser {
  phone?: string;
  country_code?: string;

  email?: string;
  password: string;
  name: string;
  username: string;
}

export interface ILoginUser {
  userid: string;
  password: string;
  country_code?: string;
}

export interface IResponse {
  status?: boolean;
  error_message?: string;
  code?: number;
  message?: string;
  data?: any;
}

export interface IJWTPayload {
  userid: string;
}

export interface ISendOTP {
  type: 'registration' | 'forgot';
  userid: string;
}

export interface IVerifyOTP {
  userid: 'registration' | 'forgot';
  type: string;
  otp: string;
  password?: string;
}

export interface IUpdateProfile {
  email?: string;
  phone?: string;
  country_code?: string;
  multi_factor_authentication?: boolean;
  profile_image?: string;
  date_of_birth?: Date;
  bio?: string;
  website?: string;
  social_links?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  interests: string[];
}

export interface IKeyPair {
  [key: string]: string;
}
