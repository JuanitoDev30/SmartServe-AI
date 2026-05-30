import { Injectable } from '@nestjs/common';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Repository } from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import * as ExcelJS from 'exceljs';
@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  }

  private getHeadersExcel(worksheet: ExcelJS.Worksheet, headers: string[]) {
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1a1a2e' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFcccccc' } },
      };
    });
    headerRow.height = 30;
  }

  private;
}
