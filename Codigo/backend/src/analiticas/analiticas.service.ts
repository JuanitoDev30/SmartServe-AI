import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import {
  Prospecto,
  EstadoProspecto,
} from '../prospecto/entities/prospecto.entity';
import { Reunion, EstadoReunion } from '../reunion/entities/reunion.entity';
import { Proyecto } from '../proyecto/entities/proyecto.entity';

@Injectable()
export class AnaliticasService {
  constructor(
    @InjectRepository(Prospecto)
    private readonly prospectoRepo: Repository<Prospecto>,
    @InjectRepository(Reunion)
    private readonly reunionRepo: Repository<Reunion>,
    @InjectRepository(Proyecto)
    private readonly proyectoRepo: Repository<Proyecto>,
  ) {}

  /**
   * Tarjetas resumen para el dashboard: clientes nuevos, agendados,
   * convertidos y tasa de conversión, en una ventana de tiempo.
   */
  async resumenGeneral(diasAtras = 30) {
    const fechaDesde = new Date();
    fechaDesde.setDate(fechaDesde.getDate() - diasAtras);

    const [
      clientesNuevos,
      clientesAgendados,
      clientesConvertidos,
      totalClientes,
    ] = await Promise.all([
      this.prospectoRepo.count({
        where: { creadoEn: MoreThanOrEqual(fechaDesde) },
      }),
      this.prospectoRepo.count({
        where: { estado: EstadoProspecto.REUNION_AGENDADA },
      }),
      this.prospectoRepo.count({
        where: { estado: EstadoProspecto.CONVERTIDO },
      }),
      this.prospectoRepo.count(),
    ]);

    const tasaConversion =
      totalClientes > 0 ? (clientesConvertidos / totalClientes) * 100 : 0;

    return {
      periodo: { dias: diasAtras, desde: fechaDesde },
      clientesNuevos,
      clientesAgendados,
      clientesConvertidos,
      totalClientes,
      tasaConversion: Number(tasaConversion.toFixed(2)),
    };
  }

  /** Ranking de proyectos según cuántos prospectos los marcaron como interés */
  async proyectosMasInteres(limite = 5) {
    return this.prospectoRepo
      .createQueryBuilder('p')
      .select('proyecto.id', 'proyectoId')
      .addSelect('proyecto.nombre', 'nombre')
      .addSelect('COUNT(p.id)', 'totalInteresados')
      .innerJoin('p.proyectoInteres', 'proyecto')
      .groupBy('proyecto.id')
      .addGroupBy('proyecto.nombre')
      .orderBy('"totalInteresados"', 'DESC')
      .limit(limite)
      .getRawMany();
  }

  /** Distribución de clientes por estado del embudo (funnel) */
  async clientesPorEstado() {
    const resultado = await this.prospectoRepo
      .createQueryBuilder('p')
      .select('p.estado', 'estado')
      .addSelect('COUNT(p.id)', 'total')
      .groupBy('p.estado')
      .getRawMany();

    return resultado.map((r) => ({ estado: r.estado, total: Number(r.total) }));
  }

  /** Distribución de reuniones por estado (pendiente, realizada, cancelada...) */
  async reunionesPorEstado() {
    const resultado = await this.reunionRepo
      .createQueryBuilder('r')
      .select('r.estado', 'estado')
      .addSelect('COUNT(r.id)', 'total')
      .groupBy('r.estado')
      .getRawMany();

    return resultado.map((r) => ({ estado: r.estado, total: Number(r.total) }));
  }

  /** Cuántas reuniones confirmadas hay en los próximos N días */
  async reunionesProximas(dias = 7) {
    const desde = new Date();
    const hasta = new Date();
    hasta.setDate(hasta.getDate() + dias);

    return this.reunionRepo
      .createQueryBuilder('r')
      .where('r.fechaHora BETWEEN :desde AND :hasta', { desde, hasta })
      .andWhere('r.estado IN (:...estados)', {
        estados: [EstadoReunion.PENDIENTE, EstadoReunion.CONFIRMADA],
      })
      .getCount();
  }

  async proyectosActivosCount() {
    return this.proyectoRepo.count({ where: { activo: true } });
  }
}
