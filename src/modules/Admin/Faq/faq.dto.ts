import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFaq {
  @IsNotEmpty()
  @IsString()
  answer: string;

  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsString()
  category: string;
}

export class UpdateFaq {
  @IsOptional()
  @IsString()
  answer: string;

  @IsOptional()
  @IsString()
  question: string;

  @IsOptional()
  @IsString()
  category: string;
}
