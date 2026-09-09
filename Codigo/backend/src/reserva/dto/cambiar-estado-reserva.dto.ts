import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoReserva } from '../enum/reservaEstado.enum';

export class CambiarEstadoReservaDto {
  @IsEnum(EstadoReserva, {
    message: `estado debe ser uno de: ${Object.values(EstadoReserva).join(', ')}`,
  })
  estado!: EstadoReserva;

  @IsOptional()
  @IsString()
  motivoCancelacion?: string;
}
