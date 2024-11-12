import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContentManager {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  metaTitle: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  metaKeywords: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;
}

export class UpdateContentManager {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  metaTitle: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  metaKeywords: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;
}
