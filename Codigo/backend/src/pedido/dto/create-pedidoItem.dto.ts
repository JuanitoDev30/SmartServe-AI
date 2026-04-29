import { IsUUID, IsInt, IsPositive, Min } from 'class-validator';

export class CreatePedidoItemDto {
  @IsUUID('4', { message: 'productoId debe ser un UUID válido' })
  productoId!: string;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  @IsPositive({ message: 'La cantidad debe ser un número positivo' })
  cantidad!: number;
}
