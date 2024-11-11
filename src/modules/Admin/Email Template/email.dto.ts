import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from 'src/Shared/DTO/shared.dto';

export class CreateEmailTemplateDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  template: string;

  @IsNotEmpty()
  @IsString()
  slug: string;
}

export class GetAllTemplateDTO extends PaginationDTO {}

export class UpdateEmailTemplateDTO {
  @IsOptional()
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  template: string;

  @IsOptional()
  @IsString()
  slug: string;
}
