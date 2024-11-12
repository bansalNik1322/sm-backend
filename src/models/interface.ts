import { Types } from 'mongoose';
import {
  IpBlockReasons,
  UserAccountStatus,
  UserAccountType,
} from 'src/common/constants/enum';

export interface IUser {
  readonly id?: string;
  name?: string;
  username?: string;
  email?: string;
  country_code?: string;
  phone?: string;
  password?: string;
  profile_image?: string;
  old_passwords?: string[];
  account_type?: UserAccountType;

  last_password_updated_at?: Date;
  last_login?: Date;
  created_at?: Date;
  updated_at?: Date;
  slug?: string;

  address?: {
    location: string;
    state: string;
    country: string;
    postal_code?: string;
  }[];

  date_of_birth?: Date;
  bio?: string;
  website?: string;
  social_links?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  interests?: string[];

  notification_settings?: {
    email_notifications: boolean;
    push_notifications: boolean;
  };

  privacy_settings?: {
    profile_visibility: 'public' | 'friends' | 'private';
    post_visibility: 'public' | 'friends' | 'private';
    story_visibility: 'public' | 'friends' | 'private';
  };

  sign_up_method?: 'email' | 'google' | 'facebook' | 'twitter';

  multi_factor_authentication?: boolean;
  status?: UserAccountStatus;
  email_verified_at?: Date;
  phone_verified_at?: Date;

  security_questions?: {
    question: string;
    answer: string;
  }[];

  otps: {
    otp_hash: string;
    otp_expiry_time: Date;
    type: 'email' | 'phone';
  }[];

  deleted_at?: Date;
}

export interface IToken {
  readonly id?: string;
  readonly created_at?: Date;
  readonly updated_at?: Date;
  access_token_hash: string;
  refresh_token_hash: string;
  userid: string;
  deleted_at?: Date;
  ip_address: string;
  device: string;
}

export interface ILockout {
  ip_address: string;
  lockout_time: number;
  lockout_end: Date;
  lockout_reason: IpBlockReasons;
}

export interface ILoginAttempt {
  userid: Types.ObjectId;
  ip_address: string;
  attempts: number;
  success: boolean;
  attempted_at: Date;
  deleted_at: Date;
}

export interface IEmailTemplate {
  title: string;
  slug: string;
  template: string;
  subject: string;
  deleted_at: Date;
}

export interface IContentManager {
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  description: string;
  metaKeywords: string;
  deleted_at: Date;
  active: boolean;
}

export interface ISecurityQuestion {
  question: string;
  status: boolean;
  deleted_at: Date;
  user_assigned: string[];
}

export interface IFaq {
  question: string;
  answer: string;
  category: string;
  status: boolean;
  deleted_at: Date;
}
