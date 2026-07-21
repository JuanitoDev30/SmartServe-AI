import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EstadoReunion, ModalidadReunion } from '../entities/reunion.entity';

export class CreateReunionDto {
  @IsUUID()
  prospectoId!: string;

  @IsOptional()
  @IsUUID()
  proyectoId?: string;

  @IsDateString()
  fechaHora!: string;

  @IsOptional()
  @IsEnum(ModalidadReunion)
  modalidad?: ModalidadReunion;

  @IsOptional()
  @IsEnum(EstadoReunion)
  estado?: EstadoReunion;

  @IsOptional()
  @IsString()
  notas?: string;
}
