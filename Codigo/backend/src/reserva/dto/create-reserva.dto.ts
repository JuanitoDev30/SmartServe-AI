import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { EstadoReserva } from '../enum/reservaEstado.enum';
import { OrigenReserva } from '../enum/origenReserva.enum';

// Datos mínimos para dar de alta al cliente cuando la reserva se toma
// por teléfono o desde el agente y todavía no existe en la base.
export class ClienteReservaDto {
  @IsString()
  @MinLength(2, { message: 'El nombre es muy corto' })
  nombre!: string;

  @IsString()
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 dígitos' })
  telefono!: string;

  @IsOptional()
  @ValidateIf((o) => o.email !== '')
  @IsEmail({}, { message: 'El email no es válido' })
  email?: string;
}

export class CreateReservaDto {
  // Cliente existente...
  @IsOptional()
  @IsUUID('4', { message: 'clienteId debe ser un UUID válido' })
  clienteId?: string;

  // ...o cliente nuevo. Debe llegar uno de los dos.
  @ValidateIf((o) => !o.clienteId)
  @ValidateNested()
  @Type(() => ClienteReservaDto)
  cliente?: ClienteReservaDto;

  // Si no se envía, el servicio asigna la mesa disponible más ajustada
  @IsOptional()
  @IsUUID('4', { message: 'mesaId debe ser un UUID válido' })
  mesaId?: string;

  @IsDateString({}, { message: 'fechaHora debe ser una fecha ISO válida' })
  fechaHora!: string;

  @IsOptional()
  @IsInt({ message: 'La duración debe ser un número entero de minutos' })
  @Min(30, { message: 'La duración mínima es 30 minutos' })
  @Max(480, { message: 'La duración máxima es 8 horas' })
  duracionMinutos?: number;

  @IsInt({ message: 'El número de personas debe ser un entero' })
  @Min(1, { message: 'Debe haber al menos 1 persona' })
  @Max(50, { message: 'El máximo por reserva es 50 personas' })
  numeroPersonas!: number;

  @IsOptional()
  @IsEnum(EstadoReserva, {
    message: `estado debe ser uno de: ${Object.values(EstadoReserva).join(', ')}`,
  })
  estado?: EstadoReserva;

  @IsOptional()
  @IsEnum(OrigenReserva, {
    message: `origen debe ser uno de: ${Object.values(OrigenReserva).join(', ')}`,
  })
  origen?: OrigenReserva;

  @IsOptional()
  @IsString()
  notas?: string;
}
