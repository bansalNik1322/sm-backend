import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDTO {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? value : 1))
  page: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? value : 10))
  limit: number;
}
