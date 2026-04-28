import { Type } from 'class-transformer';
import {
  IsArray,
  IsUUID,
  ArrayNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  IsPositive,
  IsDate,
} from 'class-validator';

export class CreatePedidoDto {
  // Productos
  @IsArray({ message: 'productosIds debe ser un arreglo' })
  @ArrayNotEmpty({ message: 'Debe enviar al menos un producto' })
  @IsUUID('4', { each: true, message: 'Cada producto debe ser un UUID válido' })
  productosIds!: string[];

  // Usuario
  @IsUUID('4', { message: 'usuarioId debe ser un UUID válido' })
  usuarioId!: string;

  // Dirección de entrega
  @IsString()
  @MinLength(5, { message: 'La dirección es muy corta' })
  direccion!: string;

  // Ciudad
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  subTotal!: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  total!: number;

  // Notas
  @IsOptional()
  @IsString()
  notas?: string;

  @IsString()
  @IsOptional()
  //@IsDate()
  fecha?: string;

  @IsString()
  metodoPago!: string;

  @IsString()
  estado!: string;
}
