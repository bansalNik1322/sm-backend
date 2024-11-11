import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { UserAccountType } from 'src/common/constants/enum';

export class UpdateEmail {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  otp: string;
}
class SocialLinks {
  @IsOptional()
  twitter: string;

  @IsOptional()
  facebook: string;

  @IsOptional()
  instagram: string;
}

class Address {
  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  country: string;

  @IsOptional()
  postal_code: string;
}

class NotificationSettings {
  @IsNotEmpty()
  @IsBoolean()
  email_notifications: boolean;

  @IsNotEmpty()
  @IsBoolean()
  push_notifications: boolean;
}
class PrivacySettings {
  @IsNotEmpty()
  profile_visibility: 'public' | 'friends' | 'private';

  @IsNotEmpty()
  post_visibility: 'public' | 'friends' | 'private';

  @IsNotEmpty()
  story_visibility: 'public' | 'friends' | 'private';
}

export class UpdateProfile {
  @IsNotEmpty()
  type:
    | 'profile_update'
    | 'privacy_update'
    | 'password_update'
    | 'address_update'
    | 'settings_update'
    | 'email_update';

  @ValidateIf((i) => i.type === 'profile_update')
  @IsNotEmpty()
  multi_factor_authentication: boolean;

  @ValidateIf((i) => i.type === 'profile_update')
  @IsNotEmpty()
  profile_image: string;

  @ValidateIf((i) => i.type === 'profile_update')
  @IsNotEmpty()
  date_of_birth: Date;

  @ValidateIf((i) => i.type === 'profile_update')
  @IsNotEmpty()
  bio: string;

  @ValidateIf((i) => i.type === 'profile_update')
  @IsNotEmpty()
  website: string;

  @ValidateIf((i) => i.type === 'profile_update')
  @IsNotEmpty()
  interests: string[];

  @ValidateIf((i) => i.type === 'profile_update')
  @IsNotEmpty()
  social_links: SocialLinks;

  @ValidateIf((i) => i.type === 'email_update')
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ValidateIf((i) => i.type === 'email_update')
  @IsNotEmpty()
  @IsEmail()
  otp: string;

  @ValidateIf((i) => i.type === 'privacy_update')
  @IsNotEmpty()
  account_type: UserAccountType;

  @ValidateIf((i) => i.type === 'password_update')
  @IsNotEmpty()
  password: string;

  @ValidateIf((i) => i.type === 'address_update')
  @IsNotEmpty()
  @IsArray()
  address: Address[];

  @ValidateIf((i) => i.type === 'settings_update')
  @IsNotEmpty()
  notification_settings: NotificationSettings;

  @ValidateIf((i) => i.type === 'settings_update')
  @IsNotEmpty()
  privacy_settings: PrivacySettings;
}
