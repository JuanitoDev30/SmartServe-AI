import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { MesaService } from './mesa.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';

@Controller('mesa')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Post()
  create(@Body() createMesaDto: CreateMesaDto) {
    return this.mesaService.create(createMesaDto);
  }

  // GET /mesa?soloActivas=true
  @Get()
  findAll(
    @Query('soloActivas', new ParseBoolPipe({ optional: true }))
    soloActivas?: boolean,
  ) {
    return this.mesaService.findAll(soloActivas);
  }

  @Get('stats')
  getStats() {
    return this.mesaService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mesaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMesaDto: UpdateMesaDto,
  ) {
    return this.mesaService.update(id, updateMesaDto);
  }

  // PATCH /mesa/:id/desactivar — conserva el historial de reservas
  @Patch(':id/desactivar')
  desactivar(@Param('id', ParseUUIDPipe) id: string) {
    return this.mesaService.cambiarDisponibilidad(id, false);
  }

  @Patch(':id/activar')
  activar(@Param('id', ParseUUIDPipe) id: string) {
    return this.mesaService.cambiarDisponibilidad(id, true);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mesaService.remove(id);
  }
}
