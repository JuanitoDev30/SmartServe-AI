//esta es la clase , que basicamente representa la informacion de como estoy esperando que luzca el producto a crear,
// es decir, que campos va a tener, que tipo de datos se espera, etc.

import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @MinLength(3) //el nombre del producto debe tener al menos 3 caracteres
  // @Matches(/^[a-zA-Z0-9\s]+$/)
  @MaxLength(50)
  nombre!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio?: number;

  @IsString()
  @IsOptional()
  descripcion?: string;
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/)
  slug!: string;

  @IsOptional()
  @IsUUID()
  categoriaId?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  stock?: number;
  @IsString()
  @IsOptional()
  @MaxLength(100)
  proveedor?: string;
}
