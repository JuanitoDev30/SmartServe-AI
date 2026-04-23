import {
  IsNumber,
  IsOptional,
  IsPositive,
  MinLength,
  IsDateString,
  IsArray,
  IsUUID,
  ArrayNotEmpty,
} from 'class-validator';

export class CreatePedidoDto {
  @IsNumber() //el precio del producto debe ser un numero
  @IsPositive() //el precio del producto debe ser un numero positivo
  @IsOptional() //el precio del producto es opcional, es decir, que puede ser null o undefined
  total?: number;
  @IsDateString() //la fecha del pedido debe ser una cadena de texto con formato de fecha
  @IsOptional() //la fecha del pedido es opcional, es decir, que puede ser null o undefined
  fecha?: string;

  @IsArray({ message: 'productosIds debe ser un arreglo' })
  @ArrayNotEmpty({ message: 'Debe enviar al menos un producto' })
  @IsUUID('4', { each: true, message: 'Cada producto debe ser un UUID válido' })
  productosIds!: string[]; 

  @IsUUID('4', { message: 'usuarioId debe ser un UUID válido' })
  usuarioId!: string; 

}
