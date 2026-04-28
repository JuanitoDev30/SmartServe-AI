import {
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCategoriaDto {
  @IsString( { message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre es muy corto' })
  @MaxLength(50, { message: 'El nombre es muy largo' })
  nombre!: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(20, { message: 'La descripción es muy larga' })
  @IsOptional({ message: 'La descripción es opcional' })
  descripcion?: string;

  @IsString({ message: 'La imagen debe ser una cadena de texto' })
  @IsOptional({ message: 'La imagen es opcional' })
  imagen?: string;
}
