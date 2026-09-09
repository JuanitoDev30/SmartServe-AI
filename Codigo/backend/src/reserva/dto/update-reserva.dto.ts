import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
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

class UpdateClienteReservaDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El nombre es muy corto' })
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 dígitos' })
  telefono?: string;

  @IsOptional()
  @ValidateIf((o) => o.email !== '')
  @IsEmail({}, { message: 'El email no es válido' })
  email?: string;
}

// El estado se cambia por su propio endpoint porque dispara reglas de
// negocio (transiciones válidas, liberar mesa, motivo de cancelación).
export class UpdateReservaDto {
  @IsOptional()
  @IsUUID('4', { message: 'mesaId debe ser un UUID válido' })
  mesaId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'fechaHora debe ser una fecha ISO válida' })
  fechaHora?: string;

  @IsOptional()
  @IsInt({ message: 'La duración debe ser un número entero de minutos' })
  @Min(30, { message: 'La duración mínima es 30 minutos' })
  @Max(480, { message: 'La duración máxima es 8 horas' })
  duracionMinutos?: number;

  @IsOptional()
  @IsInt({ message: 'El número de personas debe ser un entero' })
  @Min(1, { message: 'Debe haber al menos 1 persona' })
  @Max(50, { message: 'El máximo por reserva es 50 personas' })
  numeroPersonas?: number;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateClienteReservaDto)
  cliente?: UpdateClienteReservaDto;
}
