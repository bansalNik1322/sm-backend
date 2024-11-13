import { Request } from 'express';

import { UserAccountType } from '../constants/enum';

export interface IPagination {
  page: number;
  limit: number;
}
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
  type: 'registration' | 'forgot';
  userid: string;
  otp: string;
  password?: string;
}

export interface IUpdateProfile {
  type:
    | 'profile_update'
    | 'privacy_update'
    | 'password_update'
    | 'address_update'
    | 'settings_update'
    | 'email_update';
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
  interests?: string[];
  email?: string;
  otp?: string;
  account_type?: UserAccountType;
  password?: string;
  address?: {
    location: string;
    state: string;
    country: string;
    postal_code?: string;
  }[];
  notification_settings?: {
    email_notifications: boolean;
    push_notifications: boolean;
  };
  privacy_settings?: {
    profile_visibility: 'public' | 'friends' | 'private';
    post_visibility: 'public' | 'friends' | 'private';
    story_visibility: 'public' | 'friends' | 'private';
  };
}

export interface IKeyPair {
  [key: string]: string;
}

export interface IRequest extends Request {
  auth: { [key: string]: any };
}

export interface ICreateEmailTemplate {
  title: string;
  slug: string;
  template: string;
  subject: string;
}
export interface IUpdateEmailTemplate {
  title?: string;
  template?: string;
  subject?: string;
}

export interface IGetAllEmailTemplates extends IPagination {}
export interface IGetAllContentManager extends IPagination {}

export interface IUpdateContentManager {
  title?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  description?: string;
  metaKeywords?: string;
  active: boolean;
}
export interface ICreateContentManager {
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  description: string;
  metaKeywords: string;
  active: boolean;
}

export interface IGetAllData extends IPagination {}

export interface ICreateFaq {
  category: string;
  question: string;
  answer: string;
}

export class IUpdateFaq {
  category?: string;
  question?: string;
  answer?: string;
}

export class ICreateSecurityQuestion {
  question: string;
}

export class IUpdateSecurityQuestion {
  question?: string;
  status?: boolean;
}
