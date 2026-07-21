import { PartialType } from '@nestjs/mapped-types';
import { CreateAnaliticaDto } from './create-analitica.dto';

export class UpdateAnaliticaDto extends PartialType(CreateAnaliticaDto) {}
