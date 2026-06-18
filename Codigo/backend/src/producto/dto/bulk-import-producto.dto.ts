import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BulkImportProductoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precio!: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsString()
  proveedor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El IVA debe ser un número' })
  @Min(0)
  ivaPercent?: number;

  @IsOptional()
  @IsString()
  categoriaNombre?: string; // Se busca por nombre en el servicio
}
