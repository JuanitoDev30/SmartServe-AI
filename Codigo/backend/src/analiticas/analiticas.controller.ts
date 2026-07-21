import { Controller, Get, Query } from '@nestjs/common';
import { AnaliticasService } from './analiticas.service';

@Controller('analiticas')
export class AnaliticasController {
  constructor(private readonly analiticasService: AnaliticasService) {}

  // GET /analiticas/resumen?dias=30
  @Get('resumen')
  resumenGeneral(@Query('dias') dias?: string) {
    return this.analiticasService.resumenGeneral(
      dias ? Number(dias) : undefined,
    );
  }

  // GET /analiticas/proyectos-interes?limite=5
  @Get('proyectos-interes')
  proyectosMasInteres(@Query('limite') limite?: string) {
    return this.analiticasService.proyectosMasInteres(
      limite ? Number(limite) : undefined,
    );
  }

  // GET /analiticas/clientes-por-estado
  @Get('clientes-por-estado')
  clientesPorEstado() {
    return this.analiticasService.clientesPorEstado();
  }

  // GET /analiticas/reuniones-por-estado
  @Get('reuniones-por-estado')
  reunionesPorEstado() {
    return this.analiticasService.reunionesPorEstado();
  }

  // GET /analiticas/reuniones-proximas?dias=7
  @Get('reuniones-proximas')
  reunionesProximas(@Query('dias') dias?: string) {
    return this.analiticasService.reunionesProximas(
      dias ? Number(dias) : undefined,
    );
  }

  // GET /analiticas/proyectos-activos
  @Get('proyectos-activos')
  proyectosActivosCount() {
    return this.analiticasService.proyectosActivosCount();
  }
}
