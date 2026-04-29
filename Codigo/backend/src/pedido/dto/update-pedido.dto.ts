// update-pedido.dto.ts
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { EstadoPedido } from '../enum/pedidoEstado.enum';

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
  @IsString()
  notas?: string;
}
