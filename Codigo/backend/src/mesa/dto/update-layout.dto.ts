import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { FormaMesa } from '../enum/formaMesa.enum';

/** Posición y geometría de una mesa dentro del plano del salón */
export class MesaLayoutDto {
  @IsUUID('4', { message: 'El id de la mesa no es válido' })
  id!: string;

  @IsInt({ message: 'posX debe ser un entero' })
  @Min(0)
  @Max(200)
  posX!: number;

  @IsInt({ message: 'posY debe ser un entero' })
  @Min(0)
  @Max(200)
  posY!: number;

  @IsOptional()
  @IsEnum(FormaMesa, {
    message: `forma debe ser una de: ${Object.values(FormaMesa).join(', ')}`,
  })
  forma?: FormaMesa;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(40)
  ancho?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(40)
  alto?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(359)
  rotacion?: number;
}

/** El editor guarda todas las mesas movidas de un solo golpe */
export class UpdateLayoutDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'No hay mesas que guardar' })
  @ArrayMaxSize(300)
  @ValidateNested({ each: true })
  @Type(() => MesaLayoutDto)
  mesas!: MesaLayoutDto[];
}
