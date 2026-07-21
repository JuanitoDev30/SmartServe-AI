import { IsEnum } from 'class-validator';
import { EstadoReunion } from '../entities/reunion.entity';

export class CambiarEstadoReunionDto {
  @IsEnum(EstadoReunion)
  estado!: EstadoReunion;
}
