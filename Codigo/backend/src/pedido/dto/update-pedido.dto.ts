import {
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
  IsEmail,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoPedido } from '../enum/pedidoEstado.enum';
import { MetodoPago } from '../enum/metodoPago.enum';

class UpdateClienteDto {
  @IsString()
  @MinLength(2)
  nombre?: string;

  @IsString()
  @MinLength(7)
  telefono?: string;

  @IsOptional()
  @ValidateIf((o) => o.email !== '')
  @IsEmail()
  email?: string;
}

export class UpdatePedidoDto {
  @IsOptional()
  @IsEnum(EstadoPedido, {
    message: `estado debe ser uno de: ${Object.values(EstadoPedido).join(', ')}`,
  })
  estado?: EstadoPedido;

  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'La dirección es muy corta' })
  direccion?: string;

  @IsOptional()
  @IsEnum(MetodoPago, {
    message: `metodoPago debe ser uno de: ${Object.values(MetodoPago).join(', ')}`,
  })
  metodoPago?: MetodoPago;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateClienteDto)
  cliente?: UpdateClienteDto;
}
