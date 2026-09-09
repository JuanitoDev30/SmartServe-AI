import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class DisponibilidadDto {
  @IsDateString({}, { message: 'fechaHora debe ser una fecha ISO válida' })
  fechaHora!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(30)
  @Max(480)
  duracionMinutos?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  numeroPersonas?: number;

  // Al editar una reserva, se ignora a sí misma al calcular ocupación
  @IsOptional()
  @IsUUID('4')
  excluirReservaId?: string;
}
