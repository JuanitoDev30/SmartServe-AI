import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateAdministradorDto {
  @IsString()
  nombre!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
