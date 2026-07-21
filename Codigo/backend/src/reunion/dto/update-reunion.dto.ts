import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ModalidadReunion } from '../entities/reunion.entity';

export class UpdateReunionDto {
  @IsOptional()
  @IsUUID()
  proyectoId?: string;

  @IsOptional()
  @IsDateString()
  fechaHora?: string;

  @IsOptional()
  @IsEnum(ModalidadReunion)
  modalidad?: ModalidadReunion;

  @IsOptional()
  @IsString()
  notas?: string;
}
