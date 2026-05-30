import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('ventas')
  async getReporteVentas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('formato') formato: 'json' | 'excel' | 'pdf' = 'json',
    @Res() res: Response,
  ) {
    return this.reportesService.getReporteVentas(
      fechaInicio,
      fechaFin,
      formato,
      res,
    );
  }

  @Get('productos')
  async getReporteProductos(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('formato') formato: 'json' | 'excel' | 'pdf' = 'json',
    @Res() res: Response,
  ) {
    return this.reportesService.getReporteProductos(
      fechaInicio,
      fechaFin,
      formato,
      res,
    );
  }

  @Get('clientes')
  async getReporteClientes(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('formato') formato: 'json' | 'excel' | 'pdf' = 'json',
    @Res() res: Response,
  ) {
    return this.reportesService.getReporteClientes(
      fechaInicio,
      fechaFin,
      formato,
      res,
    );
  }

  @Get('contable')
  async getReporteContable(
    @Query('mes') mes: string,
    @Query('anio') anio: string,
    @Query('formato') formato: 'json' | 'excel' | 'pdf' = 'json',
    @Res() res: Response,
  ) {
    return this.reportesService.getReporteContable(
      parseInt(mes),
      parseInt(anio),
      formato,
      res,
    );
  }
}
