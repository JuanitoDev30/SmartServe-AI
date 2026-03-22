//esta clase , que basicamente representa la informacion de como estoy esperando que luzca el usuario a crear,
// es decir, que campos va a tener, que tipo de datos se espera, etc.
import {
  IsOptional,
  IsString,
  MinLength,
  IsEmail,
  IsIn,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsString()
  @MinLength(2)
  apellido!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsIn(['activo', 'inactivo'])
  estado!: string;

  @IsString()
  @IsIn(['administrador', 'cliente'])
  rol!: string;

  @IsString()
  @MinLength(6)
  cedula!: string;

  @IsString()
  @IsOptional()
  telefono?: string;
}
