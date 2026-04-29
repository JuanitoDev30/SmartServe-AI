//esta clase , que basicamente representa la informacion de como estoy esperando que luzca el usuario a crear,
// es decir, que campos va a tener, que tipo de datos se espera, etc.

import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateClienteDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  nombre!: string;

  // El agente puede no tener el apellido en la primera interacción
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  apellido?: string;

  // Identificador principal para el agente — único en la tabla
  @IsString()
  @Matches(/^[0-9]{7,15}$/, {
    message: 'Teléfono inválido, solo dígitos (7-15)',
  })
  @Transform(({ value }) => value?.replace(/\s+/g, ''))
  telefono!: string;

  // Opcional: el cliente puede darlo o no durante el chat
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  // Útil para pre-rellenar en futuros pedidos
  @IsOptional()
  @IsString()
  @MinLength(5)
  direccionPrincipal?: string;
}
