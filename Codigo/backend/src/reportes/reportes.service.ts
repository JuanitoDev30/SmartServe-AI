import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { Pedido } from '../pedido/entities/pedido.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Producto } from '../producto/entities/producto.entity';
import { EstadoPedido } from '../pedido/enum/pedidoEstado.enum';
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

  private styleWorkbook(workbook: ExcelJS.Workbook, titulo: string) {
    workbook.creator = 'Sistema de Gestión';
    workbook.lastModifiedBy = 'Sistema de Gestión';
    workbook.created = new Date();
    workbook.title = titulo;
  }

  // ─── REPORTE DE VENTAS ───────────────────────────────────────────────────

  async getReporteVentas(
    fechaInicio: string,
    fechaFin: string,
    formato: 'json' | 'excel' | 'pdf',
    res: Response,
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    const ventas = await this.pedidoRepository
      .createQueryBuilder('pedido')
      .innerJoinAndSelect('pedido.cliente', 'cliente')
      .innerJoinAndSelect('pedido.items', 'item')
      .innerJoinAndSelect('item.producto', 'producto')
      .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
      .andWhere('pedido.actualizadoEn BETWEEN :inicio AND :fin', {
        inicio,
        fin,
      })
      .orderBy('pedido.actualizadoEn', 'DESC')
      .getMany();

    // Calcular totales
    const totalBruto = ventas.reduce((sum, v) => sum + Number(v.total), 0);
    const totalIva = ventas.reduce((sum, v) => {
      const ivaVenta = v.items.reduce((ivaSum, item) => {
        const ivaPercent = (item.producto as any).ivaPercent ?? 19;
        const baseGravable = Number(item.subtotalItem) / (1 + ivaPercent / 100);
        return ivaSum + (Number(item.subtotalItem) - baseGravable);
      }, 0);
      return sum + ivaVenta;
    }, 0);
    const totalNeto = totalBruto - totalIva;

    const resumen = {
      periodo: { inicio: fechaInicio, fin: fechaFin },
      totalVentas: ventas.length,
      totalBruto,
      totalIva,
      totalNeto,
      ventas: ventas.map((v) => ({
        id: v.id,
        fecha: v.actualizadoEn,
        cliente: v.cliente.nombre,
        telefono: v.cliente.telefono,
        productos: v.items.map((i) => ({
          nombre: i.producto.nombre,
          cantidad: i.cantidad,
          precioUnitario: Number(i.precioUnitario),
          subtotal: Number(i.subtotalItem),
          ivaPercent: (i.producto as any).ivaPercent ?? 19,
        })),
        metodoPago: v.metodoPago,
        subtotal: Number(v.subTotal),
        total: Number(v.total),
        iva: v.items.reduce((sum, item) => {
          const ivaPercent = (item.producto as any).ivaPercent ?? 19;
          const base = Number(item.subtotalItem) / (1 + ivaPercent / 100);
          return sum + (Number(item.subtotalItem) - base);
        }, 0),
      })),
    };

    if (formato === 'json') {
      return res.json(resumen);
    }

    if (formato === 'excel') {
      return this.exportVentasExcel(resumen, res);
    }
  }

  private async exportVentasExcel(resumen: any, res: Response) {
    const workbook = new ExcelJS.Workbook();
    this.styleWorkbook(workbook, 'Reporte de Ventas');

    // ── Hoja 1: Resumen ──
    const wsResumen = workbook.addWorksheet('Resumen');
    wsResumen.columns = [{ width: 30 }, { width: 25 }];

    wsResumen.addRow(['REPORTE DE VENTAS']).font = { bold: true, size: 16 };
    wsResumen.addRow([
      `Período: ${resumen.periodo.inicio} al ${resumen.periodo.fin}`,
    ]);
    wsResumen.addRow([]);
    wsResumen.addRow(['RESUMEN GENERAL']);
    wsResumen.addRow(['Total ventas', resumen.totalVentas]);
    wsResumen.addRow(['Total bruto', this.formatCurrency(resumen.totalBruto)]);
    wsResumen.addRow(['Total IVA', this.formatCurrency(resumen.totalIva)]);
    wsResumen.addRow([
      'Total neto (sin IVA)',
      this.formatCurrency(resumen.totalNeto),
    ]);

    // ── Hoja 2: Detalle de ventas ──
    const wsDetalle = workbook.addWorksheet('Detalle de Ventas');
    wsDetalle.columns = [
      { key: 'id', width: 15 },
      { key: 'fecha', width: 20 },
      { key: 'cliente', width: 25 },
      { key: 'telefono', width: 15 },
      { key: 'productos', width: 35 },
      { key: 'metodoPago', width: 15 },
      { key: 'subtotal', width: 18 },
      { key: 'iva', width: 18 },
      { key: 'total', width: 18 },
    ];

    this.getHeadersExcel(wsDetalle, [
      'ID',
      'Fecha',
      'Cliente',
      'Teléfono',
      'Productos',
      'Método Pago',
      'Subtotal',
      'IVA',
      'Total',
    ]);

    resumen.ventas.forEach((v: any) => {
      const row = wsDetalle.addRow({
        id: v.id.slice(0, 8),
        fecha: new Date(v.fecha).toLocaleDateString('es-CO'),
        cliente: v.cliente,
        telefono: v.telefono,
        productos: v.productos
          .map((p: any) => `${p.nombre} x${p.cantidad}`)
          .join(', '),
        metodoPago: v.metodoPago,
        subtotal: this.formatCurrency(v.subtotal),
        iva: this.formatCurrency(v.iva),
        total: this.formatCurrency(v.total),
      });
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', wrapText: true };
        cell.border = {
          bottom: { style: 'hair', color: { argb: 'FFeeeeee' } },
        };
      });
      row.height = 25;
    });

    // Fila de totales
    const totalRow = wsDetalle.addRow({
      id: '',
      fecha: '',
      cliente: 'TOTALES',
      telefono: '',
      productos: '',
      metodoPago: '',
      subtotal: this.formatCurrency(resumen.totalNeto),
      iva: this.formatCurrency(resumen.totalIva),
      total: this.formatCurrency(resumen.totalBruto),
    });
    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF0F0F0' },
      };
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-ventas-${resumen.periodo.inicio}-${resumen.periodo.fin}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  // ─── REPORTE DE PRODUCTOS ─────────────────────────────────────────────────

  async getReporteProductos(
    fechaInicio: string,
    fechaFin: string,
    formato: 'json' | 'excel' | 'pdf',
    res: Response,
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    const topProductos = await this.pedidoRepository
      .createQueryBuilder('pedido')
      .innerJoin('pedido.items', 'item')
      .innerJoin('item.producto', 'producto')
      .innerJoin('producto.categoria', 'categoria')
      .select('producto.id', 'id')
      .addSelect('producto.nombre', 'nombre')
      .addSelect('categoria.nombre', 'categoria')
      .addSelect('producto.ivaPercent', 'ivaPercent')
      .addSelect('SUM(item.cantidad)', 'cantidadVendida')
      .addSelect('SUM(item.subtotalItem)', 'ingresos')
      .addSelect('COUNT(DISTINCT pedido.id)', 'pedidos')
      .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
      .andWhere('pedido.actualizadoEn BETWEEN :inicio AND :fin', {
        inicio,
        fin,
      })
      .groupBy('producto.id')
      .addGroupBy('producto.nombre')
      .addGroupBy('categoria.nombre')
      .addGroupBy('producto.ivaPercent')
      .orderBy('ingresos', 'DESC')
      .getRawMany();

    const stockActual = await this.productoRepository.find({
      select: ['id', 'nombre', 'stock', 'precio'],
    });

    const resumen = {
      periodo: { inicio: fechaInicio, fin: fechaFin },
      productos: topProductos.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        categoria: p.categoria,
        ivaPercent: p.ivaPercent ?? 19,
        cantidadVendida: parseInt(p.cantidadVendida) || 0,
        ingresos: parseFloat(p.ingresos) || 0,
        pedidos: parseInt(p.pedidos) || 0,
        stockActual: stockActual.find((s) => s.id === p.id)?.stock ?? 0,
      })),
    };

    if (formato === 'json') return res.json(resumen);
    if (formato === 'excel') return this.exportProductosExcel(resumen, res);
  }

  private async exportProductosExcel(resumen: any, res: Response) {
    const workbook = new ExcelJS.Workbook();
    this.styleWorkbook(workbook, 'Reporte de Productos');

    const ws = workbook.addWorksheet('Productos');
    ws.columns = [
      { key: 'nombre', width: 30 },
      { key: 'categoria', width: 20 },
      { key: 'ivaPercent', width: 12 },
      { key: 'cantidadVendida', width: 18 },
      { key: 'ingresos', width: 20 },
      { key: 'pedidos', width: 15 },
      { key: 'stockActual', width: 15 },
    ];

    this.getHeadersExcel(ws, [
      'Producto',
      'Categoría',
      'IVA %',
      'Cantidad Vendida',
      'Ingresos',
      'Pedidos',
      'Stock Actual',
    ]);

    resumen.productos.forEach((p: any) => {
      ws.addRow({
        nombre: p.nombre,
        categoria: p.categoria,
        ivaPercent: `${p.ivaPercent}%`,
        cantidadVendida: p.cantidadVendida,
        ingresos: this.formatCurrency(p.ingresos),
        pedidos: p.pedidos,
        stockActual: p.stockActual,
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-productos-${resumen.periodo.inicio}-${resumen.periodo.fin}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  // ─── REPORTE DE CLIENTES ──────────────────────────────────────────────────

  async getReporteClientes(
    fechaInicio: string,
    fechaFin: string,
    formato: 'json' | 'excel' | 'pdf',
    res: Response,
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    const clientes = await this.pedidoRepository
      .createQueryBuilder('pedido')
      .innerJoin('pedido.cliente', 'cliente')
      .select('cliente.id', 'id')
      .addSelect('cliente.nombre', 'nombre')
      .addSelect('cliente.telefono', 'telefono')
      .addSelect('cliente.email', 'email')
      .addSelect('COUNT(pedido.id)', 'totalPedidos')
      .addSelect('SUM(pedido.total)', 'totalGastado')
      .addSelect('AVG(pedido.total)', 'ticketPromedio')
      .addSelect('MAX(pedido.actualizadoEn)', 'ultimaCompra')
      .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
      .andWhere('pedido.actualizadoEn BETWEEN :inicio AND :fin', {
        inicio,
        fin,
      })
      .groupBy('cliente.id')
      .addGroupBy('cliente.nombre')
      .addGroupBy('cliente.telefono')
      .addGroupBy('cliente.email')
      .orderBy('totalGastado', 'DESC')
      .getRawMany();

    const resumen = {
      periodo: { inicio: fechaInicio, fin: fechaFin },
      totalClientes: clientes.length,
      clientes: clientes.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        telefono: c.telefono,
        email: c.email,
        totalPedidos: parseInt(c.totalPedidos) || 0,
        totalGastado: parseFloat(c.totalGastado) || 0,
        ticketPromedio: parseFloat(c.ticketPromedio) || 0,
        ultimaCompra: c.ultimaCompra,
      })),
    };

    if (formato === 'json') return res.json(resumen);
    if (formato === 'excel') return this.exportClientesExcel(resumen, res);
  }

  private async exportClientesExcel(resumen: any, res: Response) {
    const workbook = new ExcelJS.Workbook();
    this.styleWorkbook(workbook, 'Reporte de Clientes');

    const ws = workbook.addWorksheet('Clientes');
    ws.columns = [
      { key: 'nombre', width: 28 },
      { key: 'telefono', width: 16 },
      { key: 'email', width: 28 },
      { key: 'totalPedidos', width: 16 },
      { key: 'totalGastado', width: 20 },
      { key: 'ticketPromedio', width: 20 },
      { key: 'ultimaCompra', width: 20 },
    ];

    this.getHeadersExcel(ws, [
      'Cliente',
      'Teléfono',
      'Email',
      'Total Pedidos',
      'Total Gastado',
      'Ticket Promedio',
      'Última Compra',
    ]);

    resumen.clientes.forEach((c: any) => {
      ws.addRow({
        nombre: c.nombre,
        telefono: c.telefono,
        email: c.email ?? 'N/A',
        totalPedidos: c.totalPedidos,
        totalGastado: this.formatCurrency(c.totalGastado),
        ticketPromedio: this.formatCurrency(c.ticketPromedio),
        ultimaCompra: new Date(c.ultimaCompra).toLocaleDateString('es-CO'),
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-clientes-${resumen.periodo.inicio}-${resumen.periodo.fin}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  // ─── REPORTE CONTABLE ─────────────────────────────────────────────────────

  async getReporteContable(
    mes: number,
    anio: number,
    formato: 'json' | 'excel' | 'pdf',
    res: Response,
  ) {
    const inicio = new Date(anio, mes - 1, 1);
    const fin = new Date(anio, mes, 0, 23, 59, 59, 999);

    const ventas = await this.pedidoRepository
      .createQueryBuilder('pedido')
      .innerJoinAndSelect('pedido.cliente', 'cliente')
      .innerJoinAndSelect('pedido.items', 'item')
      .innerJoinAndSelect('item.producto', 'producto')
      .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
      .andWhere('pedido.actualizadoEn BETWEEN :inicio AND :fin', {
        inicio,
        fin,
      })
      .orderBy('pedido.actualizadoEn', 'ASC')
      .getMany();

    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    // Calcular IVA por tarifa
    let baseGravable0 = 0;
    let baseGravable5 = 0;
    let baseGravable19 = 0;
    let iva5 = 0;
    let iva19 = 0;

    const ventasDetalle = ventas.map((v) => {
      let ivaTotal = 0;
      let baseTotal = 0;

      v.items.forEach((item) => {
        const ivaPercent = (item.producto as any).ivaPercent ?? 19;
        const subtotal = Number(item.subtotalItem);
        const base = subtotal / (1 + ivaPercent / 100);
        const iva = subtotal - base;

        ivaTotal += iva;
        baseTotal += base;

        if (ivaPercent === 0) baseGravable0 += subtotal;
        else if (ivaPercent === 5) {
          baseGravable5 += base;
          iva5 += iva;
        } else {
          baseGravable19 += base;
          iva19 += iva;
        }
      });

      return {
        consecutivo: v.id.slice(0, 8).toUpperCase(),
        fecha: new Date(v.actualizadoEn).toLocaleDateString('es-CO'),
        cliente: v.cliente.nombre,
        nit: v.cliente.telefono,
        descripcion: v.items
          .map((i) => `${i.producto.nombre} x${i.cantidad}`)
          .join(', '),
        metodoPago: v.metodoPago,
        baseGravable: baseTotal,
        iva: ivaTotal,
        total: Number(v.total),
      };
    });

    const totalBruto = ventasDetalle.reduce((s, v) => s + v.total, 0);
    const totalIva = iva5 + iva19;
    const totalBase = totalBruto - totalIva;

    const resumen = {
      periodo: { mes: meses[mes - 1], anio },
      empresa: 'Mi Negocio', // personalizable
      resumenIva: {
        baseExenta: baseGravable0,
        baseGravable5,
        iva5,
        baseGravable19,
        iva19,
        totalBase,
        totalIva,
        totalBruto,
      },
      ventas: ventasDetalle,
    };

    if (formato === 'json') return res.json(resumen);
    if (formato === 'excel') return this.exportContableExcel(resumen, res);
  }

  private async exportContableExcel(resumen: any, res: Response) {
    const workbook = new ExcelJS.Workbook();
    this.styleWorkbook(workbook, 'Reporte Contable');

    // ── Hoja 1: Libro de ventas ──
    const wsLibro = workbook.addWorksheet('Libro de Ventas');
    wsLibro.columns = [
      { key: 'consecutivo', width: 14 },
      { key: 'fecha', width: 14 },
      { key: 'cliente', width: 28 },
      { key: 'nit', width: 16 },
      { key: 'descripcion', width: 40 },
      { key: 'metodoPago', width: 15 },
      { key: 'baseGravable', width: 20 },
      { key: 'iva', width: 18 },
      { key: 'total', width: 18 },
    ];

    // Título
    wsLibro.mergeCells('A1:I1');
    const titleCell = wsLibro.getCell('A1');
    titleCell.value = `LIBRO DE VENTAS — ${resumen.periodo.mes} ${resumen.periodo.anio}`;
    titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1a1a2e' },
    };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    wsLibro.getRow(1).height = 35;

    wsLibro.addRow([]);

    this.getHeadersExcel(wsLibro, [
      'Consecutivo',
      'Fecha',
      'Cliente',
      'NIT/Tel',
      'Descripción',
      'Método Pago',
      'Base Gravable',
      'IVA',
      'Total',
    ]);

    resumen.ventas.forEach((v: any) => {
      const row = wsLibro.addRow({
        consecutivo: v.consecutivo,
        fecha: v.fecha,
        cliente: v.cliente,
        nit: v.nit,
        descripcion: v.descripcion,
        metodoPago: v.metodoPago,
        baseGravable: this.formatCurrency(v.baseGravable),
        iva: this.formatCurrency(v.iva),
        total: this.formatCurrency(v.total),
      });
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', wrapText: true };
        cell.border = {
          bottom: { style: 'hair', color: { argb: 'FFeeeeee' } },
        };
      });
      row.height = 25;
    });

    // Fila totales
    const totalRow = wsLibro.addRow({
      consecutivo: '',
      fecha: '',
      cliente: 'TOTALES',
      nit: '',
      descripcion: '',
      metodoPago: '',
      baseGravable: this.formatCurrency(resumen.resumenIva.totalBase),
      iva: this.formatCurrency(resumen.resumenIva.totalIva),
      total: this.formatCurrency(resumen.resumenIva.totalBruto),
    });
    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF0F0F0' },
      };
    });

    // ── Hoja 2: Resumen IVA ──
    const wsIva = workbook.addWorksheet('Resumen IVA');
    wsIva.columns = [{ width: 35 }, { width: 25 }];

    wsIva.mergeCells('A1:B1');
    const ivaTitle = wsIva.getCell('A1');
    ivaTitle.value = `RESUMEN DECLARACIÓN IVA — ${resumen.periodo.mes} ${resumen.periodo.anio}`;
    ivaTitle.font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
    ivaTitle.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1a1a2e' },
    };
    ivaTitle.alignment = { horizontal: 'center' };
    wsIva.getRow(1).height = 30;

    wsIva.addRow([]);
    wsIva.addRow([
      'VENTAS EXENTAS (0%)',
      this.formatCurrency(resumen.resumenIva.baseExenta),
    ]);
    wsIva.addRow([]);
    wsIva.addRow([
      'BASE GRAVABLE 5%',
      this.formatCurrency(resumen.resumenIva.baseGravable5),
    ]);
    wsIva.addRow([
      'IVA GENERADO 5%',
      this.formatCurrency(resumen.resumenIva.iva5),
    ]);
    wsIva.addRow([]);
    wsIva.addRow([
      'BASE GRAVABLE 19%',
      this.formatCurrency(resumen.resumenIva.baseGravable19),
    ]);
    wsIva.addRow([
      'IVA GENERADO 19%',
      this.formatCurrency(resumen.resumenIva.iva19),
    ]);
    wsIva.addRow([]);

    const totalIvaRow = wsIva.addRow([
      'TOTAL IVA A DECLARAR',
      this.formatCurrency(resumen.resumenIva.totalIva),
    ]);
    totalIvaRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFF3cd' },
      };
    });

    const totalBrutoRow = wsIva.addRow([
      'TOTAL INGRESOS BRUTOS',
      this.formatCurrency(resumen.resumenIva.totalBruto),
    ]);
    totalBrutoRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFd4edda' },
      };
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-contable-${resumen.periodo.mes}-${resumen.periodo.anio}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
