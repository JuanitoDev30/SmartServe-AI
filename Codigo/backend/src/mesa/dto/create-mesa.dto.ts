import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ZonaMesa } from '../enum/zonaMesa.enum';
import { FormaMesa } from '../enum/formaMesa.enum';

export class CreateMesaDto {
  @IsInt({ message: 'El número de mesa debe ser un entero' })
  @Min(1, { message: 'El número de mesa debe ser mayor a 0' })
  numero!: number;

  @IsInt({ message: 'La capacidad debe ser un entero' })
  @Min(1, { message: 'La capacidad mínima es 1 persona' })
  @Max(50, { message: 'La capacidad máxima es 50 personas' })
  capacidad!: number;

  @IsOptional()
  @IsEnum(ZonaMesa, {
    message: `zona debe ser una de: ${Object.values(ZonaMesa).join(', ')}`,
  })
  zona?: ZonaMesa;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  @IsOptional()
  @IsString()
  descripcion?: string;

  // ─────────── Plano del salón (opcional) ───────────

  @IsOptional()
  @IsEnum(FormaMesa, {
    message: `forma debe ser una de: ${Object.values(FormaMesa).join(', ')}`,
  })
  forma?: FormaMesa;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(200)
  posX?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(200)
  posY?: number;

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
