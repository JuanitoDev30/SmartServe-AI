//esta es la clase , que basicamente representa la informacion de como estoy esperando que luzca el producto a crear,
// es decir, que campos va a tener, que tipo de datos se espera, etc.

import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @MinLength(3) //el nombre del producto debe tener al menos 3 caracteres
 // @Matches(/^[a-zA-Z0-9\s]+$/)
  nombre!: string; 

  @IsNumber() //el precio del producto debe ser un numero
  @IsPositive() //el precio del producto debe ser un numero positivo
  @IsOptional() //el precio del producto es opcional, es decir, que puede ser null o undefined
  precio?: number;

  @IsString()
  @IsOptional()
  descripcion?: string;
  @IsString()
  @IsOptional()
  slug?: string;
  
  @IsOptional()
  categoria?: string;
  
  @IsOptional()
  status?: string;


  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;
  @IsString()
  @IsOptional()
  proveedor?: string;
}
