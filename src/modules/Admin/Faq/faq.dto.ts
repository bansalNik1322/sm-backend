import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from 'src/Shared/DTO/shared.dto';

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

export class GetAllFaq extends PaginationDTO {
  @IsOptional()
  @IsString()
  category?: string;
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
