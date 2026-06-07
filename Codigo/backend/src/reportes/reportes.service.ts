import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { Pedido } from '../pedido/entities/pedido.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Producto } from '../producto/entities/producto.entity';
import { EstadoPedido } from '../pedido/enum/pedidoEstado.enum';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

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

  private createPdfBase(titulo: string, subtitulo: string): PDFKit.PDFDocument {
    const doc = new PDFDocument({
      margin: 40,
      size: 'A4',
      bufferPages: true,
    });

    doc.rect(0, 0, doc.page.width, 80).fill('#1a1a2e');
    doc
      .fillColor('#ffffff')
      .fontSize(18)
      .font('Helvetica-Bold')
      .text(titulo, 40, 25);

    doc.fontSize(10).font('Helvetica').text(subtitulo, 40, 50);
    doc.fillColor('#000000').moveDown(3);
    return doc;
  }

  private addPdfTableHeader(
    doc: PDFKit.PDFDocument,
    headers: string[],
    widths: number[],
    y: number,
  ): number {
    const x = 40;
    let currentX = x;
    doc.rect(x, y, doc.page.width - 80, 20).fill('#f0f0f0');
    doc.fillColor('#333333').fontSize(8).font('Helvetica-Bold');

    headers.forEach((header, i) => {
      doc.text(header, currentX + 3, y + 6, {
        width: widths[i],
        ellipsis: true,
      });
      currentX += widths[i];
    });

    doc.fillColor('#000000').font('Helvetica');
    return y + 22;
  }

  private addPdfTableRow(
    doc: PDFKit.PDFDocument,
    values: string[],
    widths: number[],
    y: number,
    isEven: boolean,
  ): number {
    const x = 40;
    let currentX = x;

    if (isEven) {
      doc.rect(x, y, doc.page.width - 80, 18).fill('#fafafa');
    }
    doc.fillColor('#333333').fontSize(7.5).font('Helvetica');

    values.forEach((value, i) => {
      doc.text(value ?? '-', currentX + 3, y + 5, {
        width: widths[i] - 6,
        ellipsis: true,
      });
      currentX += widths[i];
    });
    doc.fillColor('#0000000');
    return y + 20;
  }

  private addPdfTotalRow(
    doc: PDFKit.PDFDocument,
    values: string[],
    widths: number[],
    y: number,
  ): number {
    const x = 40;
    let currentX = x;

    doc.rect(x, y, doc.page.width - 80, 20).fill('#1a1a2e');
    doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');

    values.forEach((value, i) => {
      doc.text(value ?? '', currentX + 3, y + 6, {
        width: widths[i] - 6,
        ellipsis: true,
      });
      currentX += widths[i];
    });

    doc.fillColor('#000000').font('Helvetica');
    return y + 22;
  }

  private checkNewPage(
    doc: PDFKit.PDFDocument,
    y: number,
    threshold = 750,
  ): number {
    if (y > threshold) {
      doc.addPage();
      return 40;
    }
    return y;
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

    if (formato === 'pdf') {
      return this.exportVentasPdf(resumen, res);
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

  // pdf Ventas

  private exportVentasPdf(resumen: any, res: Response) {
    const doc = this.createPdfBase(
      'Reporte de Ventas',
      `Período: ${resumen.periodo.inicio} al ${resumen.periodo.fin}`,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-ventas-${resumen.periodo.inicio}-${resumen.periodo.fin}.pdf`,
    );
    doc.pipe(res);

    //resumen

    let y = 100;
    doc.fontSize(11).font('Helvetica-Bold').text('RESUMEN GENERAL', 40, y);
    y += 20;

    const resumenItems = [
      ['Total Ventas', resumen.totalVentas.toString()],
      ['Ingresos Brutos', this.formatCurrency(resumen.totalBruto)],
      ['Total IVA', this.formatCurrency(resumen.totalIva)],
      ['Ingresos Netos (sin IVA)', this.formatCurrency(resumen.totalNeto)],
    ];

    resumenItems.forEach(([label, value], i) => {
      doc.rect(40, y, 250, 18).fill(i % 2 === 0 ? '#f0f0f0' : '#fafafa');
      doc
        .fillColor('#333')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text(label, 45, y + 5);
      doc.font('Helvetica').text(value, 200, y + 5);
      doc.fillColor('#000');
      y += 20;
    });
    y += 20;

    // Tabla detalle

    doc.fontSize(11).font('Helvetica-Bold').text('DETALLE DE VENTAS', 40, y);
    y += 15;
    const headers = [
      'Fecha',
      'Cliente',
      'Productos',
      'Método',
      'Base',
      'IVA',
      'Total',
    ];
    const widths = [65, 90, 120, 55, 55, 45, 55];
    y = this.addPdfTableHeader(doc, headers, widths, y);

    resumen.ventas.forEach((v: any, i: number) => {
      y = this.checkNewPage(doc, y);
      y = this.addPdfTableRow(
        doc,
        [
          new Date(v.fecha).toLocaleDateString('es-CO'),
          v.cliente,
          v.productos.map((p: any) => `${p.nombre} x${p.cantidad}`).join(', '),
          v.metodoPago,
          this.formatCurrency(v.subtotal),
          this.formatCurrency(v.iva),
          this.formatCurrency(v.total),
        ],
        widths,
        y,
        i % 2 === 0,
      );
    });

    y = this.addPdfTotalRow(
      doc,
      [
        '',
        'TOTALES',
        '',
        '',
        this.formatCurrency(resumen.totalNeto),
        this.formatCurrency(resumen.totalIva),
        this.formatCurrency(resumen.totalBruto),
      ],
      widths,
      y,
    );

    doc.end();
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
    if (formato === 'pdf') return this.exportProductosPdf(resumen, res);
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

  //PDF productos

  private exportProductosPdf(resumen: any, res: Response) {
    const doc = this.createPdfBase(
      'Reporte de Productos',
      `Período: ${resumen.periodo.inicio} al ${resumen.periodo.fin}`,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-productos-${resumen.periodo.inicio}-${resumen.periodo.fin}.pdf`,
    );
    doc.pipe(res);

    let y = 100;
    doc.fontSize(11).font('Helvetica-Bold').text('PRODUCTOS VENDIDOS', 40, y);
    y += 15;

    const headers = [
      '#',
      'Producto',
      'Categoría',
      'IVA%',
      'Uds Vendidas',
      'Pedidos',
      'Stock',
      'Ingresos',
    ];
    const widths = [25, 110, 80, 35, 55, 45, 45, 70];

    y = this.addPdfTableHeader(doc, headers, widths, y);

    resumen.productos.forEach((p: any, i: number) => {
      y = this.checkNewPage(doc, y);
      y = this.addPdfTableRow(
        doc,
        [
          (i + 1).toString(),
          p.nombre,
          p.categoria,
          `${p.ivaPercent}%`,
          p.cantidadVendida.toString(),
          p.pedidos.toString(),
          `${p.stockActual} uds`,
          this.formatCurrency(p.ingresos),
        ],
        widths,
        y,
        i % 2 === 0,
      );
    });

    doc.end();
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
      .orderBy('"totalGastado"', 'DESC')
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
    if (formato === 'pdf') return this.exportClientesPdf(resumen, res);
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

  //PDF clientes

  private exportClientesPdf(resumen: any, res: Response) {
    const doc = this.createPdfBase(
      'Reporte de Clientes',
      `Período: ${resumen.periodo.inicio} al ${resumen.periodo.fin}`,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-clientes-${resumen.periodo.inicio}-${resumen.periodo.fin}.pdf`,
    );
    doc.pipe(res);

    let y = 100;
    doc.fontSize(11).font('Helvetica-Bold').text('CLIENTES CON COMPRAS', 40, y);
    y += 15;

    const headers = [
      '#',
      'Cliente',
      'Teléfono',
      'Email',
      'Pedidos',
      'Ticket Prom.',
      'Total Gastado',
      'Última Compra',
    ];
    const widths = [25, 100, 70, 90, 40, 65, 70, 65];

    y = this.addPdfTableHeader(doc, headers, widths, y);

    resumen.clientes.forEach((c: any, i: number) => {
      y = this.checkNewPage(doc, y);
      y = this.addPdfTableRow(
        doc,
        [
          (i + 1).toString(),
          c.nombre,
          c.telefono,
          c.email ?? 'N/A',
          c.totalPedidos.toString(),
          this.formatCurrency(c.ticketPromedio),
          this.formatCurrency(c.totalGastado),
          new Date(c.ultimaCompra).toLocaleDateString('es-CO'),
        ],
        widths,
        y,
        i % 2 === 0,
      );
    });

    doc.end();
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
    if (formato === 'pdf') return this.exportContablePdf(resumen, res);
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

  //PDF Contable

  private exportContablePdf(resumen: any, res: Response) {
    const doc = this.createPdfBase(
      `Reporte Contable — ${resumen.periodo.mes} ${resumen.periodo.anio}`,
      `Declaración IVA | ${resumen.empresa}`,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-contable-${resumen.periodo.mes}-${resumen.periodo.anio}.pdf`,
    );
    doc.pipe(res);

    let y = 100;

    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .text('RESUMEN DECLARACIÓN IVA', 40, y);
    y += 20;

    const ivaItems = [
      [
        'Ventas Exentas (0%)',
        this.formatCurrency(resumen.resumenIva.baseExenta),
        '',
      ],
      [
        'Base Gravable 5%',
        this.formatCurrency(resumen.resumenIva.baseGravable5),
        `IVA: ${this.formatCurrency(resumen.resumenIva.iva5)}`,
      ],
      [
        'Base Gravable 19%',
        this.formatCurrency(resumen.resumenIva.baseGravable19),
        `IVA: ${this.formatCurrency(resumen.resumenIva.iva19)}`,
      ],
      [
        'Total Base Neta',
        this.formatCurrency(resumen.resumenIva.totalBase),
        '',
      ],
      [
        'TOTAL IVA A DECLARAR',
        this.formatCurrency(resumen.resumenIva.totalIva),
        '',
      ],
      [
        'TOTAL INGRESOS BRUTOS',
        this.formatCurrency(resumen.resumenIva.totalBruto),
        '',
      ],
    ];

    ivaItems.forEach(([label, value, extra], i) => {
      const isTotal = label.startsWith('TOTAL');
      doc
        .rect(40, y, 400, 20)
        .fill(isTotal ? '#1a1a2e' : i % 2 === 0 ? '#f0f0f0' : '#fafafa');
      doc
        .fillColor(isTotal ? '#ffff' : '#333333')
        .fontSize(9)
        .font(isTotal ? 'Helvetica-Bold' : 'Helvetica')
        .text(label, 45, y + 6, { width: 180 });

      doc.text(value, 230, y + 6, { width: 100 });
      if (extra)
        doc
          .fillColor('#666')
          .fontSize(8)
          .text(extra, 340, y + 6);
      doc.fillColor('#000000');
      y += 22;
    });

    y += 20;

    doc.fontSize(11).font('Helvetica-Bold').text('LIBRO DE VENTAS', 40, y);
    y += 15;

    const headers = [
      'Consec.',
      'Fecha',
      'Cliente',
      'NIT/Tel',
      'Descripción',
      'Método',
      'Base',
      'IVA',
      'Total',
    ];
    const widths = [45, 50, 80, 65, 95, 45, 55, 45, 55];

    y = this.addPdfTableHeader(doc, headers, widths, y);

    resumen.ventas.forEach((v: any, i: number) => {
      y = this.checkNewPage(doc, y);
      y = this.addPdfTableRow(
        doc,
        [
          v.consecutivo,
          v.fecha,
          v.cliente,
          v.nit,
          v.descripcion,
          v.metodoPago,
          this.formatCurrency(v.baseGravable),
          this.formatCurrency(v.iva),
          this.formatCurrency(v.total),
        ],
        widths,
        y,
        i % 2 === 0,
      );
    });

    this.addPdfTotalRow(
      doc,
      [
        '',
        '',
        'TOTALES',
        '',
        '',
        '',
        this.formatCurrency(resumen.resumenIva.totalBase),
        this.formatCurrency(resumen.resumenIva.totalIva),
        this.formatCurrency(resumen.resumenIva.totalBruto),
      ],
      widths,
      y,
    );

    doc.end();
  }
}
