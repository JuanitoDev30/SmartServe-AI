import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  Min,
  IsBoolean,
} from 'class-validator';
import { TipoProyecto, EstadoProyecto } from '../entities/proyecto.entity';

export class CreateProyectoDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre!: string;

  @IsEnum(TipoProyecto, {
    message: `tipo debe ser: ${Object.values(TipoProyecto).join(', ')}`,
  })
  tipo!: TipoProyecto;

  @IsString()
  ubicacion!: string;

  @IsOptional()
  @IsString()
  barrio?: string;

  @IsNumber()
  @Min(0)
  precioDesde!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  areaM2?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  habitaciones?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  banos?: number;

  @IsOptional()
  @IsEnum(EstadoProyecto)
  estado?: EstadoProyecto;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  imagen?: string;
}
