import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { CambiarEstadoReservaDto } from './dto/cambiar-estado-reserva.dto';
import { DisponibilidadDto } from './dto/disponibilidad.dto';
import { FiltrosReservaDto } from './dto/filtros-reserva.dto';

@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  // Lo consume tanto el dashboard como el agente al cerrar la conversación
  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservaService.create(createReservaDto);
  }

  // GET /reserva?estado=CONFIRMADA&fecha=2026-09-09&mesaId=...
  @Get()
  findAll(@Query() filtros: FiltrosReservaDto) {
    return this.reservaService.findAll(filtros);
  }

  // GET /reserva/agenda?fecha=YYYY-MM-DD
  @Get('agenda')
  findByFecha(@Query('fecha') fecha?: string) {
    return this.reservaService.findByFecha(fecha);
  }

  @Get('proximas')
  findProximas() {
    return this.reservaService.findProximas();
  }

  @Get('stats')
  getStats() {
    return this.reservaService.getStats();
  }

  // GET /reserva/disponibilidad?fechaHora=...&numeroPersonas=4
  @Get('disponibilidad')
  disponibilidad(@Query() dto: DisponibilidadDto) {
    return this.reservaService.disponibilidad(dto);
  }

  @Get('cliente/:id')
  findByCliente(@Param('id', ParseUUIDPipe) clienteId: string) {
    return this.reservaService.findByCliente(clienteId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReservaDto: UpdateReservaDto,
  ) {
    return this.reservaService.update(id, updateReservaDto);
  }

  // Separado del update porque dispara reglas propias (transiciones válidas)
  @Patch(':id/estado')
  cambiarEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CambiarEstadoReservaDto,
  ) {
    return this.reservaService.cambiarEstado(
      id,
      dto.estado,
      dto.motivoCancelacion,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservaService.remove(id);
  }
}
