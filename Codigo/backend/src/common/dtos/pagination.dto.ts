import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { EstadoCliente } from 'src/cliente/enum/usuarioEstado.enum';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  search?: string = '';

  @IsOptional()
  @IsEnum(EstadoCliente)
  estado?: EstadoCliente;

  @IsOptional()
  @IsEnum(['nombre', 'creadoEn', 'totalPedidos'])
  sortBy?: 'nombre' | 'creadoEn' | 'totalPedidos' = 'creadoEn';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
