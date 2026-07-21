import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import {
  EstadoProspecto,
  PresupuestoRango,
} from '../entities/prospecto.entity';

export class CreateProspectoDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsString()
  telefono!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(EstadoProspecto)
  estado?: EstadoProspecto;

  @IsOptional()
  @IsEnum(PresupuestoRango)
  presupuesto?: PresupuestoRango;

  @IsOptional()
  @IsUUID()
  proyectoInteresId?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
