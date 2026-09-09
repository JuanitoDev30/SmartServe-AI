import { IsEnum, IsOptional, IsUUID, Matches } from 'class-validator';
import { EstadoReserva } from '../enum/reservaEstado.enum';

export class FiltrosReservaDto {
  @IsOptional()
  @IsEnum(EstadoReserva, {
    message: `estado debe ser uno de: ${Object.values(EstadoReserva).join(', ')}`,
  })
  estado?: EstadoReserva;

  // Día concreto en formato YYYY-MM-DD
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'fecha debe tener el formato YYYY-MM-DD',
  })
  fecha?: string;

  @IsOptional()
  @IsUUID('4')
  mesaId?: string;

  @IsOptional()
  @IsUUID('4')
  clienteId?: string;
}
