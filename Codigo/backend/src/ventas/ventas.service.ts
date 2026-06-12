import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Repository } from 'typeorm';
import { EstadoPedido } from 'src/pedido/enum/pedidoEstado.enum';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
  ) {}

  //Helpers

  private getRangos() {
    const ahora = new Date();

    const hoyInicio = new Date(ahora);
    hoyInicio.setHours(0, 0, 0, 0);

    const hoyFin = new Date(ahora);
    hoyFin.setHours(23, 59, 59, 999);

    const semanaInicio = new Date(ahora);
    semanaInicio.setDate(semanaInicio.getDate() - 6);
    semanaInicio.setHours(0, 0, 0, 0);

    const mesInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const mesFin = new Date(
      ahora.getFullYear(),
      ahora.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const anioInicio = new Date(ahora.getFullYear(), 0, 1);
    const anioFin = new Date(ahora.getFullYear(), 11, 31, 23, 59, 59, 999);

    // Mes anterior para comparativa

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

    return {
      hoy: { inicio: hoyInicio, fin: hoyFin },
      semana: { inicio: semanaInicio, fin: hoyFin },
      mes: { inicio: mesInicio, fin: mesFin },
      anio: { inicio: anioInicio, fin: anioFin },
      mesAnterior: { inicio: mesAnteriorInicio, fin: mesAnteriorFin },
    };
  }

  private async getIngresosPorRango(
    inicio: Date,
    fin: Date,
  ): Promise<{ total: number; count: number }> {
    const resultado = await this.pedidoRepository
      .createQueryBuilder('pedido')
      .select('SUM(pedido.total)', 'total')
      .addSelect('COUNT(pedido.id)', 'count')
      .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
      .andWhere('pedido.actualizadoEn BETWEEN :inicio AND :fin', {
        inicio,
        fin,
      })
      .getRawOne();

    return {
      total: parseFloat(resultado.total) || 0,
      count: parseInt(resultado.count) || 0,
    };
  }

  // Resumen

  async getResumen() {
    const rangos = this.getRangos();

    const [hoy, semana, mes, anio, mesAnterior] = await Promise.all([
      this.getIngresosPorRango(rangos.hoy.inicio, rangos.hoy.fin),
      this.getIngresosPorRango(rangos.semana.inicio, rangos.semana.fin),
      this.getIngresosPorRango(rangos.mes.inicio, rangos.mes.fin),
      this.getIngresosPorRango(rangos.anio.inicio, rangos.anio.fin),
      this.getIngresosPorRango(
        rangos.mesAnterior.inicio,
        rangos.mesAnterior.fin,
      ),
    ]);

    // Comparativa mes vs mes anterior

    const variacionMes =
      mesAnterior.total > 0
        ? ((mes.total - mesAnterior.total) / mesAnterior.total) * 100
        : 100; // Si el mes anterior no tuvo ventas, consideramos una variación del 100%

    const ticketPromedio = mes.count > 0 ? mes.total / mes.count : 0;

    return {
      hoy: { ingresos: hoy.total, ventas: hoy.count },
      semana: { ingresos: semana.total, ventas: semana.count },
      mes: { ingresos: mes.total, ventas: mes.count },
      anio: { ingresos: anio.total, ventas: anio.count },
      comparativa: {
        mesAnterior: mesAnterior.total,
        variacionPorcentaje: Math.round(variacionMes * 100) / 100,
        tendencia: variacionMes >= 0 ? 'up' : 'down',
      },
      ticketPromedio,
    };
  }

  //Grafica

  async getGrafica(periodo: 'dia' | 'semana' | 'mes') {
    const ahora = new Date();

    let inicio: Date;
    let formato: string;

    if (periodo === 'dia') {
      inicio = new Date(ahora);
      inicio.setHours(0, 0, 0, 0);

      formato = 'HH24';
    } else if (periodo === 'semana') {
      inicio = new Date(ahora);
      inicio.setDate(ahora.getDate() - 6);
      inicio.setHours(0, 0, 0, 0);

      formato = 'YYYY-MM-DD';
    } else {
      inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

      formato = 'YYYY-MM-DD';
    }

    const datos = await this.pedidoRepository
      .createQueryBuilder('pedido')
      .select(
        `TO_CHAR(
        pedido."actualizadoEn" AT TIME ZONE 'America/Bogota',
        '${formato}'
      )`,
        'label',
      )
      .addSelect('SUM(pedido.total)', 'total')
      .addSelect('COUNT(pedido.id)', 'count')
      .where('pedido.estado = :estado', {
        estado: EstadoPedido.ENTREGADO,
      })
      .andWhere('pedido."actualizadoEn" >= :inicio', {
        inicio,
      })
      .groupBy(
        `TO_CHAR(
        pedido."actualizadoEn" AT TIME ZONE 'America/Bogota',
        '${formato}'
      )`,
      )
      .orderBy(
        `TO_CHAR(
        pedido."actualizadoEn" AT TIME ZONE 'America/Bogota',
        '${formato}'
      )`,
        'ASC',
      )
      .getRawMany();

    const mapa = new Map(
      datos.map((d) => [
        d.label,
        {
          total: Number(d.total) || 0,
          count: Number(d.count) || 0,
        },
      ]),
    );

    if (periodo === 'dia') {
      return Array.from({ length: 24 }, (_, hora) => {
        const label = hora.toString().padStart(2, '0');

        return {
          label,
          total: mapa.get(label)?.total ?? 0,
          count: mapa.get(label)?.count ?? 0,
        };
      });
    }

    if (periodo === 'semana') {
      return Array.from({ length: 7 }, (_, i) => {
        const fecha = new Date();
        fecha.setDate(ahora.getDate() - 6 + i);

        const label = fecha.toISOString().split('T')[0];

        return {
          label,
          total: mapa.get(label)?.total ?? 0,
          count: mapa.get(label)?.count ?? 0,
        };
      });
    }

    const diasTranscurridos = ahora.getDate();

    return Array.from({ length: diasTranscurridos }, (_, i) => {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth(), i + 1);

      const label = fecha.toISOString().split('T')[0];

      return {
        label,
        total: mapa.get(label)?.total ?? 0,
        count: mapa.get(label)?.count ?? 0,
      };
    });
  }

  // Top Productos

  async getTopProductos(
    limit = 5,
    periodo: 'semana' | 'mes' | 'anio' | 'todo' = 'mes',
  ) {
    const ahora = new Date();
    let inicio: Date | null = null;

    if (periodo === 'semana') {
      inicio = new Date(ahora);
      inicio.setDate(ahora.getDate() - 6);
      inicio.setHours(0, 0, 0, 0);
    } else if (periodo === 'mes') {
      inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    } else if (periodo === 'anio') {
      inicio = new Date(ahora.getFullYear(), 0, 1);
    }

    const query = this.pedidoRepository
      .createQueryBuilder('pedido')
      .innerJoin('pedido.items', 'item')
      .innerJoin('item.producto', 'producto')
      .select('producto.id', 'id')
      .addSelect('producto.nombre', 'nombre')
      .addSelect('SUM(item.cantidad)', 'cantidadTotal')
      .addSelect('SUM(item.subtotalItem)', 'ingresos')
      .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO });

    if (inicio) {
      query.andWhere('pedido.actualizadoEn >= :inicio', { inicio });
    }

    const rows = await query
      .groupBy('producto.id')
      .addGroupBy('producto.nombre')
      .orderBy('ingresos', 'DESC')
      .limit(limit)
      .getRawMany();

    return rows.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      cantidadTotal: parseInt(r.cantidadTotal) || 0,
      ingresos: parseFloat(r.ingresos) || 0,
    }));
  }

  // Metodos de pago

  async getMetodosPago() {
    const datos = await this.pedidoRepository
      .createQueryBuilder('pedido')
      .select('pedido.metodoPago', 'metodoPago')
      .addSelect('COUNT(pedido.id)', 'count')
      .addSelect('SUM(pedido.total)', 'total')
      .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO })
      .groupBy('pedido.metodoPago')
      .getRawMany();

    const totalGeneral = datos.reduce((sum, d) => sum + parseFloat(d.total), 0);

    return datos.map((d) => ({
      metodoPago: d.metodoPago,
      count: parseInt(d.count) || 0,
      total: parseFloat(d.total) || 0,
      porcentaje:
        totalGeneral > 0
          ? Math.round((parseFloat(d.total) / totalGeneral) * 100)
          : 0,
    }));
  }

  // Historial

  async getHistorial(
    page = 1,
    pageSize = 10,
    fechaInicio?: string,
    fechaFin?: string,
  ) {
    const query = this.pedidoRepository
      .createQueryBuilder('pedido')
      .innerJoinAndSelect('pedido.cliente', 'cliente')
      .innerJoinAndSelect('pedido.items', 'item')
      .innerJoinAndSelect('item.producto', 'producto')
      .where('pedido.estado = :estado', { estado: EstadoPedido.ENTREGADO });

    if (fechaInicio && fechaFin) {
      query.andWhere(
        'pedido.actualizadoEn BETWEEN :fechaInicio AND :fechaFin',
        {
          fechaInicio: new Date(fechaInicio),
          fechaFin: new Date(fechaFin),
        },
      );
    }

    query
      .orderBy('pedido.actualizadoEn', 'DESC')
      .take(pageSize)
      .skip((page - 1) * pageSize);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      pagination: {
        total,
        page,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
