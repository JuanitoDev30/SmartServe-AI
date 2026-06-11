import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Repository } from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { EstadoPedido } from 'src/pedido/enum/pedidoEstado.enum';
import { VentasService } from 'src/ventas/ventas.service';

const TZ_OFFSET_MS = 5 * 60 * 60 * 1000;

function getRangosLocalCO() {
  const ahoraLocalStr = new Date().toLocaleString('sv-SE', {
    timeZone: 'America/Bogota',
  });
  const ahoraLocal = new Date(ahoraLocalStr);

  const y = ahoraLocal.getFullYear();
  const m = ahoraLocal.getMonth();
  const d = ahoraLocal.getDate();

  const OFFSET = 5 * 60 * 60 * 1000;

  const hoyInicio = new Date(Date.UTC(y, m, d, 0, 0, 0, 0) + OFFSET);
  const hoyFin = new Date(Date.UTC(y, m, d, 23, 59, 59, 999) + OFFSET);

  // semanaInicio = hace 6 días a las 00:00 Colombia
  const semanaInicio = new Date(Date.UTC(y, m, d - 6, 0, 0, 0, 0) + OFFSET);

  const mesInicio = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0) + OFFSET);
  const mesFin = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999) + OFFSET);

  const mesAnteriorInicio = new Date(
    Date.UTC(y, m - 1, 1, 0, 0, 0, 0) + OFFSET,
  );
  const mesAnteriorFin = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999) + OFFSET);

  return {
    hoyInicio,
    hoyFin,
    semanaInicio,
    mesInicio,
    mesFin,
    mesAnteriorInicio,
    mesAnteriorFin,
  };
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly ventasService: VentasService,
  ) {}

  async getOverview() {
    const {
      hoyInicio,
      hoyFin,
      semanaInicio,
      mesInicio,
      mesFin,
      mesAnteriorInicio,
      mesAnteriorFin,
    } = getRangosLocalCO();

    const [
      pedidosCreadosHoy,
      pedidosPendientes,
      pedidosEnCamino,
      pedidosCompletados,
      ingresosHoy,
      ingresosSemana,
      ingresosMes,
      ingresosMesAnterior,
      pedidosSemana,
      pedidosMes,
      clientesTotal,
      clientesNuevos,
      productosStockBajo,
      pedidosRecientes,
      resumenVentas,
      stockPorCategoriaRaw,
    ] = await Promise.all([
      this.pedidoRepository
        .createQueryBuilder('pedido')
        .where('pedido.creadoEn BETWEEN :inicio AND :fin', {
          inicio: hoyInicio,
          fin: hoyFin,
        })
        .getCount(),

      this.pedidoRepository.count({
        where: { estado: EstadoPedido.PENDIENTE },
      }),
      this.pedidoRepository.count({
        where: { estado: EstadoPedido.EN_CAMINO },
      }),
      this.pedidoRepository.count({
        where: { estado: EstadoPedido.ENTREGADO },
      }),

      // Ingresos y pedidos ENTREGADOS hoy
      this.pedidoRepository
        .createQueryBuilder('pedido')
        .select('COALESCE(SUM(pedido.total), 0)', 'total')
        .addSelect('COUNT(pedido.id)', 'count')
        .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
        .andWhere('pedido.actualizadoEn BETWEEN :inicio AND :fin', {
          inicio: hoyInicio,
          fin: hoyFin,
        })
        .getRawOne(),

      // Ingresos semana
      this.pedidoRepository
        .createQueryBuilder('pedido')
        .select('COALESCE(SUM(pedido.total), 0)', 'total')
        .addSelect('COUNT(pedido.id)', 'count')
        .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
        .andWhere('pedido.actualizadoEn BETWEEN :inicio AND :fin', {
          inicio: semanaInicio,
          fin: hoyFin,
        })
        .getRawOne(),

      // Ingresos mes
      this.pedidoRepository
        .createQueryBuilder('pedido')
        .select('COALESCE(SUM(pedido.total), 0)', 'total')
        .addSelect('COUNT(pedido.id)', 'count')
        .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
        .andWhere('pedido.actualizadoEn BETWEEN :inicio AND :fin', {
          inicio: mesInicio,
          fin: mesFin,
        })
        .getRawOne(),

      // Ingresos mes anterior (para variación)
      this.pedidoRepository
        .createQueryBuilder('pedido')
        .select('COALESCE(SUM(pedido.total), 0)', 'total')
        .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
        .andWhere('pedido.actualizadoEn BETWEEN :inicio AND :fin', {
          inicio: mesAnteriorInicio,
          fin: mesAnteriorFin,
        })
        .getRawOne(),

      // Conteo pedidos entregados semana
      this.pedidoRepository
        .createQueryBuilder('pedido')
        .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
        .andWhere('pedido.actualizadoEn BETWEEN :inicio AND :fin', {
          inicio: semanaInicio,
          fin: hoyFin,
        })
        .getCount(),

      // Conteo pedidos entregados mes
      this.pedidoRepository
        .createQueryBuilder('pedido')
        .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
        .andWhere('pedido.actualizadoEn BETWEEN :inicio AND :fin', {
          inicio: mesInicio,
          fin: mesFin,
        })
        .getCount(),

      this.clienteRepository.count(),

      this.clienteRepository
        .createQueryBuilder('cliente')
        .where('cliente.creadoEn BETWEEN :inicio AND :fin', {
          inicio: mesInicio,
          fin: mesFin,
        })
        .getCount(),

      this.productoRepository
        .createQueryBuilder('producto')
        .where('producto.stock <= :stock', { stock: 5 })
        .andWhere('producto.stock > 0')
        .select(['producto.id', 'producto.nombre', 'producto.stock'])
        .orderBy('producto.stock', 'ASC')
        .limit(5)
        .getMany(),

      this.pedidoRepository
        .createQueryBuilder('pedido')
        .innerJoinAndSelect('pedido.cliente', 'cliente')
        .innerJoinAndSelect('pedido.items', 'item')
        .innerJoinAndSelect('item.producto', 'producto')
        .orderBy('pedido.creadoEn', 'DESC')
        .limit(5)
        .getMany(),

      this.ventasService.getResumen(),

      this.productoRepository
        .createQueryBuilder('producto')
        .innerJoin('producto.categoria', 'categoria')
        .select('categoria.nombre', 'categoria')
        .addSelect('SUM(producto.stock)', 'totalStock')
        .addSelect('COUNT(producto.id)', 'totalProductos')
        .where('producto.stock > 0')
        .andWhere('producto.deletedAt IS NULL')
        .andWhere("producto.status != 'inactive'")
        .groupBy('categoria.nombre')
        .orderBy('"totalStock"', 'DESC')
        .getRawMany(),
    ]);

    const ingresosHoyTotal = parseFloat(ingresosHoy?.total) || 0;
    const ingresosSemanaTotal = parseFloat(ingresosSemana?.total) || 0;
    const ingresosMesTotal = parseFloat(ingresosMes?.total) || 0;
    const ingresosMesAnteriorTotal =
      parseFloat(ingresosMesAnterior?.total) || 0;
    // Pedidos entregados hoy — consistente con ingresos hoy
    const pedidosEntregadosHoy = parseInt(ingresosHoy?.count) || 0;

    const stockPorCategoria = stockPorCategoriaRaw.map(
      (item: {
        categoria: string;
        totalStock: string;
        totalProductos: string;
      }) => ({
        categoria: item.categoria,
        totalStock: parseInt(item.totalStock, 10) || 0,
        totalProductos: parseInt(item.totalProductos, 10) || 0,
      }),
    );

    const variacionMes =
      ingresosMesAnteriorTotal > 0
        ? ((ingresosMesTotal - ingresosMesAnteriorTotal) /
            ingresosMesAnteriorTotal) *
          100
        : 100;

    return {
      pedidos: {
        hoy: pedidosEntregadosHoy, // entregados hoy (coherente con ingresos hoy)
        creadosHoy: pedidosCreadosHoy, // creados hoy (cualquier estado)
        pendientes: pedidosPendientes,
        enCamino: pedidosEnCamino,
        completadosTotal: pedidosCompletados,
        semana: pedidosSemana,
        mes: pedidosMes,
      },
      ingresos: {
        hoy: ingresosHoyTotal,
        estaSemana: ingresosSemanaTotal,
        esteMes: ingresosMesTotal,
        variacion: Math.round(variacionMes * 100) / 100,
        tendencia: variacionMes >= 0 ? ('up' as const) : ('down' as const),
      },
      clientes: {
        total: clientesTotal,
        nuevosEsteMes: clientesNuevos,
      },
      ticketPromedio: resumenVentas.ticketPromedio,
      productosStockBajo,
      stockPorCategoria,
      pedidosRecientes,
    };
  }
}
