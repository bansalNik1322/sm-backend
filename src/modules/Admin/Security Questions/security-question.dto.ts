import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSecurityQuestion {
  @IsNotEmpty()
  @IsString()
  question: string;
}

export class UpdateSecurityQuestion {
  @IsOptional()
  @IsString()
  question: string;
}
