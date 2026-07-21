import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReunionService } from './reunion.service';
import { CreateReunionDto } from './dto/create-reunion.dto';
import { UpdateReunionDto } from './dto/update-reunion.dto';

import { EstadoReunion } from './entities/reunion.entity';
import { CambiarEstadoReunionDto } from './dto/cambiar-estado-reunion.dto';

@Controller('reunion')
export class ReunionController {
  constructor(private readonly reunionService: ReunionService) {}

  // Este es el endpoint que consumirá el agente al cerrar la conversación
  @Post()
  agendar(@Body() createReunionDto: CreateReunionDto) {
    return this.reunionService.agendar(createReunionDto);
  }

  @Get()
  findAll(@Query('estado') estado?: EstadoReunion) {
    return this.reunionService.findAll(estado);
  }

  @Get('proximas')
  findProximas() {
    return this.reunionService.findProximas();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reunionService.findOne(id);
  }

  // Edición general: fecha, modalidad, notas, proyecto
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReunionDto: UpdateReunionDto) {
    return this.reunionService.update(id, updateReunionDto);
  }

  // Cambio de estado separado porque dispara efectos (ej: REALIZADA -> convierte al prospecto)
  @Patch(':id/estado')
  cambiarEstado(@Param('id') id: string, @Body() dto: CambiarEstadoReunionDto) {
    return this.reunionService.cambiarEstado(id, dto.estado);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reunionService.remove(id);
  }
}
