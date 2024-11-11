import {
  IsEmail,
  isEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class RegisterUser {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  name: string;
  @IsOptional()
  country_code: string;
  @ValidateIf((o) => isEmpty(o.email))
  @IsNotEmpty({
    message: 'Either phone and country_code or email must be provided.',
  })
  phone: string;

  @ValidateIf((o) => isEmpty(o.phone) || isEmpty(o.country_code))
  @IsEmail()
  @IsNotEmpty({
    message: 'Either phone  or email must be provided.',
  })
  email: string;
  @IsNotEmpty()
  password: string;
}
export class LoginUser {
  @IsNotEmpty()
  userid: string;
  @IsNotEmpty()
  password: string;
  @IsOptional()
  country_code: string;
}

export class SendOTP {
  @IsNotEmpty()
  userid: string;

  @IsNotEmpty()
  type: 'registration' | 'forgot';
}

export class VerifyOTP {
  @IsNotEmpty()
  userid: string;

  @IsNotEmpty()
  type: 'registration' | 'forgot';

  @IsNotEmpty()
  otp: string;

  @IsOptional()
  @IsString()
  password: string;
}
