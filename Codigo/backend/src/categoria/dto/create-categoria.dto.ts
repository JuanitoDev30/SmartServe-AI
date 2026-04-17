import {
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  nombre!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  slug!: string;

  @IsString()
  @IsOptional()
  imagen?: string;
}
