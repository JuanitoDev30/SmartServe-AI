// create-pedido.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsUUID,
  ArrayNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { MetodoPago } from '../enum/metodoPago.enum';
import { CreatePedidoItemDto } from './create-pedidoItem.dto';

export class CreatePedidoDto {
  // Productos con cantidad
  @IsArray({ message: 'items debe ser un arreglo' })
  @ArrayNotEmpty({ message: 'Debe enviar al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoItemDto)
  items!: CreatePedidoItemDto[];

  // Usuario
  @IsUUID('4', { message: 'usuarioId debe ser un UUID válido' })
  usuarioId!: string;

  // Dirección
  @IsString()
  @MinLength(5, { message: 'La dirección es muy corta' })
  direccion!: string;

  // Notas opcionales
  @IsOptional()
  @IsString()
  notas?: string;

  // Método de pago validado por enum
  @IsEnum(MetodoPago, {
    message: `metodoPago debe ser uno de: ${Object.values(MetodoPago).join(', ')}`,
  })
  metodoPago!: MetodoPago;
}
