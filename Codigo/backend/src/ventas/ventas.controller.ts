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
import { VentasService } from './ventas.service';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Get('resumen')
  getResumen() {
    return this.ventasService.getResumen();
  }

  @Get('grafica')
  getGrafica(@Query('periodo') periodo: 'dia' | 'semana' | 'mes' = 'semana') {
    return this.ventasService.getGrafica(periodo);
  }

  @Get('top-productos')
  getTopProductos(
    @Query('limit') limit = 5,
    @Query('periodo') periodo: 'semana' | 'mes' | 'anio' | 'todo' = 'mes',
  ) {
    return this.ventasService.getTopProductos(Number(limit), periodo);
  }

  @Get('metodos-pago')
  getMetodosPago() {
    return this.ventasService.getMetodosPago();
  }

  @Get('historial')
  getHistorial(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.ventasService.getHistorial(
      Number(page),
      Number(pageSize),
      fechaInicio,
      fechaFin,
    );
  }
}
