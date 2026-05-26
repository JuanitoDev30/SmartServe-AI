import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Repository } from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { EstadoPedido } from 'src/pedido/enum/pedidoEstado.enum';
import { VentasService } from 'src/ventas/ventas.service';

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
    const ahora = new Date();
    const hoyInicio = new Date(ahora);
    hoyInicio.setHours(0, 0, 0, 0);
    const hoyFin = new Date(ahora);
    hoyFin.setHours(23, 59, 59, 999);

    const mesInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const mesAnteriorInicio = new Date(
      ahora.getFullYear(),
      ahora.getMonth() - 1,
      1,
    );
    const mesAnteriorFin = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    const semanaInicio = new Date(ahora);
    semanaInicio.setDate(semanaInicio.getDate() - 6);
    semanaInicio.setHours(0, 0, 0, 0);

    const [
      pedidosHoy,
      pedidosPendientes,
      pedidosEnCamino,
      pedidosCompletados,
      ingresosHoy,
      ingresosMes,
      ingresosSemana,
      ingresosMesAnterior,
      clientesTotal,
      clientesNuevos,
      productosStockBajo,
      pedidosRecientes,
      resumenVentas,
    ] = await Promise.all([
      // Pedidos creados hoy
      this.pedidoRepository
        .createQueryBuilder('pedido')
        .where('pedido.creadoEn BETWEEN :inicio AND :fin', {
          inicio: hoyInicio,
          fin: hoyFin,
        })
        .getCount(),

      // Pedidos pendientes
      this.pedidoRepository.count({
        where: { estado: EstadoPedido.PENDIENTE },
      }),

      // Pedidos en camino (nuevo)
      this.pedidoRepository.count({
        where: { estado: EstadoPedido.EN_CAMINO },
      }),

      // Pedidos completados total
      this.pedidoRepository.count({
        where: { estado: EstadoPedido.ENTREGADO },
      }),

      // Ingresos hoy
      this.pedidoRepository
        .createQueryBuilder('pedido')
        .select('SUM(pedido.total)', 'total')
        .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
        .andWhere('pedido.actualizadoEn BETWEEN :inicio AND :fin', {
          inicio: hoyInicio,
          fin: hoyFin,
        })
        .getRawOne(),

      // Ingresos este mes
      this.pedidoRepository
        .createQueryBuilder('pedido')
        .select('SUM(pedido.total)', 'total')
        .addSelect('COUNT(pedido.id)', 'count')
        .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
        .andWhere('pedido.actualizadoEn >= :inicio', { inicio: mesInicio })
        .getRawOne(),

      // Ingresos esta semana (nuevo)
      this.pedidoRepository
        .createQueryBuilder('pedido')
        .select('SUM(pedido.total)', 'total')
        .addSelect('COUNT(pedido.id)', 'count')
        .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
        .andWhere('pedido.actualizadoEn >= :inicio', { inicio: semanaInicio })
        .getRawOne(),

      // Ingresos mes anterior
      this.pedidoRepository
        .createQueryBuilder('pedido')
        .select('SUM(pedido.total)', 'total')
        .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
        .andWhere('pedido.actualizadoEn BETWEEN :inicio AND :fin', {
          inicio: mesAnteriorInicio,
          fin: mesAnteriorFin,
        })
        .getRawOne(),

      // Total clientes
      this.clienteRepository.count(),

      // Clientes nuevos este mes
      this.clienteRepository
        .createQueryBuilder('cliente')
        .where('cliente.creadoEn >= :inicio', { inicio: mesInicio })
        .getCount(),

      // Productos con stock bajo
      this.productoRepository
        .createQueryBuilder('producto')
        .where('producto.stock <= :stock', { stock: 5 })
        .andWhere('producto.stock > 0')
        .select(['producto.id', 'producto.nombre', 'producto.stock'])
        .orderBy('producto.stock', 'ASC')
        .limit(5)
        .getMany(),

      // Últimos 5 pedidos
      this.pedidoRepository
        .createQueryBuilder('pedido')
        .innerJoinAndSelect('pedido.cliente', 'cliente')
        .innerJoinAndSelect('pedido.items', 'item')
        .innerJoinAndSelect('item.producto', 'producto')
        .orderBy('pedido.creadoEn', 'DESC')
        .limit(5)
        .getMany(),

      // Resumen de ventas de VentasService (incluye ticketPromedio real)
      this.ventasService.getResumen(),
    ]);

    const ingresosHoyTotal = parseFloat(ingresosHoy?.total) || 0;
    const ingresosMesTotal = parseFloat(ingresosMes?.total) || 0;
    const ingresosSemanaTotal = parseFloat(ingresosSemana?.total) || 0;
    const ingresosMesAnteriorTotal =
      parseFloat(ingresosMesAnterior?.total) || 0;
    const pedidosMesCount = parseInt(ingresosMes?.count) || 0;
    const pedidosSemanaCount = parseInt(ingresosSemana?.count) || 0;

    const variacionMes =
      ingresosMesAnteriorTotal > 0
        ? ((ingresosMesTotal - ingresosMesAnteriorTotal) /
            ingresosMesAnteriorTotal) *
          100
        : 100;

    return {
      pedidos: {
        hoy: pedidosHoy,
        pendientes: pedidosPendientes,
        enCamino: pedidosEnCamino,
        completadosTotal: pedidosCompletados,
        // Conteos por período para el filtro de tiempo en el frontend
        semana: pedidosSemanaCount,
        mes: pedidosMesCount,
      },
      ingresos: {
        hoy: ingresosHoyTotal,
        esteMes: ingresosMesTotal,
        estaSemana: ingresosSemanaTotal,
        variacion: Math.round(variacionMes * 100) / 100,
        tendencia: variacionMes >= 0 ? ('up' as const) : ('down' as const),
      },
      clientes: {
        total: clientesTotal,
        nuevosEsteMes: clientesNuevos,
      },
      // ticketPromedio real desde VentasService (mes.total / mes.count)
      ticketPromedio: resumenVentas.ticketPromedio,
      productosStockBajo,
      pedidosRecientes,
    };
  }
}
