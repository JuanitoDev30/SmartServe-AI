import {
    IsNumber,
    IsOptional,
    IsPositive,
    MinLength,
    IsDateString,
    IsArray,
    IsUUID
} from 'class-validator';
import { Producto } from 'src/producto/entities/producto.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
export class CreatePedidoDto {

    @IsNumber() //el precio del producto debe ser un numero
    @IsPositive() //el precio del producto debe ser un numero positivo
    @IsOptional() //el precio del producto es opcional, es decir, que puede ser null o undefined
    total?: number;
    @IsDateString() //la fecha del pedido debe ser una cadena de texto con formato de fecha
    @IsOptional() //la fecha del pedido es opcional, es decir, que puede ser null o undefined
    fecha?: string;

    @IsArray() //el pedido debe tener un array de productos
    @IsUUID(undefined, { each: true }) //cada elemento del array debe ser un UUID
    productosIds: string[];

    @IsUUID() //el pedido debe tener un usuarioId que sea un UUID
    usuarioId: string;


}
