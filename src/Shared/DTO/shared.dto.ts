import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDTO {
  @IsOptional()
  @Transform(({ value }) => (value ? value : 1))
  page: string;

  @IsOptional()
  @Transform(({ value }) => (value ? value : 10))
  limit: string;
}
