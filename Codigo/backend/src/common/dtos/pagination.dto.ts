import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number) // Es transformado a número, ya que los query params llegan como strings
  limit?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  offset?: number;
}
